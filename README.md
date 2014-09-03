gwhid
=====

github-what-have-i-done: cli output of the github private events feed.  Github
doesn't provide a browser-friendly means of looking at *all* the events
associated with your account but they do provide an API.  **gwhid** uses that
API to produce a simple text-stream of all the events (public and private
repositories).  This can be very nice for seeing at a glance what you did over
the course of a day.

### Example

    macbook 01:49 ~/projects/gwhid ▶  node index.js | head -n 30 | cut -c 1-38
    Today at 1:15 AM - Pushed 1 commits to
    Today at 12:55 AM - Pushed 1 commits t
    Today at 12:26 AM - Pushed 2 commits t
    Yesterday at 11:01 PM - Pushed 2 commi
    Yesterday at 11:01 PM - Merged pull "G
    Yesterday at 11:01 PM - Pushed 3 commi
    Yesterday at 5:53 PM - Commented on a
    Yesterday at 5:44 PM - Opened pull "Gu
    Yesterday at 5:44 PM - Created a branc
    Yesterday at 5:29 PM - Pushed 1 commit
    Yesterday at 5:17 PM - Pushed 1 commit
    Yesterday at 4:56 PM - Commented on an
    Yesterday at 4:55 PM - Pushed 1 commit
    Yesterday at 4:36 PM - Commented on an
    Yesterday at 4:11 PM - Commented on an
    Yesterday at 4:11 PM - Commented on a
    Yesterday at 4:11 PM - Commented on a
    Yesterday at 4:07 PM - Pushed 3 commit
    Yesterday at 3:55 PM - Opened pull "tr
    Yesterday at 3:55 PM - Created a branc
    Yesterday at 3:34 PM - Commented on a
    Yesterday at 3:34 PM - Commented on a
    Yesterday at 3:31 PM - Commented on an
    Yesterday at 2:27 PM - Commented on an
    Yesterday at 2:25 PM - Commented on a
    Yesterday at 2:21 PM - Commented on an
    Yesterday at 2:20 PM - Commented on an
    Yesterday at 2:19 PM - Commented on a
    Yesterday at 2:15 PM - Commented on a
    Yesterday at 2:13 PM - Commented on an
