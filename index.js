var ActivityStream = require('./activity-stream.js');
var SimplerEventLogger = require('./simple-event-logger.js');

var activityStream =  new ActivityStream();

activityStream
.pipe(new SimplerEventLogger())
.pipe(process.stdout);

process.stdout.on('error', function(err) {
   if (err.code == 'EPIPE') {
      process.exit(1);
   }
});
