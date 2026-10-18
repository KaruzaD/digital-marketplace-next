# 0072 · The Code With Us proposal screens follow the chosen direction

- Status: accepted for the build (slice 14, restyle)
- Date: 2026-10-17

## Context

The design catalogue approved at G-DESIGN redraws slice 14's screens: the Code With Us proposal
form (`proposal-cwu-create-page.tsx`, stories `proposal-cwu-create.*`), its manage page
(`proposal-cwu-edit.*`) and the vendor dashboard (`proposal-vendor-dashboard.*`), all built from
`proposal-kit.tsx` on top of the opportunity kit. DESIGN.md's "Code With Us proposal form" and
"Proposal screens in the chosen direction" say how. Decision records 0069 to 0071 already brought
the shell, the marketplace components and the opportunity kit into the app. The behaviour of these
screens stays what decision records 0055 to 0057 set.

## Decision

- **The proposal kit is in the app once.** `frontend/src/app/proposal-kit.tsx` is the catalogue's
  kit: the status label and its colour, the page frame, the head, the action bar, the tabs, the
  focused message, the form part and the long form beside the opportunity summary
  (`ProposalFormPage`). As with the opportunity kit, the frame does not wrap itself in the page
  container. Slice 15's Sprint With Us and Team With Us screens can draw from it as they are
  restyled. `ProposalStatusBadge`, which those screens and the opportunity's proposals tab already
  use, is now the kit's coloured label, so the status looks the same wherever it is shown.
- **The create page is the catalogue's form, in the original site's words.** It has the H1 "Create a
  Code With Us Proposal", the opportunity's title, the introduction and the guide link, then
  "1. Proponent", "2. Proposal" and "3. Attachments". The labels and help text are the original
  site's, and the summary gives program, title, closing date, then reward, location and Remote OK.
  It holds Submit, Save Draft and Cancel. The terms dialog is "Review Terms and Conditions", with
  Submit Proposal first.
- **The manage page's form is drawn in its `editing` story's words**, which are the app's own
  ("Who is submitting this proposal?", "Legal name"). It uses the same layout, with the head,
  identifiers and tabs above the form and Save changes and submit, Save changes, Cancel in the
  summary. The manage page's terms dialog keeps "Submit your proposal", as its `terms` story does.
  Both forms keep every field, rule and test ID.
- **Choices kept from earlier records.** The proponent still starts unchosen (decision record
  0056), though the create stories draw Individual already ticked.
- **The error summary.** It is "Unable to Submit Proposal" (or "Unable to Save Proposal" for a save
  the service refused) with the original site's sentence, and it takes focus when it appears. Its
  list carries `proposal-field-errors`, and each item `field-error`. Each item still names its field
  beside the message ("Legal name: enter your legal name"), because the surface asks for the field
  and its message together. The messages are still the shared rules' messages, not the original
  site's sample sentences.
- **A saved draft is said on the manage page.** Saving a draft from the create page still lands on
  the new proposal's manage page, because a second save from the create page would be refused as a
  second proposal (R-2.2). The navigation hands over a flag, and the manage page shows the
  `draft-saved` story's success alert, "Draft Proposal Saved", which stays until it is dismissed.
  Focus starts at the new page's H1, as on every page change, so the alert is announced as a status
  rather than taking focus.
- **The attachment control can be a form part.** `AttachmentControl` takes a part title and, for
  the create page, the story's own words (the limit in one sentence, "Add Attachment"). On the
  manage page's form it keeps its introduction and limit note. Its behaviour is decision record
  0033's.
- **Left out on purpose.** The "Proposal Evaluation Criteria" accordion is left out: the contract
  gives a Code With Us opportunity no evaluation criteria, so there is nothing to put in it. The
  story's "You can format your proposal with Markdown" is left out too: the proposal is shown as
  plain text, so the sentence would promise something the service does not do. The create page's
  text areas have no length cap, as in the story, so text over 10,000 characters is refused by the
  check and the service with the field named, not cut off as it is typed (R-2.13).
- **The manage page's order is its stories'.** Head (eyebrow, program, status), details, the
  opportunity and printable-copy links, the action bar (always present, empty when nothing is
  offered: the old "There is nothing to do" sentence is gone), any message, the tabs, then the tab's
  region with Result, Proponent, Proposal text, Additional comments and Attachments as level-3
  regions. History is the kit's `DataTable`.
- **The dashboard** is the kit's frame. It has the H1, the section links in a navigation landmark,
  then a region for each list, with the program as a grey label and the status as a coloured one.

## Consequences

A test that read "Create a Code With Us proposal" as the create page's H1 now reads "Create a Code
With Us Proposal" (the document title is unchanged). A test that found the create page's actions
as "Submit proposal" and "Save draft" now finds "Submit" and "Save Draft", and the terms dialog's
confirm button now reads "Submit Proposal". The test IDs are unchanged. The Code With Us read-only
page, the other programs' manage pages and the proposals tab use the restyled history table and
status label.
