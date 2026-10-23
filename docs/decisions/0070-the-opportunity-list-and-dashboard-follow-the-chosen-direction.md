# 0070 · The opportunity list and the dashboard follow the chosen direction

- Status: accepted for the build (slice 8, restyle)
- Date: 2026-10-17

## Context

The design catalogue approved at G-DESIGN redraws the opportunity list
(`design/catalogue/opportunity-list-page.tsx`; stories `opportunity-list.*` and
`notification-optin-opportunity-list.*`) and the staff and administrator dashboard
(`opportunity-dashboard.*`, built from `opportunity-kit.tsx`). Beyond the look, the redrawn list
changes some behaviour that the earlier screen had chosen for itself: its words, which groups
start open, who is offered the status filter, and how the search matches. Decision record 0069
restyled the shell and the home page and left the list's own restyle to its stories.

## Decision

- **The kit is in the app once.** `frontend/src/app/opportunity-kit.tsx` is the catalogue's
  opportunity kit (status label and colour, page frame, head, details, regions, panels, action
  bar, manage tabs, fieldset, data table, wait). As with the home page, its `OpportunityPage` does
  not wrap itself in the page container, which the root layout already puts round every screen.
  `frontend/src/app/notification-kit.tsx` holds the notifications domain's row and save-status
  region, which the list's new-opportunity control uses. The marketplace rows
  (`frontend/src/app/marketplace.tsx`) gained the list's test IDs (`withTestIds`) and a slot for
  each row's Watch, so the home page and the list draw the same rows.
- **The list's words are the original site's, as the stories give them.** The H1 is "Welcome to
  the Digital Marketplace" (the document title stays "Opportunities"); the groups are
  "Unpublished Opportunities", "Open Opportunities" with its count, and "Closed Opportunities";
  each says when it is empty, in words that tell a search that matched nothing apart from a group
  that is empty. The "Showing N opportunities" line and each group's sentence about its order are
  gone: the open group's message sits in a polite status region that is always present, which is
  what announces a change in the results now.
- **Closed and Unpublished start closed.** Each is a section that keeps its test ID; its heading
  holds a button with `aria-expanded` that shows or hides its rows. Hidden rows stay in the
  document (the `hidden` attribute), so a group's contents can be read whether it is open or not,
  but a row inside a closed group must be opened before it can be seen or clicked.
- **Status words by role.** Public sector staff and administrators see the stage, in the words
  every other screen uses (`statusLabel`, so "Under review", "Team questions: individual
  evaluation", "Cancelled"). Anyone else sees Open, Evaluation (closed and waiting, processing or
  any evaluation stage), Canceled or Completed (awarded). The rule is `listStatusWords` in
  `backend/src/rules/opportunity-list.ts`. The label's colour follows the words (`statusColour`).
- **The status filter is offered to staff only,** as on the original site and in the stories,
  with the original site's option words ("Under Review"). The program filter's options are "All
  Opportunity Types" and the three programs. `statusFiltersFor` remains in the rules but the
  screen no longer offers a status filter to anyone else.
- **The search matches its words in order**, ignoring case, in the title or the location
  (`matchesSearch`), as the stories' search does. A phrase typed exactly still matches as before.
  Clear search appears when the open group has nothing for a search; it empties the field and
  returns focus to it. Reset clears the search and every filter.
- **Watch** is still offered on every row to a signed-in person who did not create the
  opportunity (R-1.5, `mayWatch`): the stories draw a vendor, and DESIGN.md's per-screen notes say
  staff see no Watch only on their own. A failed watch keeps its alert above the groups, since the
  stories draw no failure (opportunities gap 11).
- **The new-opportunity control** is the notifications kit's panel at the head of the results,
  before the first group, at every width (R-6.21, R-6.27). Its outcome, success or failure, is
  written into the panel's own status region.
- **The dashboard** is the kit's frame: the H1, Create an opportunity, then the table as a
  `DataTable` with a grey program label and a coloured status label in each row. The evaluation
  domain's section navigation and Evaluations table on the same page are drawn with the same
  pieces, as its own stories draw them, and keep their test IDs and anchors.

## Consequences

A test that found the list's H1 as "Opportunities", read the "Showing" line, or clicked a row in
the closed or unpublished group without opening it, must now open the group first. A vendor or a
visitor reading an open opportunity's `opportunity-status` on the list reads "Open", not
"Published". The opportunity views keep their own status wording until their own restyle.
