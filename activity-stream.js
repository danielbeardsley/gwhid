var Activity = require('./activity');
var Readable = require('stream').Readable;
var util = require('util');

/**
 * Readable stream that emits event objects from the github events api for a
 * given user
 */
function ActivityStream() {
   this.eventsPromise = Activity.get();
   this.eventIndex = 0;
   Readable.call(this, {objectMode:true});
}
util.inherits(ActivityStream, Readable);

ActivityStream.prototype._read = function () {
   pushNextEvent(this);
};

function pushNextEvent(stream) {
   stream.eventsPromise.done(function(events) {
      if (!events) {
         return stream.push(null);
      }
      if (!events[stream.eventIndex]) {
         stream.eventsPromise = events.nextPage();
         stream.eventIndex = 0;
         pushNextEvent(stream);
      }
      stream.push(events[stream.eventIndex]);
      stream.eventIndex++;
   });
}

module.exports = ActivityStream;
