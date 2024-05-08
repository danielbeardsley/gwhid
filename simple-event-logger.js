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
      case "IssuesEvent":
         l = [payload.action, "issue", payload.issue.title, payload.issue.html_url];
         break;

      case "PullRequestReviewEvent":
         l = [payload.action, "pull review on", payload.pull_request.title, payload.pull_request.html_url];
         break;

      case "PullRequestReviewCommentEvent":
         l = ["Commented on pull review ", payload.pull_request.title, payload.pull_request.html_url];
         break;

      case "GollumEvent":
         const wiki = payload.pages[0];
         l = ["Edited Wiki:", wiki.page_name, wiki.html_url];
         break;

      case "PushEvent": 
         var branch = _.last(payload.ref.split('/'));
         if (payload.before === "0000000000000000000000000000000000000000") {
            l = ["Pushed a new branch:", branch];
         } else {
            l = ["Pushed", payload.size, "commits to",  branch];
         }
         break;

      case "PullRequestEvent": 
         var pull = payload.pull_request;
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

   var message = l ? l.join(" ") : event.type;
   this.push(date.calendar() + " - " + event.repo.name + ": " + message + "\n");
   cb();
};

module.exports = EventsToText;
