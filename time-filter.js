var Transform = require('stream').Transform;
var util = require('util');

function TimeFilter(days) {
   Transform.call(this);
   this._readableState.objectMode = true;
   this._writableState.objectMode = true;
   this._cutoff = Date.now() - days * 86400000;
}
util.inherits(TimeFilter, Transform);

// The github events feed is only roughly reverse-chronological, so we can't
// stop at the first out-of-window event; we have to check every one.
TimeFilter.prototype._transform =
function(event, encoding, cb) {
   if (new Date(event.created_at).getTime() >= this._cutoff) {
      cb(null, event);
   } else {
      cb();
   }
};

module.exports = TimeFilter;
