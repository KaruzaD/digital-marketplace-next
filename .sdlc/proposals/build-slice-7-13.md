---
gate: G3
question: "Does slice 7 (Staff can draft, submit and publish a Code With Us opportunity) do what its criteria say?"
recommendation: "The application build-slice-7-12 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T02:02:07.329Z
---

# Does slice 7 (Staff can draft, submit and publish a Code With Us opportunity) do what its criteria say?

**Recommendation.** The application build-slice-7-12 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-7-12 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to bind-adapter: opportunityCwuView.status() and opportunityCwuView.proposalDeadline() in tests/adapters/new/index.ts still read '' on a published Code With Us opportunity. Their fallbacks go through cwuHeadLines(), which ends the head at the first line equal to any definition-list label. 'Published' is both the status in the head's label and the term of the 'Published' date detail, so the head is cut off at the status line: the 'Closes ... at 4:00 p.m. Pacific time' line is dropped, and cwuHeadStatus() skips 'Published' as a label. Read status from data-testid opportunity-status and the deadline from data-testid opportunity-proposal-deadline, as the earlier request asked, rather than by matching head text. Check reward() against data-testid opportunity-reward too. Shown by verify on build-slice-7-12 (application tree 7e29391): R-1.14 (tests/acceptance/opportunities/R-1.14.spec.ts:109) and R-1.22 (R-1.22.spec.ts:50) read '' while .sdlc/evidence/slice-7/R-1.14.txt and R-1.22.txt show 'Code With Us Published' and the 4:00 p.m. deadline on the page. R-1.21 passes only because 'Draft' is not a label on that page. Before proposing, run the rebound reads against a published opportunity as well as a draft.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 7 (staff draft, submit and publish a Code With Us opportunity) do what its criteria say? Ruling: approve. Verify is pass-unasserted and current for build-slice-7-13 against tree 7e29391: 15 of 16 claimed criteria pass, none fail, including R-1.14 and R-1.22 which the previous ruling's bind-adapter condition concerned (status and proposal deadline now read through their own test IDs). The one unasserted criterion, R-1.51, is not-testable for a real reason: mapping historical records onto defined states is a property of the data migration and no action or observation of the running service could show it, so neither a rebuild nor a new test could assert it; the slice is accepted on what was asserted. The diff is a restyle onto the opportunity kit (decision record 0071) that keeps behaviour: permission checks still come from the same rules functions, the action set is unchanged, created-by and last-changed-by names appear only when the service sends them (R-1.29), the size limit is stated before a file is chosen (R-8.17), the service level agreement link is kept (R-7.18), and History has no note control (R-1.33). The status vendors and visitors see changes from 'Published' to 'Open'; that is documented, the unit test was updated, and R-1.22 still passes. New unit tests cover the new layout seams. No protected path, secret, personal data or other slice's work is touched. The style sheet appears twice (root layout and page component), which is redundant but harmless and recorded in 0071. This ruling would change if the verify result went stale or failed, or if R-1.51 turned out to be observable through the running service.

**Conditions:**
none
