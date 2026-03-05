var ActivityStream = require('./activity-stream.js');
var SimplerEventLogger = require('./simple-event-logger.js');
var GroupedEventLogger = require('./grouped-event-logger.js');
var TimeFilter = require('./time-filter.js');

var daysIndex = process.argv.indexOf('--days');
var days = daysIndex !== -1 ? Number(process.argv[daysIndex + 1]) : 1;
var grouped = process.argv.indexOf('--group') !== -1;

var activityStream =  new ActivityStream();
var formatter = grouped ? new GroupedEventLogger() : new SimplerEventLogger();

activityStream
.pipe(new TimeFilter(days))
.pipe(formatter)
.pipe(process.stdout);

process.stdout.on('error', function(err) {
   if (err.code == 'EPIPE') {
      process.exit(1);
   }
});
