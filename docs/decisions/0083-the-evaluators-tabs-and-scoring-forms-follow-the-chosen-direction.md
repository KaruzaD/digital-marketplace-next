# 0083 · The evaluator's tabs and the individual scoring forms follow the chosen direction

- Status: accepted for the build (slice 17, restyle)
- Date: 2026-10-18

## Context

The design catalogue approved at G-DESIGN redraws slice 17's screens. These are the dashboard's
Evaluations section (`evaluation-panel-dashboard.*`), the evaluator's Instructions and Evaluation
tabs (`evaluation-instructions-*`, `evaluation-individual-list-*`), and the per-proponent scoring
forms (`evaluation-individual-create-*`, `evaluation-individual-edit-*`). DESIGN.md's "Evaluation
screens in the chosen direction" says how they look. The request addresses
(`evaluation-individual-request-*`, `evaluation-individual-submission-request-swu`) are response
references and draw no screen. Earlier restyles already drew the dashboard (decision record 0070)
and the manage page's frame around these tabs (decision record 0075). Behaviour stays as decision
record 0062 set it.

## Decision

- **The evaluation kit grows once,** in `frontend/src/app/evaluation-kit.tsx`, with the catalogue's
  pieces these screens need: `EvaluationStatus` (grey Not started, blue for a draft, green for
  Submitted, the words always saying which), `ScoringHead`, `QuestionBox`, `Response`, `SaveRow` and
  `Refusal`, plus the `ev-response` and `ev-body` rules. The consensus screens (slice 18) can take
  them from there. Unlike the catalogue's, the app's `ScoringHead` takes the program and the facts
  as plain values, because the app has no story data.
- **The dashboard needed no change.** Its Evaluations region, table, empty message and section links
  already match the story.
- **The Instructions tab** wraps the administrator-maintained page in the kit's `ev-body`, which
  carries `evaluation-instructions-body`. The words are the content page's, not the story's
  illustrative text.
- **The Evaluation tab** draws the proponents as the kit's `Rows`: a `ul` labelled by its caption
  carries `evaluation-individual-table`, and each `li` carries `evaluation-proponent-row`. The status
  is an `EvaluationStatus` label carrying `evaluation-status`. The action link names itself and has
  no column label. The submit hint is an `op-text` paragraph, and Submit scores for consensus sits in
  the kit's `Actions`. A refusal is the kit's `Refusal`, which takes focus again after each refused
  attempt. While the list loads, the tab shows `Waiting` ("Loading your evaluations") inside the
  frame. The story's loading state is a whole-page wait; this one keeps the frame, because the
  manage page has already loaded.
- **The scoring forms** follow the stories in order. First the `ScoringHead`: the eyebrow, the program
  label, the evaluation's status label on the edit page (`evaluation-status`), the anonymous name as
  the H1 in `proposal-proponent-name`, then the opportunity's title and "Proponent n of m" as facts.
  Then the back link, the scoring sentence, the alerts and the form (an `op-region`), which holds one
  `QuestionBox` per question with the worth line, the `Response` and the two fields, then the
  `SaveRow`. The error summary is the kit's `ErrorSummary`, so its title now shows. It is redrawn
  after each save, so it takes focus again. A submitted evaluation, or one by another evaluator the
  reader may see, is drawn with one `Panel` per question, each with an H2 "Question n" and the score
  and comment as `Details`. Another evaluator's name is a Details pair ("Evaluator") under the head.
  Loading shows the H1 and `Waiting`.
- **The consensus form keeps its look.** `Heading1` and `OpportunityLine` in
  `evaluation-individual-form.tsx` stay exported unchanged, because slice 18's consensus form still
  draws with them until its own restyle.

## Consequences

No test ID, route, wording of a message or behaviour changes. On the edit pages the status moved
from a "Status:" line into the head, and it keeps `evaluation-status`. The Evaluation tab's table is
now a list. A test that looked for `<tr>` rows now finds `<li>` rows carrying the same test IDs. A
row's text now includes the visually hidden column name ("Your evaluation: Draft: complete").
