var Activity = require('./activity');

Activity.get().done(function(events) {
   console.log("Got me some events: " + events.length);
   // console.dir(events);
   // console.log(event.repo.name + ": " + event.type);
});
