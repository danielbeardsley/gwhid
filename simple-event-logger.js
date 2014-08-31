var Transform = require('stream').Transform;
var util = require('util');

function SimpleEventLogger() {
   Transform.call(this);
   this._readableState.objectMode = false;
   this._writableState.objectMode = true;
}
util.inherits(SimpleEventLogger, Transform);

SimpleEventLogger.prototype._transform =
function(event, encoding, cb) {
   this.push(event.repo.name + ": " + event.type + "\n");
   cb();
};

module.exports = SimpleEventLogger;
