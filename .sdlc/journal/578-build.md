---
stage: "build"
title: "build slice 19"
at: "2026-10-19T00:50:39.083Z"
cost: 3.1362110000000007
turns: 69
session: "216ce3f3-37f7-4162-b3a5-63d5a57289d0"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

I restyled slice 19's screens to the approved design catalogue, and `npm --prefix app run check` passes: typecheck plus 862 backend, 646 frontend and 16 migration tests. I could not open the pages in a browser here, so the new look has only been checked by unit tests.

**The slice's behaviour.** R-1.25, R-1.42, R-1.49, R-2.28, R-2.30, R-2.31 and R-2.35 were built in an earlier pass and are recorded in decision record 0065. The service's behaviour (the scoring routes, screening, the guard on starting the team scenario, price scores, the move to processing, award and proposal history) is unchanged. This pass changed only the screens, plus one fix described below.

**The read-only proposal page** for Sprint With Us and Team With Us (`frontend/src/screens/proposal-team-view.tsx`) is now drawn the same way as the Code With Us one:
- **Layout and order:** the shared page frame, then the heading with the program and coloured status labels, the details, the Scores section, the printable-copy link, the shared action bar, the tabs, and the open tab's content.
- **Stage tabs:** each one shows a sentence about the stage and the stage's score. The score button now sits in a `proposal-score-actions` wrapper that is always there and empty when no score is offered. Screen in and Screen out are in a button group of their own.
- **Wrong-stage refusal:** shown as a titled alert that takes focus. Each refused attempt is counted, so a second refusal is drawn again and takes focus again.
- **Questions:** the Team questions and Resource questions tabs list the responses in the shared table. The Proposal tab no longer repeats them and ends with a note saying which tab holds them.

**Three small changes outside that page:**
- The shared tab links in `frontend/src/app/proposal-kit.tsx` can now use an address that differs from their test ID, as the catalogue's do. `proposal-tab-team-questions` still links to `?tab=teamQuestions`.
- The shared proposal details can leave the questions out. The vendor's manage page still shows them.
- The manage page's Code challenge, Team scenario and Challenge tabs now list proponents in the shared table, with coloured status labels and the shared loading spinner. They keep their test IDs. No story draws these tabs, so they now match the page's other tables.

The manage page's Start team scenario button and its refusal already matched the stories, so I left them alone.

**One fix that matters for the acceptance tests.** The contract says `proposal-rank` reads empty when a proposal has no rank, but the page used to leave the element out entirely, so a test looking for it would not find it. It is now always present: "1st", "2nd" and so on once fully evaluated, otherwise empty beside "Not yet ranked". "Total score" is now "Total", as the stories have it. I updated the two existing tests that expected the old wording and the missing element.

**New unit tests** in `frontend/tests/stage-evaluation.test.tsx` cover:
- the empty rank beside "Not yet ranked";
- the score wrapper staying present and empty when nothing is offered;
- the page layout: status label, heading, tab addresses and the current tab;
- responses appearing on the questions tab and not on the Proposal tab.

**Where the page still differs from the stories**, all carried over from decision record 0065:
- A stage the opportunity has not reached offers no score button, following criterion R-2.28 rather than the older design.
- The questions table has no Score column, because the service doesn't send each question's agreed score with the proposal.
- The page names the proponent by organization rather than as "Proponent 1". Hiding the name is criterion R-2.37's rule, and I didn't change it.

I recorded all of this in `docs/decisions/0085-…`. No test IDs, routes or service behaviour changed, and nothing outside `app/` and `docs/decisions/` was touched. The compose file still publishes the app at :4300 and the identity provider's realm at :8080.

**For the next slice (20):** the printable and export pages are its own, and still need restyling on the same frame.