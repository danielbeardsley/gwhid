var GitConfig = require('./git-config.js');
var GitHubApi = require('github');
var Promise   = require("promise");
var userPromise = GitConfig.getGithubUser();

module.exports = {
   stream: function(callback) {
      Promise.all([githubPromise, userPromise]).done(
      function(results) {
         var github = results[0],
             user = results[1];
         console.log("User - " + user);
         github.events.getFromUser({user:user},
         function(err, events) {
            console.log("Events - " + events.length);
            events.forEach(function(event) {
               callback(event);
            });
         });
      });
   }
};


var githubPromise = (function getGithub() {
   var github = new GitHubApi({
       version: "3.0.0"
   });

   return GitConfig.getToken().then(function(token) {
      github.authenticate({
         type: "oauth",
         token: token
      });
      return github;
   });
})();
