var Activity = require('./activity');
var Readable = require('stream').Readable;
var util = require('util');

/**
 * Readable stream that emits event objects from the github events api for a
 * given user
 */
function ActivityStream() {
   this.eventsPromise = Activity.get().catch(console.log);
   this.eventIndex = 0;
   Readable.call(this, {objectMode:true});
}
util.inherits(ActivityStream, Readable);

ActivityStream.prototype._read = function () {
   pushNextEvent(this);
};

function pushNextEvent(stream) {
   stream.eventsPromise.then(function(events) {
      if (!events) {
         return stream.push(null);
      }
      // If we're at the end of the current page of events,
      // load some more.
      if (!events[stream.eventIndex]) {
         stream.eventsPromise = events.nextPage();
         stream.eventIndex = 0;
         pushNextEvent(stream);
      } else {
         stream.push(events[stream.eventIndex]);
         stream.eventIndex++;
      }
   }).catch((err) => {
      console.log(err);
   });
}

module.exports = ActivityStream;
