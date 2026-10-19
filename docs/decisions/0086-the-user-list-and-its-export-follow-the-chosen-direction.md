# 0086 · The user list and its export follow the chosen direction

- Status: accepted for the build (slice 4, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws the list of users at `/users` (`user-list` ·
`default`, `loading`, `export-open`, `export-ready`, `not-found`). DESIGN.md's "User screens in the
chosen direction" describes its user rows, the toolbar (`us-toolbar`) and the export dialog body
(`us-dialog`). Until now the list was drawn with `Stack`, the design system's `Heading` and `Text`,
an inline-styled table and a round outlined badge. The rest of slice 4's screens were already
restyled: the administrator's view of somebody else's profile with 0077, and the notices with 0074.

## Decision

- **The user kit takes the list's pieces once.** `frontend/src/app/user-kit.tsx` now also holds
  the `us-toolbar`, `us-cards`/`us-card`/`us-card-facts` and `us-dialog` rules from the catalogue's
  kit, and `Toolbar` and `DialogBody` to put them on. The status label is the kit's existing
  `AccountStatus`: green for Active, grey for Inactive.
- **The list is the stories.** It sits in `UserPage`: the H1 in the H3 size, the toolbar with
  "Search by name" and Export contact list, then the rows. On a wide screen the rows are the
  opportunity kit's `DataTable` with its caption. Below the header's switch point (`useNarrow`, read
  in script) each account is a card instead: its name as an H2 link in bold body text, then the
  status, account type and "Administrator: Yes/No" on one small line, under the caption as a `<p>`
  that labels the list. Each row and its four test IDs appear once either way.
- **The wait** is the kit's `Waiting` row ("Loading users…") under the H1.
- **The export dialog** is `DialogBody` with its H2 in the H4 size, the sentences as `op-text` and
  `op-note`. Its behaviour does not change.
- **Kept where the stories differ.** The "N of M people shown" line that announces how far a
  search has narrowed the list stays. It now sits in the kit's `SaveStatus` region, which takes no
  space while it is empty. DESIGN.md's gap 1 leaves the empty search undesigned, and without that
  line a screen reader is told nothing as the list narrows. The export's failure alert also stays,
  because the story draws no failure state.

## Consequences

No test ID, wording or behaviour changes. On a phone the list is no longer a table, so a test that
looks for table cells there finds cards. The test IDs are the same.
