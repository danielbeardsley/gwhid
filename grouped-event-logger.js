var Transform = require('stream').Transform;
var util = require('util');
var _ = require('underscore');

function GroupedEventLogger() {
   Transform.call(this);
   this._readableState.objectMode = false;
   this._writableState.objectMode = true;
   // Map of groupKey -> { heading, actions[], isPR, title, num, repo }
   this.groups = new Map();
   // Track insertion order
   this.groupOrder = [];
}
util.inherits(GroupedEventLogger, Transform);

GroupedEventLogger.prototype._transform =
function(event, encoding, cb) {
   var payload = event.payload || {};
   var repo = event.repo.name;
   var key, action;
   var isPR = false;
   var groupInfo = null; // { num, repo, title } for issue/PR groups, or string for branch/other

   switch (event.type) {
      case "PullRequestEvent":
         var pull = payload.pull_request;
         key = repo + ":#" + pull.number;
         isPR = true;
         groupInfo = { num: pull.number, repo: repo, title: pull.title || pull.head.ref };

         switch (payload.action) {
            case 'opened':
               action = "Opened: " + pull.html_url;
               break;
            case 'closed':
               if (pull.merged) {
                  action = "Merged: " + pull.html_url;
               } else {
                  action = "Closed: " + pull.html_url;
               }
               break;
            default:
               action = payload.action + ": " + pull.html_url;
         }
         break;

      case "PullRequestReviewEvent":
         var pull = payload.pull_request;
         key = repo + ":#" + pull.number;
         isPR = true;
         groupInfo = { num: pull.number, repo: repo, title: pull.title || pull.head.ref };
         action = "Reviewed: " + payload.review.html_url;
         break;

      case "PullRequestReviewCommentEvent":
         var pull = payload.pull_request;
         key = repo + ":#" + pull.number;
         isPR = true;
         groupInfo = { num: pull.number, repo: repo, title: pull.title || pull.head.ref };
         action = "Commented on diff: " + payload.comment.html_url;
         break;

      case "IssuesEvent":
         var issue = payload.issue;
         key = repo + ":#" + issue.number;
         isPR = !!issue.pull_request;
         groupInfo = { num: issue.number, repo: repo, title: issue.title };
         action = payload.action.charAt(0).toUpperCase() + payload.action.slice(1) + ": " + issue.html_url;
         break;

      case "IssueCommentEvent":
         var issue = payload.issue;
         key = repo + ":#" + issue.number;
         isPR = !!issue.pull_request;
         groupInfo = { num: issue.number, repo: repo, title: issue.title || String(issue.number) };
         action = "Commented: " + payload.comment.html_url;
         break;

      case "PushEvent":
         var branch = _.last(payload.ref.split('/'));
         key = repo + ":branch:" + branch;
         groupInfo = repo + " branch: " + branch;
         if (payload.before === "0000000000000000000000000000000000000000") {
            action = "Pushed new branch";
         } else {
            action = "Pushed " + payload.size + " commit" + (payload.size === 1 ? "" : "s");
         }
         break;

      case "CreateEvent":
         if (payload.ref_type === 'branch') {
            key = repo + ":branch:" + payload.ref;
            groupInfo = repo + " branch: " + payload.ref;
            action = "Created branch";
         } else {
            key = repo + ":other";
            groupInfo = repo;
            action = "Created " + payload.ref_type + " " + payload.ref;
         }
         break;

      case "CommitCommentEvent":
         key = repo + ":other";
         groupInfo = repo;
         action = "Commented on commit: " + payload.comment.html_url;
         break;

      case "GollumEvent":
         var wiki = payload.pages[0];
         key = repo + ":other";
         groupInfo = repo;
         action = "Edited wiki: " + wiki.page_name + " " + wiki.html_url;
         break;

      default:
         key = repo + ":other";
         groupInfo = repo;
         action = event.type;
   }

   if (!this.groups.has(key)) {
      this.groups.set(key, { heading: null, isPR: false, actions: [] });
      this.groupOrder.push(key);
   }
   var group = this.groups.get(key);
   if (!group.heading) group.heading = groupInfo;
   if (isPR) group.isPR = true;
   group.actions.push(action);
   cb();
};

GroupedEventLogger.prototype._formatHeading = function(group) {
   var heading = group.heading;
   if (typeof heading === 'object' && heading !== null) {
      var type = group.isPR ? "PR" : "Issue";
      return heading.repo + " " + type + " #" + heading.num + ": \"" + heading.title + "\"";
   }
   return heading;
};

GroupedEventLogger.prototype._flush = function(cb) {
   for (var i = 0; i < this.groupOrder.length; i++) {
      var key = this.groupOrder[i];
      var group = this.groups.get(key);
      this.push("## " + this._formatHeading(group) + "\n");
      for (var j = 0; j < group.actions.length; j++) {
         this.push("  " + group.actions[j] + "\n");
      }
      this.push("\n");
   }
   cb();
};

module.exports = GroupedEventLogger;
