# 0087 · The list of pages, the create form and the managing screen follow the chosen direction

- Status: accepted for the build (slice 5, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws the content area's three screens: the list of pages
(`content-list` · `default`, `loading`, `deleted`, `not-found`), creating a page (`content-create` ·
`default`, `ready`, `invalid`, `duplicate-slug`, `publish-confirm`, `not-found`) and a page's
managing screen (`content-edit` · every state). DESIGN.md's "Content screens in the chosen
direction" says how they look. Decision record 0073 already restyled the public page and started
`frontend/src/app/content-kit.tsx` with only what that page needed, leaving "the managing screen's
head, facts, form and list" to this slice. Until now these screens were drawn with `Stack`, the
design system's `Heading`, an inline-styled table, a round outlined badge and a wrapping row of
`<dl>` items. Behaviour is unchanged by this record; decision record 0025 still says how pages are
managed.

## Decision

- **The content kit takes the rest of the catalogue kit once.** `content-kit.tsx` now also holds
  `TitleBar`, `ManageHead`, `PageFacts`, `Notice`, `FixedPageWarning`, `PageActions`,
  `CurrentWording`, the form's layout (`PageForm`, `FieldPair`, `FieldGroup`, `PublishProblems`),
  `Refusal` (the danger alert with its title, focused where asked), `PageRows` and
  `NeededExplained`, with the catalogue's `ct-*` style sheet. The fields themselves stay in
  `screens/content-form.tsx`, which drives them; its component is renamed `PageEditor` so that the
  kit's `PageForm` keeps the catalogue's name.
- **Every content screen is `ContentPage`**: the H1 in the H3 size, regions `large` apart. The
  administrators-only gate's own wait (session not yet known) is drawn the same way as each
  screen's loading state: the H1 over the kit's `Waiting` row.
- **The list** is the stories: the title bar with Create page, the removal notice, the sentence
  about "Needed by the service", then the rows. While the list is on its way the H1 stands alone
  over "Loading pages…", as `content-list.loading` draws it, so Create page appears with the rows.
  On a wide screen the rows are the `op-table`; below the header's switch point (`useNarrow`) each
  page is a card. The caption reads "Every page, in order of title (N pages)", the number alone in
  `content-list-count` (DESIGN.md gap 45). "Yes" is a grey label.
- **The managing screen** is the head ("Manage a page" over the title), the notice it arrived
  with, the facts as `Details` (to the minute, as before), the warning on a needed page, the
  actions, and the current wording with title and address side by side. Editing is the "Edit the
  page" `Region`.
- **The form** puts title and address on one line where each has 280 pixels. The image control's
  rule, upload status, inserted message and refusal are the files domain's (`file-kit.tsx`'s
  `ImageEditor`): small text, the kit's waiting row, the danger alert.
- **The address-in-use state says only that.** While the address the service refused is still in
  the field, the intro sentence and the hint before Publish are not drawn and the button names no
  hint, as both `duplicate-slug` stories draw it. Once the address is changed they return. The
  refusal is focused each time it appears (given a new `key`), as it was.
- **Kept where the stories differ.** The list's failure alert ("The pages could not be loaded"),
  the publish failure and the removal failure stay, because no story draws them.

## Consequences

No test ID or wording changes; `content-list-count` is the one test ID added, as the catalogue
adds it. On a phone the list is no longer a table, so a test that looks for table cells there
finds cards; `content-list-table` is on the cards' list. The alerts' titles ("Page published",
"The service needs this page", …) were already rendered through `TitledAlert` and still are.
