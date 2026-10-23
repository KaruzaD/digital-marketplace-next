# 0073 · The public page, the learn-more screens and the missing page follow the chosen direction

- Status: accepted for the build (slice 1, restyle)
- Date: 2026-10-17

## Context

Decision record 0069 brought the site shell, the footer and the home page into the direction approved
at G-DESIGN. Slice 1's other screens were still drawn in the older layout (`Stack` and design-system
`Heading` and `Text`): the public page at `/content/:slug` (stories `content-view.default`,
`.loading`, `.not-found`), the three learn-more screens (the story
`content-service-level-agreement-link.default` draws the Code With Us one), and the shared missing
page (`opportunity-kit.tsx`'s `MissingPage`). DESIGN.md's "Content screens in the chosen direction"
says how they look. The footer story (`content-footer.default`) is the shell's footer, which 0069
already built.

## Decision

- **A content kit in the app, started small.** `frontend/src/app/content-kit.tsx` holds the
  catalogue kit's `ContentPage` (the opportunity frame with the kit's style sheet), `PageArticle`
  (the `content-page` article labelled by `content-page-heading`) and `Time`. The rest of the
  catalogue kit (the managing screen's head, facts, form and list) belongs to slice 5's screens
  and is added there when they are restyled, not here.
- **The public page** is the story: the H1 in the direction's H3 size inside the head, Published
  and Last updated as the kit's `Details`, the rendered body, and the small address line last. The
  loading state shows only the kit's `Waiting` row ("Loading page"), with no H1.
- **The renderer draws a body's H2s in the section size** (the design system's H4) and deeper
  headings in bold body text. It is the one renderer (R-7.17), so every embedded body (terms,
  descriptions, evaluation instructions) changes the same way. Nothing else in it changed: raw markup
  is still shown as text, and the body element is still the `Stack` with `content-page-body`.
- **The learn-more screens** are the story's layout with the app's own words: the program's name as
  H1, "How … works" as a `Panel` holding the program's account (the story's placeholder panel), and
  "What it costs" as a `Region` holding the cost and the service level agreement link. The words are
  unchanged, because the catalogue does not design the learn-more content (DESIGN.md, content gap 7).
- **The missing page** is `MissingPage`: the opportunity frame carrying `not-found-page`, the H1,
  one sentence, and Back to home as the one primary action in the kit's `Actions` row. Every screen
  that shows `NotFound` picks it up.

## Consequences

The test IDs are unchanged. A body's H2 is now smaller than before. On a phone, Back to home runs
the full width of the column, as the kit's `Actions` row does everywhere.
