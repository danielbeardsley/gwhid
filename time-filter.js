var Transform = require('stream').Transform;
var util = require('util');

function TimeFilter(days) {
   Transform.call(this);
   this._readableState.objectMode = true;
   this._writableState.objectMode = true;
   this._cutoff = Date.now() - days * 86400000;
}
util.inherits(TimeFilter, Transform);

TimeFilter.prototype._transform =
function(event, encoding, cb) {
   if (new Date(event.created_at).getTime() >= this._cutoff) {
      cb(null, event);
   } else {
      this.push(null);
      cb();
   }
};

module.exports = TimeFilter;
