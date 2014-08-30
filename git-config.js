var childProcess  = require("child_process");
var Promise       = require("promise");

/**
 * REturns a promise for a github api token from the git config under
 * github.token.
 */
module.exports = {
   getToken: function() {
      return getGitConfig('github.token');
   },

   getGithubUser: function() {
      return getGitConfig('github.user');
   }
};

function getGitConfig(keyName) {
   return new Promise(function(resolve, reject) {
      childProcess.execFile('git', ['config', keyName], {}, 
      function(err, stdout, stderr) {
         if (err || stdout.length < 1) {
            return reject(stderr);
         }

         resolve(stdout.toString().trim());
      });
   });
}
