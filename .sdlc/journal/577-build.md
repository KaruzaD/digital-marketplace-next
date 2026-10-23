---
stage: "build"
title: "build slice 18"
at: "2026-10-19T00:05:05.576Z"
cost: 0.24305259999999998
turns: 7
session: "4b602746-523f-4ef7-a334-6112040c74cd"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

I made no changes to the application in this revision.

**Why R-4.14 needed no fix.** The ruling sent this build back for one criterion from slice 4, R-4.14: an administrator browsing the people registered with the service, with each person's status, account kind, name and whether they are an administrator. The test timed out on the user list at `/users`. I opened the page outline the failure left (`.sdlc/evidence/slice-18/R-4.14.txt`). The page had loaded fully for the administrator:
- the heading "Digital Marketplace Users", the name search and the "Export contact list" button were all drawn;
- the table had the columns Status, Account type, Name and Administrator, with active accounts first and then sorted by account type and name;
- every row was filled in and each name linked to that person's profile.

So the page does what the criterion asks. This agrees with the operator's note: the timeout came from the test adapter reading the list one cell at a time, which took longer than the test waits once the list had grown. A binding approved just before this run reads the list in one call. As instructed, I left the restyle and everything else alone.

**Slice 18 itself is unchanged** from the version that was returned. That covers:
- the chair's consensus tab and the per-proponent consensus screens;
- reopening and resubmitting until the stage is finalised;
- the explanation shown to an owner who is not on the panel;
- the single finalise action, and its refusals that name the right next stage;
- screening in the top proponents who met every minimum;
- the submitted and finalised notices.

It also still carries the criteria the plan places here for testing although earlier slices built them (R-6.15, R-5.28, R-5.36).

**Checks.** This workspace had no dependencies installed, so I installed them from the existing lockfile and ran `npm --prefix app run check`. It passed: typechecks were clean and all 1,521 unit tests passed (16, 862 and 643 across the three test runs). I wrote no new tests because no code changed.

**Not done here.** Nothing outside `app/` and `docs/decisions/` needed touching. If R-4.14 fails again once the new binding is in place, the next thing to look at is the adapter's reading of the list, not this page.