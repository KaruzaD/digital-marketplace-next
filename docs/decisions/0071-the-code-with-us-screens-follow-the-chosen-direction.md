# 0071 · The Code With Us screens follow the chosen direction

- Status: accepted for the build (slice 7, restyle)
- Date: 2026-10-17

## Context

The design catalogue approved at G-DESIGN redraws slice 7's screens: choosing a program
(`opportunity-program-select.*`), the Code With Us create form (`opportunity-cwu-create.*`), its
manage page (`opportunity-cwu-edit.*`), its public view (`opportunity-cwu-view.*`, drawn by
`opportunity-view-page.tsx`) and the attachment control (`file-attachment-control.*`, drawn by
`file-kit.tsx`). DESIGN.md's "Opportunity screens in the chosen direction" and "File screens in the
chosen direction" say how. Decision records 0069 and 0070 already brought the shell, the
marketplace components and the opportunity kit (`frontend/src/app/opportunity-kit.tsx`) into the
app; this restyle builds on them and adds no second copy of either.

## Decision

- **Every slice-7 screen is the kit's frame.** Each draws `OpportunityPage`, `PageTitle` or
  `OpportunityHead`, `Details`, `Region`, `Panel`, `ActionBar`, `ManageTabs`, `DataTable` and
  `Waiting`, as its stories do. Paragraphs take the kit's `op-text` and `op-note`; no screen sets a
  width, an outer padding or a gap of its own.
- **The kit's style sheet is placed once, by the root layout.** The attachment control, the
  history table, the reporting figures, the addenda list, the Watch control and the successful
  proponent are shared with screens whose own restyle is still to come (the other two programs'
  manage and view pages, the proposal forms). Drawn with the kit's classes, they would lose their
  look there unless the sheet were present, so `RootLayout` renders `OpportunityStyles` beside the
  site's own. Every rule in it is scoped to the kit's classes, so nothing else changes. The
  `<style>` that `OpportunityPage` still renders repeats the same rules and is harmless.
- **The attachment control is the files kit's.** A `Panel` headed Attachments, the rows as
  bordered `fl-row` items in an `fl-rows` list, a stored row's download link and Remove sharing a
  line, the stated limit as a note the Add attachment button is described by (R-8.17), then the
  button in an `Actions` row. Its behaviour is decision record 0033's, unchanged. The rows' own
  style sheet lives with the control in `frontend/src/app/attachments.tsx`.
- **The view's status words follow the list.** A vendor or a visitor reads Open, Evaluation,
  Canceled or Completed; public sector staff and administrators read the stage
  (`listStatusWords`, decision record 0070). The head shows the deadline after "Closes", or
  "Closed" once it has passed, the reward, the location and Remote OK, then the teaser. The key
  dates are a details list carrying `opportunity-assignment-date` and `opportunity-start-date`; the
  view shows no completion date (DESIGN.md gap 32). The vendor's Watch and Start a proposal share
  one region, which is the Watch control's, so the other programs' views draw it the same way.
  The successful proponent's contact and score carry
  `opportunity-successful-proponent-contact` and `-score`, rendered only when the service sends
  them (R-1.27).
- **The manage page's order is the catalogue's,** with one exception kept from decision record
  0032: head ("Manage a Code With Us opportunity", program, status, title), the identifier as a
  detail, the action bar (always present, `opportunity-actions`, empty when nothing is offered),
  the tabs, then the tab's region. The History region carries `opportunity-history-section` and
  holds no control for adding a note (R-1.33). What an action came to is still said inside the
  tab's region, directly under its heading, rather than between the tabs and the region as the
  `incomplete` story draws it, and the action bar keeps offering Submit for review, Publish, Delete
  and Cancel on the Opportunity tab (where the `editing` story leaves it empty). Decision record
  0032 made both choices after R-1.21 was returned unreachable from that tab, and this restyle does
  not reopen them.
- **The program chooser keeps the service level agreement link** on each panel, as a note under
  the budget (R-7.18; DESIGN.md, content, "Test IDs"), though its story draws none. Its three
  Create links are secondary buttons: none is the screen's primary action.
- **The missing page is unchanged.** The catalogue's `MissingPage` is the users domain's "Page not
  found" in the direction's type; the app's shared `NotFound` keeps its test ID and words, and
  restyling it belongs to the shell, not to this slice.

## Consequences

A test that read "Published" in `opportunity-status` on a Code With Us opportunity's page as a
vendor or a visitor now reads "Open". The view no longer carries the "Code With Us opportunity" line
above its title; the program is the grey label in the head. A test reading the Summary tab's facts
reads them as a details list (`dt`/`dd`) instead of the old key facts list, with the same test IDs.
