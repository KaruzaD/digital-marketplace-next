---
gate: G3
question: "Does slice 18 (The chair agrees a consensus and the questions stage is finalised) do what its criteria say?"
recommendation: "I made no changes to the application in this revision."
opened: 2026-10-19T00:05:05.673Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 18 (The chair agrees a consensus and the questions stage is finalised) do what its criteria say?

**Recommendation.** I made no changes to the application in this revision.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

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

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Question: does slice 18 (the chair agrees a consensus and the questions stage is finalised) do what its criteria say, now that the previous return over R-4.14 has been answered? Ruling: approve. The verify result is pass, recorded for build-slice-18-9 against application tree cc151ae, which is this branch's app tree. All 15 claimed criteria (R-5.10, R-5.12, R-5.13, R-5.14, R-5.28 to R-5.33, R-5.36, R-6.15, R-1.41, R-1.50, R-2.29) were exercised and met. R-4.14, the regression the runner returned the previous revision for, is in this run's rechecked set and passes under the updated adapter binding, which agrees with the build's finding that the user list page was correct and the timeout came from the adapter reading the list one cell at a time. The application diff against main restyles the consensus tab, the finalise refusal and the consensus create, edit and read-only screens onto the evaluation kit (a new PanelScores component, plus Rows, Notice, Refusal, Focused, ScoringHead and QuestionBox). Test IDs, routes, message text and permission logic are unchanged. Removing the proponent's response from the edit and read-only views follows the approved design stories and is recorded in decision record 0084. The change to refocus a repeated refusal is covered by six new unit tests in consensus.test.tsx, and the full check suite (1,521 tests) passes. Nothing built belongs to another slice, no secret or personal data appears, and no protected path is touched. What would change this ruling: a verify result recorded against a different app tree, any claimed criterion or rechecked regression failing, or evidence that the restyle changed a criterion-bearing message or permission.

**Conditions:**
none
