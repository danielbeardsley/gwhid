var GitConfig = require('./git-config.js');
const { request } = require("@octokit/request");
var userPromise = GitConfig.getGithubUser();

module.exports = {
   get: function() {
      return githubPromise.then(function(github) {
         return userPromise.then(function(user) {
            return getActivity(github, user);
         });
      }).catch(console.log);
   }
};

/**
 * Given a github instance and a user, returns a Promise for the first page of
 * event.
 */
function getActivity(github, user) {
   return github.custom.getEventsFromUser(user)
   .then(addNextPageFunction);
}

/**
 * Takes a github result set and adds a 'nextPage' function that returns a
 * promise for the next page of results.
 *
 * Returns the passed result set.
 */
function addNextPageFunction(results) {
   results.nextPage = function() {
      return Promise.resolve(null);
   };
   return results;
}


var githubPromise = (function getGithub() {
   return GitConfig.getToken().then(function(token) {
      const githubRequest = request.defaults({
         headers: {
            authorization: "token " + token,
         },
         per_page: 100,
      });
      githubRequest.custom = {
         getEventsFromUser: (user) => {
            return githubRequest("GET /users/{user}/events", {user: user})
               .then((result) => result.data);
         }
      };
      return githubRequest;
   });
})();
