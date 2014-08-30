var Activity = require('./activity');

Activity.stream(function(event) {
   console.log(event.repo.name + ": " + event.type);
});
