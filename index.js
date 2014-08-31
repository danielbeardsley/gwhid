var ActivityStream = require('./activity-stream.js');
var SimplerEventLogger = require('./simple-event-logger.js');

(new ActivityStream())
.pipe(new SimplerEventLogger())
.pipe(process.stdout);
