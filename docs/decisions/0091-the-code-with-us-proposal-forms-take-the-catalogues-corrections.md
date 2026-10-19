# 0091 · The Code With Us proposal forms take the catalogue's corrections

- Status: accepted for the build (slice 14, second restyle pass)
- Date: 2026-10-18

## Context

Decision record 0072 restyled slice 14's screens to the catalogue. Since then, design/DESIGN.md's
"Proposal screens in the chosen direction" has gained "Corrections after the build", and two of them
apply to these screens: `proposal-cwu-edit.editing` now asks the create page's proponent question,
and the create page's second street line is "Street Address line 2". A review of every story of
`proposal-cwu-create`, `proposal-cwu-edit` and `proposal-vendor-dashboard` against the screens found
no other differences in words, order or test IDs beyond the departures already recorded.

## Decision

- **The manage page's form asks the create page's question.** It reads "Will you be submitting a
  proposal for this opportunity as an Individual or Organization?" with "Individual" and
  "Organization" (it used to read "Who is submitting this proposal?" with "An individual" and "An
  organization"). The rest of its words stay the `editing` story's. This replaces 0072's line on the
  question. The test IDs `proposal-proponent-individual` and `proposal-proponent-organization` are
  unchanged.
- **The create page's second street line is "Street Address line 2"**, so the two street fields no
  longer share a name (WCAG 2.2 success criterion 2.4.6). `proposal-street-2-field` is unchanged.
- **The proposal kit's style sheet matches the catalogue's** again: it includes the rule that lets an
  empty `proposal-score-actions` wrapper take no room in a region.
- **Kept as before.** The manage form's closing sentence still says "Save changes keeps this proposal
  as it is." rather than the story's "as a draft": Edit is also offered on submitted and withdrawn
  proposals (R-2.23), and saving one does not make it a draft. 0072's other departures still stand
  (no evaluation criteria accordion, no Markdown sentence).

## Consequences

A test that found the manage form's proponent radio group by "Who is submitting this proposal?"
now finds it by the create page's question. A test that found the create page's second street field
by the label "Street Address" now finds it by "Street Address line 2". No test ID changed.
