# 0078 · The Sprint With Us and Team With Us proposal screens follow the chosen direction

- Status: accepted for the build (slice 15, restyle)
- Date: 2026-10-18
- Builds on: 0058, 0059, 0072

## Context

The design catalogue approved at G-DESIGN redraws slice 15's screens: the two create forms
(`proposal-swu-create.*`, `proposal-twu-create.*`) and their manage pages (`proposal-swu-edit.*`,
`proposal-twu-edit.*`), all built from `proposal-kit.tsx` on the opportunity kit. DESIGN.md's
"Proposal screens in the chosen direction" says how. Decision record 0072 brought the proposal kit
into the app and restyled the Code With Us screens and the vendor dashboard; this restyle builds on
it. The behaviour stays what decision records 0058 and 0059 set.

## Decision

- **The kit gained what these screens need, once.** `frontend/src/app/proposal-kit.tsx` now carries
  the catalogue kit's team rows (`pp-rows`, `pp-row`, `pp-row-name`, `pp-row-error`), the
  select-and-add cluster (`pp-cluster`, full width on a phone), the dialog's field width, and a
  `Focused` that can carry an `id` (the error summary, `proposal-error-summary`, which a disabled
  Submit proposal is described by).
- **Both create pages are the long form beside the summary** (`ProposalFormPage`): the H1, the
  opportunity's title, the introduction and a "View the opportunity" link, then numbered parts —
  Sprint With Us "1. Organization" to "7. Attachments" (Team, Capabilities, Cost, Team questions,
  References), Team With Us "1. Organization" to "5. Attachments" (Team, Cost, Resource questions).
  The summary gives the program, title, closing date and "Maximum budget $N", and holds Submit
  proposal, Save draft and Cancel, primary first. The old card summary and its button row are gone.
- **A Sprint With Us phase** is the kit's fieldset (`proposal-phase-team`): its dates and budget,
  one row per member (name, any membership label, Remove), the scrum master as one required choice
  among them, the team-member choice (`proposal-team-member-choice`) with Add team member, the
  requirements line, and the cost field in a `proposal-cost` wrapper. The total and its message sit
  in a second `proposal-cost` wrapper. A member who is not active carries the coloured "Membership
  pending" label (`proposal-pending-team-member`), and after a refused submission the row says "User
  is not an active member of the organization."; the phase's other problems (no scrum master, nobody
  named) are its group error. A phase that names nobody says so in a line that keeps the id the
  error summary links to.
- **The requirements line is the catalogue's words** (`phaseRequirementsSentence`): "This phase’s
  team meets its requirements." with the capabilities held ("A, B and C: held."), or "This phase’s
  team is incomplete." followed by every reason that applies — "Name at least one team member.",
  "Every member must be a confirmed member of the organization, not pending.", "Not yet held: …".
  Only the last two are the stories'; the first is this build's, for the empty phase the stories do
  not draw.
- **A pending invitee is offered as "Name (membership pending)"**, as the stories and DESIGN.md word
  it, instead of "(pending)".
- **A Team With Us resource** is the kit's fieldset with a row per person (name, hourly rate,
  Remove, and the row's own problems beneath) and the same choice and Add team member.
- **The manage pages are the Code With Us manage page's frame** (0072): head, details, the
  opportunity and printable-copy links, the always-present action bar (the old "There is nothing to
  do" sentence is gone), any refusal, the tabs, then the tab's region with Organization, Team,
  questions, References (Sprint With Us) and Attachments as level-3 regions. The organization is the
  Details item "Legal name" (`proposal-organization`), with its contact where the service gives it.
  Tables are the kit's `DataTable`; Team With Us lists Resource, Team member and Hourly rate (two
  decimals) and its bid, "Bid: $N an hour", each rate weighted by its resource's target allocation
  (`hourlyBid`). The Scoresheet tab is the kit's details.
- **The Sprint With Us team table shows membership and capabilities** as its story does, read from
  the organization's team when the vendor may read it. When it cannot be read, the table keeps its
  Team member and Scrum master columns only, rather than guessing. The read-only proposal page,
  which shares the table, does not read the team and so shows the two columns.
- **Editing draws the whole form** with the manage head, the identifiers, the tabs and a "Proposal"
  heading above, and the summary marked with the proposal's status. A draft or withdrawn proposal
  is offered Save changes and submit, Save changes and Cancel; **a submitted one only Save changes
  (primary) and Cancel**, as `organization-locked` draws it — there is nothing more to submit, and
  the organization's refusal (R-2.22) comes from Save changes, as the surface says.
- **The unqualified-organization notice** is with the page's other messages above the form, and
  takes focus when it appears. The missing service areas stay under the Organization field as its
  group error (`proposal-service-area-error`).
- **The Proposals tab** of all three programs' manage pages is the kit's `DataTable`, keeping
  `opportunity-proposals-table`, its rows and links. No story draws the tab; it now looks like the
  page's other tables.
- **Kept against the stories.** The references keep their Company field, which the stories leave
  out, because the service keeps and checks it (0058). The error summary still names the place and
  the service's or the rules' own message ("Prototype phase: Please select a scrum master for this
  phase."), as 0072 kept them, rather than the stories' sample sentences. The over-budget message
  keeps `proposal-budget-exceeded-error` on Team With Us, which the surface names for Sprint With Us.

## Consequences

A test that read "(pending)" in the team-member choice now reads "(membership pending)". One that
read the requirements line now reads the sentences above. One that found the scrum master radio by
"Scrum master: Name, phase" finds it by the member's name inside the phase's group. One that looked
for `proposal-save-and-submit` on a submitted proposal's form finds Save changes alone. A Team With
Us hourly rate reads "$120.00" where it read "$120". Every test ID is kept.

## What would reverse it

A criterion giving the requirements line or the bid other words: `phaseRequirementsSentence` and
`hourlyBid` are the one place for each.
