# 0082 · The Code With Us evaluate page and the service status page follow the chosen direction

- Status: accepted for the build (slice 16, restyle)
- Date: 2026-10-18

## Context

The design catalogue approved at G-DESIGN redraws slice 16's screens: the read-only Code With Us
proposal page that staff score, disqualify and award from (`proposal-cwu-view.*`) and `/status` as
a browser opens it (`scheduled-transition-trigger.default`). The slice's other states were already
restyled with the screens they live on: the awarded opportunity's successful proponent
(`opportunity-cwu-view.awarded`, decision record 0071) and the vendor's own score and rank
(`proposal-cwu-edit.awarded`, decision record 0072). `proposal-evaluation-request` is a response
reference and draws no screen. Behaviour stays as decision record 0060 set it.

## Decision

- **The evaluate page is the proposal kit's frame,** in the stories' order: `ProposalHead` (eyebrow
  "Code With Us proposal", the program label, the status label carrying `proposal-status`, and the
  proponent as the H1 inside `proposal-proponent-name`), the details (opportunity, submitted,
  proposal ID), the Score region with score and rank, the printable-copy link in an `Actions` row,
  the action bar, the tabs (`ProposalTabs`), then the tab's region with the proposal's parts as
  level-3 regions or the history table. Its loading state is the kit's `PageTitle` and `Waiting`.
- **The action bar is the kit's `ProposalActions`,** always present and empty when nothing is
  offered. The old sentence "There is nothing to do with this proposal now." is gone, as it went from
  the manage page in decision record 0072. The bar lives in `proposal-evaluation-actions.tsx`, shared
  with the Sprint With Us and Team With Us evaluate pages, so they lose that sentence too.
- **The dialogs are the stories' markup.** The score dialog's form is the kit's `pp-dialog` with the
  title in `pf-part-title`; the disqualify dialog's body is an `op-region`; every explanation is an
  `op-text` paragraph. Because the other two programs' evaluate pages share the score dialog and are
  not yet drawn on `ProposalPage`, the dialog renders `ProposalStyles` itself, which the kit provides
  for exactly that case. Putting the kit's sheet in the root layout instead was rejected: one of its
  rules reaches into every `op-regions` page and would change spacing on screens this slice does not own.
- **A refused field takes focus, keeping what was typed** (`score-invalid`, `disqualify-invalid`
  say so). A refusal from the service outside a field is the kit's `Focused` message, as on the
  manage page.
- **`/status` is the opportunity kit's page:** `OpportunityPage` carrying `service-status-page`,
  `PageTitle` "Service status" and one `op-text` sentence carrying `service-status-message`. It keeps
  its "Checking the service…" line while the service is asked, inside the live region.

## Consequences

No test ID, route, wording of a message or behaviour changes. A test that read "There is nothing to
do with this proposal now." on an evaluate page now finds `proposal-actions` empty. The status label
moved from the details into the head and keeps `proposal-status`.
