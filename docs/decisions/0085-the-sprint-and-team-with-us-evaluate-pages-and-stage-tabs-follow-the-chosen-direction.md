# 0085 · The Sprint With Us and Team With Us evaluate pages and stage tabs follow the chosen direction

- Status: accepted for the build (slice 19, restyle)
- Date: 2026-10-18
- Builds on: 0065, 0078, 0082

## Context

The design catalogue approved at G-DESIGN redraws slice 19's screens. These are the read-only
Sprint With Us and Team With Us proposal pages that staff score, screen, disqualify and award from
(`proposal-swu-view.*`, `proposal-twu-view.*`), and the Sprint With Us manage page at the code
challenge (`opportunity-swu-edit.code-challenge`, `opportunity-swu-edit.team-scenario-refused`).
DESIGN.md's "Proposal screens in the chosen direction" says how they look, including its section
"Evaluate pages: what changed with this pass". The manage page's frame, action bar and refusal were
already in the catalogue's shape (decision records 0075, 0076, 0084), and its words at the code
challenge already matched the story. Behaviour stays as decision record 0065 set it.

## Decision

- **The evaluate page is the proposal kit's frame,** as the Code With Us evaluate page is (0082).
  It follows the stories' order: `ProposalHead` (eyebrow, program label, the status label carrying
  `proposal-status`, the proponent as the H1 inside `proposal-proponent-name`), the details
  (opportunity, submitted, proposal ID), the Scores region, the printable-copy link in `Actions`, the
  shared action bar, `ProposalTabs`, any refusal, then the tab's region. Loading is `PageTitle` and
  `Waiting`. The old status line in the details is gone.
- **The Scores region is the kit's `Details`.** The total is now named "Total", as the stories name
  it. **The rank is always there.** `proposal-rank` holds "1st", "2nd" and so on for a fully
  evaluated proposal. Until then it is an empty element beside the words "Not yet ranked". The
  surface describes the rank as "empty when it holds none", and the page used to leave the element
  out. The explanatory note is an `op-note`, shown once there is a total or a rank.
- **`ProposalTabs` takes a `query`,** as the catalogue kit's does. Each tab keeps its test ID
  (`proposal-tab-team-questions`) and its address keeps the service's tab name
  (`?tab=teamQuestions`).
- **A stage tab** is an `op-text` sentence, the stage's score as `Details`, and the score button
  inside a `proposal-score-actions` wrapper. The wrapper is always on a stage tab and empty when no
  score is offered. Screen in and Screen out are in a `ButtonGroup` of their own, drawn only when one
  is offered.
- **The wrong-stage refusal** is the kit's `Focused` carrying `proposal-wrong-stage-error`, around an
  `InlineAlert` with an `AlertTitle`. Any other refusal of a stage action is `Focused` carrying
  `proposal-refused-message`. Each refused attempt is counted and keys the message, so a second
  refusal is drawn afresh and takes focus again.
- **The questions are on their own tab only.** The Team questions and Resource questions tabs list
  the responses in the kit's `DataTable`. The Proposal tab now leaves them out and ends with the
  stories' note saying where they are. `TeamProposalDetails` takes `questions={false}` for this. The
  vendor's manage page still lists them.
- **The manage page's stage tabs** (Code challenge, Team scenario, Challenge) draw their proponents
  in the kit's `DataTable`, keeping `opportunity-stage-table` and `opportunity-stage-row`. The status
  is the coloured `ProposalStatus` label, and loading is `Waiting`. No story draws these tabs, so they
  now look like the page's other tables.

## Departures from the stories

These are carried over from decision record 0065 and are unchanged:

- A stage the opportunity has not reached offers no score, and the tab says when the proposal can be
  scored. This follows R-2.28 v2.
- The questions table has no Score column, because the proposal's answer does not carry each
  question's agreed score.
- The proponent is named by the organization's legal name when the service gives it. The default
  story's anonymous "Proponent 1" and its withheld organization are the anonymity rule (R-2.37),
  which this restyle does not change.

## Consequences

No test ID, route or service behaviour changes. A test that looked for no `proposal-rank` on an
unranked proposal now finds the element empty. A test that read "Total score" now reads "Total". A
test that read the responses on the Proposal tab finds them on the questions tab.
