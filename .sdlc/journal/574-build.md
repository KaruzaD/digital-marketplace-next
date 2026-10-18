---
stage: "build"
title: "build slice 17"
at: "2026-10-18T21:50:46.537Z"
cost: 0
turns: 0
session: ""
---

The application build-slice-17-3 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-5.24: evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page's Evaluation region shows a list labelled 'Your evaluations, by anonymous proponent name' whose li items carry evaluation-proponent-row and read 'Proponent 1 Your evaluation : Submitted' (and Proponents 2 and 3 likewise), each status in a span carrying evaluation-status. rowsText (tests/adapters/new/index.ts:5611) keeps only rows having ARIA cell descendants and skips these li rows, so proponentRows returns nothing. Read rows found by evaluation-proponent-row that have no cell role by their children or their evaluation-status / proposal-proponent-name test IDs.
- to bind-adapter: R-5.27: evaluationIndividualListTwu.evaluationStatus() and evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/team-with-us/00000000-0000-4000-8000-000000000801/edit?tab=evaluation and /opportunities/sprint-with-us/00000000-0000-4000-a041-000000000001/edit?tab=evaluation, while both pages show the proponent list as li items carrying evaluation-proponent-row ('Proponent 1 Your evaluation : Submitted', and 2 and 3 likewise) with the status in evaluation-status. The same rowsText cell-role filter at tests/adapters/new/index.ts:5611 drops every li row.
- to bind-adapter: R-5.35: evaluationIndividualListSwu.evaluationStatus() read "" both before and after the move on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page after the move shows li rows carrying evaluation-proponent-row reading 'Proponent 1 Your evaluation : Draft: complete', 'Proponent 2 Your evaluation : Not started', 'Proponent 3 Your evaluation : Not started'. The empty reads come from rowsText at tests/adapters/new/index.ts:5611 skipping rows with no ARIA cell role, which made the test's not.toBe(before) compare two empty strings.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.