# 0090 · The notification reference follows the chosen direction

- Status: accepted for the build (slice 21, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 21's one screen, the email notification
reference (`notification-email-reference` · `default`, `loading`, `not-found`), with the pieces of
`design/catalogue/notification-kit.tsx`: `NotificationPage`, `ReferenceContents` and
`ReferenceGroup`. The screen was still drawn with `Stack`, the design system's `Heading` and
`Text`, and inline styles. What the page shows and who may see it are unchanged; decision records
0067 and 0068 still say how.

## Decision

- **The kit's pieces live once in `frontend/src/app/notification-kit.tsx`.** It now holds
  `NotificationPage` (the opportunity kit's page frame with this kit's style sheet),
  `ReferenceContents` (the "Events that send email" `nav`), and `ReferenceGroup` (a `section` per
  event with its H2, an `article` per message under a rule with its H3, the Subject and "Who
  receives it and why" as the opportunity kit's `Details`, and the preview frame). The style sheet
  carries the catalogue's `nt-contents`, `nt-message` and `nt-preview` rules beside the existing
  ones. The terms broadcast and the opportunity list use the same style sheet.
- **The samples keep the service's shape.** The catalogue's `SampleMessage` has a fixed shape (a
  list of paragraphs, an optional link, a footer link). The kit draws the shape the service answers
  instead (body blocks of words and links, and the footer as a block), so the preview stays the
  message as sent (record 0067). The catalogue's paragraphs, link and footer line are drawn as those
  blocks, in the same frame, in the same order.
- **Loading and refusal are the catalogue's.** The loading state is the H1 and the kit's `Waiting`
  ("Loading sample emails…"). A refusal is still the shared missing page. The failure alert has no
  story. It is kept, and is now drawn in the same page frame.
- **The page sets no width or gap of its own.** It is laid out by `op-regions` inside the shell's
  page container, like every other restyled screen.

## Consequences

No test ID, wording or behaviour changes. Every test ID stays on the same element. The page
container carries `email-reference-page`, the event's words carry `email-reference-group-title`,
the subject and summary values carry `email-reference-subject` and `email-reference-summary`, and
the preview frame carries `email-reference-body`. Each message's facts are now a definition list
laid out in columns where they fit, instead of stacked.

Unsubscribe still ends only the three new-opportunity announcements, and every other sample ends
with "Manage your notification settings" (records 0022 and 0067). The story draws the same split.
