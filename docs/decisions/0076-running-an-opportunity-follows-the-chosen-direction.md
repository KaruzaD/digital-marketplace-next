# 0076 · Running an opportunity after publication follows the chosen direction

- Status: accepted for the build (slice 9, restyle)
- Date: 2026-10-18

## Context

The design catalogue approved at G-DESIGN draws slice 9's states on every program's manage page:
`addenda-tab`, `history-tab` and `cancel-confirm` of `opportunity-cwu-edit`, `opportunity-swu-edit`
and `opportunity-twu-edit`, and the reporting figures on each `default` (Summary) state. Its other
two pages, `opportunity-counters` and `opportunity-history-request`, are response references for
addresses that answer with data; they draw no screen. The manage pages themselves (head, action
bar, tabs, the tab's region) were brought into the opportunity kit by decision records 0071 and
0075; the pieces this slice owns live in `frontend/src/screens/opportunity-running.tsx`, shared by
all three programs (0043).

## Decision

- **The addenda form is the kit's region,** as the Code With Us and Team With Us stories draw it:
  the form carries `op-region`, the sentence saying the addendum is permanent and who is emailed is
  an `op-text` paragraph, and Add addendum sits in the kit's `Actions` row. The Sprint With Us
  story draws the same form with a `Stack` inside it instead; the two give the same spacing, and
  one shared component cannot follow both, so it follows the kit's classes, which DESIGN.md's rule
  that a screen sets no gap of its own points to.
- **The cancellation dialog's body is the kit's `op-dialog`,** its words an `op-text` paragraph,
  followed by the optional note, as the Code With Us and Team With Us stories draw it (the Sprint
  With Us story again uses a `Stack`, for the same result).
- **The addenda list, the history table and the reporting figures already matched their stories**
  and are unchanged. As decision records 0032 and 0043 have it, neither text area carries the
  `maxLength` the stories show: each states its limit, and an over-long entry is refused naming it
  rather than silently cut.

## Consequences

No test ID, wording or behaviour changes. A test locating the addendum sentence or the dialog's
words by role or text reads them as before; only their wrapping elements changed.
