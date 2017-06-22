var Transform = require('stream').Transform;
var util = require('util');
var moment = require('moment');
var _ = require('underscore');

function EventsToText() {
   Transform.call(this);
   this._readableState.objectMode = false;
   this._writableState.objectMode = true;
}
util.inherits(EventsToText, Transform);

EventsToText.prototype._transform =
function(event, encoding, cb) {
   var date = moment(event.created_at);
   var payload = event.payload || {};
   var l = null;

   switch (event.type) {
      case "PushEvent": 
         var branch = _.last(payload.ref.split('/'));
         l = ["Pushed", payload.size, "commits to",  branch];
         break;

      case "PullRequestEvent": 
         var pull = payload.pull_request;
         // console.dir(event);
         var pullInfo = "pull \"" + pull.title + "\" at " + pull.html_url;

         switch (payload.action) {
            case 'opened':
               l = ["Opened", pullInfo];
               break;
            case 'closed':
               if (pull.merged) {
                  l = ["Merged", pullInfo];
               } else {
                  l = ["Closed", pullInfo];
               }
               break;

         }
         break;

      case "CommitCommentEvent": 
         l = ['Commented on a commit at', payload.html_url];
         break;

      case "CreateEvent": 
         if (payload.ref_type == 'branch') {
            l = ['Created a branch', payload.ref];
         }
         break;

      case "IssueCommentEvent": 
         l = ['Commented on an issue:', payload.issue.title, 'at', payload.comment.html_url ];
         break;

      case "PullRequestReviewCommentEvent":
         l = ['Commented on a pull diff:', payload.pull_request.title, 'at', payload.comment.html_url ];
         break;

   }

   if (!l) {
      l = [event.repo.name + ":", event.type ];
   }

   if (event.actor && event.actor.login) {
      l.unshift(event.actor.login);
   }

   date = date.calendar() + " - ";
   this.push(date + l.join(" ") + "\n");
   cb();
};

module.exports = EventsToText;
