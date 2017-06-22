var ActivityStream = require('./activity-stream.js');
var SimplerEventLogger = require('./simple-event-logger.js');

var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
var org = argv.org;
delete argv.org;
if (Object.keys(argv) > 1) {
   console.error("Usage: gwhid [--org=GithubOrg]");
   console.error(" --org=GithubOrg: Show the events for the given organization");
   console.error("                  instead of just the current user");
   process.exit(1);
}
var activityStream =  new ActivityStream(org);

activityStream
.pipe(new SimplerEventLogger())
.pipe(process.stdout);

process.stdout.on('error', function(err) {
   if (err.code == 'EPIPE') {
      process.exit(1);
   }
});
