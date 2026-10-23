---
stage: "build"
title: "build slice 9"
at: "2026-10-18T10:20:48.032Z"
cost: 1.7553391999999999
turns: 64
session: "2824ccbe-8838-410a-a17e-dd09ce45469c"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I restyled slice 9's screens to the approved design catalogue. Little needed to change: the slice's behaviour was already in place, and so was most of its new look. The full `npm --prefix app run check` passes: typecheck and unit tests for all three packages, with 16 tests in migrations, 862 in the backend and 598 in the frontend.

**What was already there.** An earlier run built all six of the slice's criteria, recorded in decision records 0043 and 0044, and I did not change any of that logic:
- **R-1.28:** an administrator can cancel an opportunity, with an optional note.
- **R-1.20:** the program's permitted transitions are enforced, so cancelling from a draft, from under review, from awarded or from cancelled is refused.
- **R-1.32:** the author or an administrator can add addenda, and nothing removes one.
- **R-1.33:** private notes with files appear on the History tab. The service accepts notes by request, but no screen offers a way to add one.
- **R-1.30:** the author and administrators see the views, watchers and proposals figures once an opportunity is published.
- **R-6.17:** no message of any kind reaches a deactivated account. Recipients are checked when the change is made, and the mailer checks again as each message goes.

The later restyles of slices 7 and 10 (records 0071 and 0075) had already moved the three programs' manage pages onto the shared opportunity kit. That covers the page head, action bar, tabs and History region on Code With Us, Sprint With Us and Team With Us. The addenda list, the history table and the reporting figures already matched their stories.

**What I changed.** Two pieces in `app/frontend/src/screens/opportunity-running.tsx`, which all three programs share:
- **Addenda form:** the form now uses the kit's `op-region` class. The sentence saying an addendum is permanent and who will be emailed is now a plain paragraph in the kit's text style, and the Add addendum button sits in the kit's `Actions` row.
- **Cancel dialog:** its body now uses the kit's `op-dialog` wrapper, with its sentence as a paragraph in the kit's text style.

No test ID, wording or behaviour changed.

**One judgement call.** The stories disagree. The Code With Us and Team With Us stories draw these two pieces with the kit's classes, but the Sprint With Us story wraps them in a generic spacing component instead. One shared component can't follow both, so I followed the kit's classes. The spacing comes out the same, and DESIGN.md says a screen sets no spacing of its own. As decisions 0032 and 0043 already settled, neither text area carries the character limit the stories show. Each states its limit, and an entry that is too long is refused with a message naming the limit rather than silently cut. I recorded this in `docs/decisions/0076-running-an-opportunity-follows-the-chosen-direction.md`.

**Tests.** I added `app/frontend/tests/opportunity-running.test.tsx`. It checks the new structure of the addenda form and the cancel dialog, and that an addendum is sent and the field cleared once it is accepted. It also checks that a cancelled opportunity's form says nobody will be emailed, that a note's file shows as a link in its history row, and that the reporting figures appear only once published. The existing manage-page tests for all three programs pass unchanged.

**Not changed.** The slice's two other catalogue pages, `opportunity-counters` and `opportunity-history-request`, describe addresses that return data, not screens, so there was nothing to restyle. The compose file was not changed, and it still publishes the application at port 4300 and identity at port 8080 under `/realms/digital-marketplace`. Dependencies weren't installed in this workspace, so I ran `npm ci` under `app/` from the existing lockfile before the check.

**For the next slice.** The notices to people who submitted a proposal when an addendum is added or an opportunity is cancelled (R-1.35, R-1.36) are built but answered for in Slice 14. The message reference page still needs to list this slice's three notices, which is Slice 21's work.

## Fix turn

I'm not sure what made `npm --prefix app run check` fail last time, but I made one change I think is the likely fix. The failure I was given showed only warnings that also print on passing runs: "Could not parse CSS stylesheet", and the missing `canvas` package for `getContext()`. They don't cause failures, so I left them alone. The real error wasn't in the output.

When I ran the check here, it passed three times in a row: 862 backend tests and 598 frontend tests, with typechecking clean. I couldn't reproduce the failure. The likeliest cause is a frontend test running out of time. The frontend tests still used vitest's default 5-second limit per test. The slowest ones take 2.5–3.3 seconds even when the machine is warmed up, and the first run after an install is several times slower. The backend hit the same problem earlier and already allows 30 seconds per test and 60 seconds for setup.

**Journal addition:** On this revision I changed only `app/frontend/vite.config.ts`. The frontend unit tests now get the same time limits as the backend's: 30 seconds per test and 60 seconds for setup, with a comment saying why. I made the change because the frontend's slowest tests (2.5–3.3 seconds when warm) could pass 5 seconds on a first run after an install, which is the likeliest reason the check failed. The output I was given held only warnings that don't fail the run, and three local runs passed, so I could not confirm the cause. If the check fails again, the actual error will need to be read from the full output. The full check still passes after the change, and nothing else in the slice was touched.