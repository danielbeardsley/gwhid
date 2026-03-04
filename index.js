var ActivityStream = require('./activity-stream.js');
var SimplerEventLogger = require('./simple-event-logger.js');
var TimeFilter = require('./time-filter.js');

var daysIndex = process.argv.indexOf('--days');
var days = daysIndex !== -1 ? Number(process.argv[daysIndex + 1]) : 1;

var activityStream =  new ActivityStream();

activityStream
.pipe(new TimeFilter(days))
.pipe(new SimplerEventLogger())
.pipe(process.stdout);

process.stdout.on('error', function(err) {
   if (err.code == 'EPIPE') {
      process.exit(1);
   }
});
