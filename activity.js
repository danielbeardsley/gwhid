var GitConfig = require('./git-config.js');
var GitHubApi = require('github');
var Promise   = require("promise");
var userPromise = GitConfig.getGithubUser();

module.exports = {
   get: function(org) {
      return githubPromise.then(function(github) {
         return userPromise.then(function(user) {
            return getActivity(github, user, org);
         });
      });
   }
};

/**
 * Given a github instance and a user, returns a Promise for the first page of
 * event.
 */
function getActivity(github, user, org) {
   var options = {
      user:user,
      org: org
   }, events;
   if (org) {
      events = github.custom.getEventsFromOrg(options);
   } else {
      events = github.custom.getEventsFromUser(options);
   }
   return events.then(addNextPageFunction);
}

/**
 * Takes a github result set and adds a 'nextPage' function that returns a
 * promise for the next page of results.
 *
 * Returns the passed result set.
 */
function addNextPageFunction(results) {
   return githubPromise.then(function(github) {
      if (!github.hasNextPage(results)) {
         return Promise.resolve();
      }
      results.nextPage = function() {
         return github.custom.getNextPage(results)
         .then(addNextPageFunction);
      };
      return results;
   });
}


var githubPromise = (function getGithub() {
   var github = new GitHubApi({
       version: "3.0.0"
   });

   github.custom = {
      getEventsFromUser: Promise.denodeify(github.events.getFromUser),
      getEventsFromOrg:  Promise.denodeify(github.events.getFromUserOrg),
      getNextPage:       Promise.denodeify(github.getNextPage.bind(github))
   };

   return GitConfig.getToken().then(function(token) {
      github.authenticate({
         type: "oauth",
         token: token
      });
      return github;
   });
})();
