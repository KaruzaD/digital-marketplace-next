# 0080 · The team, the changelog and a vendor's own organizations follow the chosen direction

- Status: accepted for the build (slice 12, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 12's screens. These are the management page's
Team members tab (`organization-edit`: `team`, `team-administrator`, `invite-open`,
`invite-refused`, `invite-unregistered`, `invite-invalid-type`, `admin-rights-confirm`,
`remove-member-confirm`, `change-owner`), its Changelog tab (`changelog`), and the Organizations
section of a vendor's own profile (`organization-user-memberships` and
`organization-user-memberships-self`: `default`, `empty`, `loading`, `accept-confirm`,
`decline-confirm`, `leave-confirm`). DESIGN.md's "Organization screens in the chosen direction"
says how, building on `organization-kit.tsx` and `organization-memberships.tsx`. Until now these
screens used `Stack`, full-size headings, inline-styled tables, a circular outlined badge and
`Text`. The `section-unavailable` states are the users domain's shared sections, already restyled
(0077).

## Decision

- **The kit grows the team's pieces once.** `frontend/src/app/organization-kit.tsx` now also holds
  `Membership` and `membershipColour` (Owner, Administrator and Member grey; Pending yellow;
  always in words, keeping `organization-owner-badge` and `organization-pending-badge`), `Commands`,
  `TeamRows`, `ChangelogRows`, `PageAlert`, `DialogBody`, `SaveStatus` and `OrganizationStyles`.
  The new `frontend/src/app/organization-memberships.tsx` holds `OwnedRows`, `AffiliatedRows` and
  `OrganizationLink`.
- **Tables on a wide screen, stacked cards on a phone.** The team, the changelog and both
  membership lists switch in script (`useNarrow`, the header's), so each row and its test IDs
  appear once. `membership-owned-table` and `membership-affiliated-table` are on the table or on
  the cards' list.
- **The tabs take the stories' layout.** The Team members tab is a region under its H2 in the H4
  size. It holds any invitation alert first, then the team size, then Add team members (the one
  primary; grouped with Change owner where a service administrator is offered it), then the rows,
  then Team capabilities as an H3 region. The invite and change-owner dialogs use `DialogBody`
  with their title in the H4 size. The administrator-rights statement, its box and its hint are
  `medium` apart. Withdrawing administrator rights and approving now report into a status region
  after the tab, as `team` and `team-administrator` draw it.
- **The Organizations section is drawn inside the profile.** It keeps the profile's H1 and section
  links (0077), which are the story's "My Organizations" head. The two lists are H4-size regions.
  The wait is the direction's `Waiting`, "Loading organizations".
- **Kept where the stories differ, for a stated reason.**
  - The capability summary lists only what the team holds. A separate "Capabilities the team does
    not have" region lists the rest (0052, R-3.34). The story's single held/not-held list would
    name a capability that only a pending invitee holds inside the summary.
  - Remove stays on the owner's row (0052, R-3.11).
  - Change owner keeps its confirming second step (0052).
  - The invitations' refusals and warnings stay wrapped together in one `field-error` (0052).
  - The unregistered-address and invalid-type alerts carry their body as content under a rendered
    title, where the stories pass `description`. The words are the same.

## Consequences

No test ID, wording or behaviour changes, beyond two additions. The status region now announces
"Administrator rights removed from <name>." and "<name> has joined the team.". The memberships
loading line now reads "Loading organizations". Headings are smaller (tab and list regions in the
H4 size, H3s in bold body text).
