# 0089 · The printable copies, the all-proposals export and the full report follow the chosen direction

- Status: accepted for the build (slice 20, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 20's pages in all three programs:
`proposal-*-export-one` (`default`, `anonymous`, `loading`, `not-found`), `proposal-*-export-all`
(`default`, `anonymous`, `loading`, `not-found`) and `opportunity-*-complete` (`default`,
`loading`, `not-found`). Before this, `screens/proposal-export.tsx` and
`screens/opportunity-report.tsx` used `Stack`, the design system's `Heading` and `Text`, the
`Fact` list and a card style. Who may read what, and how a copy is named, is unchanged. Decision
record 0066 still describes it.

## Decision

- **The kits, not new pieces.** The copies and the export use the proposal kit's `ProposalPage` and
  `ProposalHead`. The report uses the opportunity kit's `OpportunityPage` and `OpportunityHead`
  (eyebrow, program and status labels, the H1 `report-title`). Every part of a proposal is a kit
  `Region`, facts are `Details`, actions are `Actions`, each proposal in the export or the report is
  a `Panel` (`article`), and text is `op-text` and `op-list`. Waits are `PageTitle` and `Waiting`
  inside the page frame. The missing page is the shared `NotFound`.
- **Two small kit extensions, made once.** `SectionTitle` and `Region` take heading levels 4 and 5.
  Below 2 they look the same as level 3. The report needs this because it nests a proposal's parts
  (level 4) and their phases or questions (level 5) under a level-3 panel. `ProposalHead` takes
  `statusTestId`, as the catalogue's does: `null` draws the status label without `proposal-status`,
  as the export-one stories draw it.
- **A copy of one proposal.** Back link and Print come first, then the `proposal-export-document`
  article. It opens with the head (status as a label), then Proponent (`proposal-proponent-name`),
  Submitted and Proposal ID as details. The status moved from the facts into the head.
- **The all-proposals document.** The head (eyebrow "Export all … proposals", no status), the
  sentence, then the checkbox and Print in one `Actions` row, then a panel per proposal. A Team With
  Us proposal states its **Bid** ("$220.00 an hour"), worked out the same way as its manage page,
  where it used to state an estimated contract cost. A Sprint With Us proposal keeps Total proposed
  cost. In this document a Code With Us proposal's text is the region "Proposal" and comes first,
  since the panel's heading already names the proponent. When the document is anonymous, the
  withheld sentence comes before it. The Team With Us copy's team region ends with the same bid
  sentence.
- **The report.** Scores read to two decimal places ("91.50%"), as the stories write them. The
  Opportunity ID fact is gone, since the stories do not show it.

## Kept where the story differs

- **Status words.** The app's existing status words are kept ("Under review: questions" where a
  story writes "Under review: team questions"). They come from the shared rules and are the same on
  every other proposal screen.
- **The Team With Us report's contract dates.** The report still gives them as a sentence after the
  resources. The story leaves them out, but the report is meant to hold the whole record.
- **The description.** It is still drawn as formatted text, not as one plain paragraph.

## Consequences

No test ID, address or access rule changes. `proposal-status` no longer appears on a printable
copy, which matches the stories, where the status is shown with no test ID.
