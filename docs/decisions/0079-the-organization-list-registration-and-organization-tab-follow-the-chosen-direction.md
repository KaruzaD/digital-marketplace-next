# 0079 · The organization list, registration and the Organization tab follow the chosen direction

- Status: accepted for the build (slice 11, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 11's screens: the organization list
(`organization-list`, every state), registering (`organization-create`), and the management page's
head and Organization tab (`organization-edit`: `default`, `org-admin`, `editing`, `invalid`,
`archive-confirm`, `loading`, `not-found`, `logo-stored`, `logo-refused`). DESIGN.md's
"Organization screens in the chosen direction" says how, building on `organization-kit.tsx`. Until
now these screens used `Stack`, full-size headings, inline-styled tables, a circular qualified
badge, an "Organization ID:" line and a plain row of tab links. `organization-acting-for-list` is a
response reference for `GET /api/ownedOrganizations` and has no screen to restyle.

## Decision

- **The organization kit is written once,** at `frontend/src/app/organization-kit.tsx`:
  `OrganizationPage` (the opportunity frame with the kit's style sheet), `ManagementTop` (the
  eyebrow, the green qualified labels, the H1 in the H3 size, the Organization ID as a `Details`
  item, and the tabs as `op-tabs` in the "Organization sections" landmark), `FieldGrid`,
  `ReadOnlyFields`, `StoredLogo`, `ArchiveRegion`, `DialogText`, `OrganizationRows` and
  `Pagination`. The team, changelog, requirement and membership pieces are left for the restyle
  of slices 12 and 13's screens.
- **The list is a `DataTable` on a wide screen and stacked cards on a phone.** On a phone, each
  organization is an `article` with its name as an H2 in bold body text and the owner, team size
  and both marks on one line of small text where R-3.21 shows them. The switch is read in script
  (`useNarrow`, the header's), so each row and its test IDs appear once. The logo stays above the
  name in both (R-8.28), as decision record 0047 put it.
- **The forms keep their behaviour and take the stories' layout:** registration in three `Panel`s,
  editing under the tab's H2 with Address and Contact as H3 regions, the fields in as many columns
  as fit, the problem list's title in the alert's own title markup and the reason directly before
  the submit row. The logo chooser stays the files domain's picker (decision record 0077).
- **Kept where the stories differ, for a stated reason.** The read-only profile stays text in a
  description list (decision record 0048), now laid out in the form's columns, since a read-only
  text box's value is not part of what the tab reads as. Archive stays inside the Organization
  tab's section (decision record 0049), as an H3 drawn in the size the stories give a region
  heading. The submit buttons stay available while the form is invalid (0049). A vendor's row
  that is not theirs stays one cell across the table (0048).
- **The other tabs** (team, qualification, changelog) are slices 12 and 13's and keep their
  bodies; they now sit under the restyled head.

## Consequences

No test ID, wording or behaviour changes. The Organization ID is a term and value rather than a
line beginning "Organization ID:"; headings are smaller; the loading states say "Loading
organizations" and "Loading organization" through the direction's `Waiting`.
