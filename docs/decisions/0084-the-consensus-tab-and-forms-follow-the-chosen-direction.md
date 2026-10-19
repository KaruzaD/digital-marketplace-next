# 0084 · The consensus tab and the consensus forms follow the chosen direction

- Status: accepted for the build (slice 18, restyle)
- Date: 2026-10-18

## Context

The design catalogue approved at G-DESIGN redraws slice 18's screens. These are the manage page's
Consensus tab (`evaluation-consensus-list-*`), the chair's per-proponent forms
(`evaluation-consensus-create-*`, `evaluation-consensus-edit-*`), and the finalise refusal above the
tab. DESIGN.md's "Evaluation screens in the chosen direction" says how they look. The request
addresses (`evaluation-consensus-request-*`) are response references and draw no screen. The manage
page's frame (decision record 0075) and the evaluation kit (decision record 0083) were already in
place. Behaviour stays as decision record 0063 set it.

## Decision

- **The evaluation kit gains `PanelScores`** in `frontend/src/app/evaluation-kit.tsx`: one question's
  "Evaluators' scores for question n" as the kit's `Rows` (Evaluator, Score, Comment), with
  `evaluation-panel-member-score` and `evaluation-panel-member-notes` on each value. It takes the
  rows as plain strings, because the app has no story data; `panelScoresFor` in the consensus form
  turns the evaluations into them. An evaluator with nothing entered reads "Not entered", as before.
- **The Consensus tab** draws the proponents as `Rows`: the `ul` carries
  `evaluation-consensus-table`, each `li` carries `evaluation-proponent-row`, and each status is an
  `EvaluationStatus` label carrying `evaluation-consensus-status`. The action column is there only
  for the panel at consensus, as before; an administrator or a finalised opportunity gets two
  columns. The owner's explanation is the kit's `Notice`. A refused submission is the kit's
  `Refusal`, redrawn after each attempt so it takes focus again. The submit hint is an `op-text`
  paragraph and the button sits in `Actions`. While the list loads the tab shows `Waiting`
  ("Loading consensus") inside the frame, as the Evaluation tab does (decision record 0083).
- **The finalise refusal** is the catalogue's shape: the kit's `Focused` carries
  `advance-refused-message`, around an inner wrapper carrying `evaluation-not-all-submitted-error` or
  `evaluation-no-screenable-error`. The manage page counts each refused attempt and keys the refusal
  by it, so a second refusal is drawn afresh and takes focus again. The manage page no longer holds a
  ref for it.
- **The consensus forms** follow the stories in order: the `ScoringHead` (eyebrow, program label, the
  consensus's status label on the edit page carrying `evaluation-consensus-status`, the anonymous
  name as the H1 in `proposal-proponent-name`, the opportunity's title and "Proponent n of m" as
  facts), the back link, the editable notice on a submitted consensus, the sentence on what to record
  (create page only, as in the story), the alerts, then one `QuestionBox` per question with the worth
  line, the evaluators' `PanelScores` and the two fields, then the `SaveRow`. The proponent's
  `Response` is on the create page only, because the edit story leaves it off. The error summary is
  the kit's `ErrorSummary`, keyed by the save count as the individual form's is.
- **A consensus that cannot be changed** (the chair-only view of a panel member, or any consensus
  after finalising) is one `Panel` per question with an H2 "Question n", the question, the evaluators'
  scores, and the agreed score and comment as `Details` when there is a consensus. The chair-only
  notice and the finalised notice are the kit's `Notice`. As in the chair-only story, the proponent's
  response is not repeated there.
- `Heading1` and `OpportunityLine`, kept in `evaluation-individual-form.tsx` only for this form,
  are removed. `BackLink` is exported from there and shared.

## Consequences

No test ID, route, message wording or behaviour changes. The tab's table and the evaluators' score
tables are now lists. A test that looked for `<tr>` rows now finds `<li>` rows carrying the same test
IDs, and a row's text includes the visually hidden column name ("Consensus: Submitted"). On the edit
page the status moved from a "Status:" line into the head, and it keeps its test ID. The edit page and
the read-only view no longer repeat the proponent's response.
