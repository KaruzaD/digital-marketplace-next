---
stage: "build"
title: "build slice 7"
at: "2026-10-18T02:02:07.243Z"
cost: 0
turns: 0
session: ""
---

The application build-slice-7-12 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to bind-adapter: opportunityCwuView.status() and opportunityCwuView.proposalDeadline() in tests/adapters/new/index.ts still read '' on a published Code With Us opportunity. Their fallbacks go through cwuHeadLines(), which ends the head at the first line equal to any definition-list label. 'Published' is both the status in the head's label and the term of the 'Published' date detail, so the head is cut off at the status line: the 'Closes ... at 4:00 p.m. Pacific time' line is dropped, and cwuHeadStatus() skips 'Published' as a label. Read status from data-testid opportunity-status and the deadline from data-testid opportunity-proposal-deadline, as the earlier request asked, rather than by matching head text. Check reward() against data-testid opportunity-reward too. Shown by verify on build-slice-7-12 (application tree 7e29391): R-1.14 (tests/acceptance/opportunities/R-1.14.spec.ts:109) and R-1.22 (R-1.22.spec.ts:50) read '' while .sdlc/evidence/slice-7/R-1.14.txt and R-1.22.txt show 'Code With Us Published' and the 4:00 p.m. deadline on the page. R-1.21 passes only because 'Draft' is not a label on that page. Before proposing, run the rebound reads against a published opportunity as well as a draft.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.