var GitConfig = require('./git-config.js');
const { request } = require("@octokit/request");
var userPromise = GitConfig.getGithubUser();

var PER_PAGE = 100;

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
   .then(function(response) {
      return addNextPageFunction(github, response);
   });
}

/**
 * Pulls the rel="next" url out of a Link response header, or null if this is
 * the last page.
 */
function nextPageUrl(link) {
   var match = /<([^>]+)>;\s*rel="next"/.exec(link || '');
   return match ? match[1] : null;
}

/**
 * Takes a github response and returns its events, with a 'nextPage' function
 * that returns a promise for the next page of results, or for null once there
 * are no more.
 *
 * We follow the Link header rather than counting pages: github serves at most
 * three pages of a user's events and answers anything past that with a 422.
 * Page sizes are also ragged -- events are filtered out after paging, so a
 * page shorter than PER_PAGE is not necessarily the last one.
 *
 * Returns the passed result set.
 */
function addNextPageFunction(github, response) {
   var results = response.data;
   var next = nextPageUrl(response.headers.link);

   results.nextPage = function() {
      if (!next) {
         return Promise.resolve(null);
      }
      return github("GET " + next).then(function(result) {
         return addNextPageFunction(github, result);
      });
   };
   return results;
}


var githubPromise = (function getGithub() {
   return GitConfig.getToken().then(function(token) {
      const githubRequest = request.defaults({
         headers: {
            authorization: "token " + token,
         },
      });
      githubRequest.custom = {
         getEventsFromUser: (user) => {
            return githubRequest("GET /users/{user}/events", {
               user: user,
               per_page: PER_PAGE,
            });
         }
      };
      return githubRequest;
   });
})();
