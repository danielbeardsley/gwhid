var GitConfig = require('./git-config.js');
var GitHubApi = require('github');
var Promise   = require("promise");

module.exports = {
   stream: function(callback) {
      Promise.all([getGithub(), GitConfig.getGithubUser()]).done(
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

function getGithub() {
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
}
