var ActivityStream = require('./activity-stream.js');

var eventsStream = new ActivityStream();
eventsStream.on('readable', function () {
   var event = eventsStream.read();
   console.log(event.repo.name + ": " + event.type);
});
