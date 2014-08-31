var GitConfig = require('./git-config.js');
var GitHubApi = require('github');
var Promise   = require("promise");
var userPromise = GitConfig.getGithubUser();

module.exports = {
   get: function() {
      return githubPromise.then(function(github) {
         return userPromise.then(function(user) {
            return getActivity(github, user);
         });
      });
   }
};

/**
 * Given a github instance and a user, returns a Promise for the first page of
 * event.
 */
function getActivity(github, user) {
   var options = {user:user};
   return github.custom.getEventsFromUser(options)
   .then(addNextPageFunction);
}

/**
 * Takes a github result set and adds a 'nextPage' function that returns a
 * promise for the next page of results.
 *
 * Returns the passed result set.
 */
function addNextPageFunction(results) {
   return githubPromise.then(function(github) {
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
      getNextPage:       Promise.denodeify(github.getNextPage)
   };

   return GitConfig.getToken().then(function(token) {
      github.authenticate({
         type: "oauth",
         token: token
      });
      return github;
   });
})();
