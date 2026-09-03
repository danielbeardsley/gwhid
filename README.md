gwhid
=====

github-what-have-i-done: cli output of the github private events feed.  Github
doesn't provide a browser-friendly means of looking at *all* the events
associated with your account but they do provide an API.  **gwhid** uses that
API to produce a simple summary of all the events (public and private
repositories).  This can be very nice for seeing at a glance what you did over
the course of a day or multiple days.

### Example

Get an oauth api token from the web and store it in you git config

    macbook 01:49 ~/projects/gwhid ▶  git config --global github.token "$token"

Then run the app:

    macbook 01:49 ~/projects/gwhid ▶  ./bin/gwhid --days 1
    ## iFixit/ifixit PR #64264: "pro-lead-geoip
      Reviewed: https://github.com/iFixit/ifixi
      Commented on diff: https://github.com/iFi

    ## iFixit/ifixit PR #64283: "netsuite-item-
      Opened: https://github.com/iFixit/ifixit/
      Reviewed: https://github.com/iFixit/ifixi
      Commented on diff: https://github.com/iFi
      Commented: https://github.com/iFixit/ifix
      Commented: https://github.com/iFixit/ifix
      Merged: Today at 10:15 AM

    ## iFixit/ifixit PR #64252: "CI cache: key
      Reviewed: https://github.com/iFixit/ifixi
      Commented on diff: https://github.com/iFi
      Commented: https://github.com/iFixit/ifix
      Commented: https://github.com/iFixit/ifix

    ## iFixit/ifixit PR #64273: "Give ubreakit
      Commented: https://github.com/iFixit/ifix
      Commented: https://github.com/iFixit/ifix

    ## iFixit/ifixit-schooner-fw PR #937: "test
      Reviewed: https://github.com/iFixit/ifixi
      Commented: https://github.com/iFixit/ifix
      Labeled: Yesterday at 5:04 PM

    ## iFixit/ifixit-schooner-fw PR #900: "bugf
      Reviewed: https://github.com/iFixit/ifixi

