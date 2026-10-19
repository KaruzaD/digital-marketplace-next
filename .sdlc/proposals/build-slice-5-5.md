---
gate: G3
question: "Does slice 5 (An administrator can write and manage the service's pages) do what its criteria say?"
recommendation: "I restyled slice 5's three screens to the approved catalogue: the list of pages, the create form and a page's managing screen."
opened: 2026-10-19T02:19:13.987Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 5 (An administrator can write and manage the service's pages) do what its criteria say?

**Recommendation.** I restyled slice 5's three screens to the approved catalogue: the list of pages, the create form and a page's managing screen.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I restyled slice 5's three screens to the approved catalogue: the list of pages, the create form and a page's managing screen. Typecheck and `npm --prefix app run check` pass across all workspaces, including six new frontend tests. Nothing has been looked at in a browser, because this environment has none.

**What the slice already had.** All eighteen criteria were built in this slice's first pass (decision record 0025) and their tests still pass unchanged. Page requests, permissions, versions, the needed-page protection, authorship, the editor and image upload all behave as before. The only behaviour changes in this pass are layout and the duplicate-address state described below.

**What changed on screen.** Each screen now uses the shared page frame and heading sizes, and the shared pieces went into the app's content kit once, not per screen.
- **List of pages:** the title bar with Create page, then a table with a caption that counts the pages: "Every page, in order of title (N pages)". The number carries the one new test ID, `content-list-count`. "Needed by the service: Yes" is now a grey label. On a phone each page is a card instead of a table row, with the same test IDs once each. While the list loads, only the heading and "Loading pages…" show, as the loading story draws it, so Create page appears with the rows.
- **Managing screen:** "Manage a page" sits over the page's title. The facts are laid out as columns of labels and values, the needed-page warning and actions follow, then the current wording with title and address side by side. Editing happens in an "Edit the page" section.
- **Form:** title and address share a line where they fit. The image control's rule, upload progress, inserted message and refusal follow the files design.
- **Duplicate address:** while the refused address is still in the field, the form shows only the refusal: no intro sentence and no hint before Publish, as both duplicate-address stories draw it. Both come back once the address is changed, and the refusal still takes focus each time it appears.
- **Signed-in check:** the wait while the app checks who is signed in now looks the same as each screen's own loading state.
- **Kept where the stories are silent:** the alerts for a list that fails to load, a publish failure and a removal failure stay, since no story draws them.

Every existing test ID and all wording are unchanged. One thing a later test could trip on: on a phone, `content-list-table` is now on the list of cards, not on a table.

**Tests.** The new tests cover the list's loading state, the page count in the caption, the grey label, the phone cards in title order, the managing screen's heading and facts, the warning's title being shown, and the focused duplicate-address state with the hint coming back afterwards. The design system's check reported no problems on the restyled screens.

**Not mine to settle.** The brief says a fresh installation lists sixteen needed pages (decision record 0007), but decision record 0026 and DESIGN.md say twenty-two. The count on screen is whatever the database holds, which slice 1's migration and the seed decide. If the acceptance suite expects one figure and the data gives the other, the fix belongs there, not in these screens.

**Left for the next slice.** The "Notify vendors of updated terms" section on the terms page's managing screen belongs to slice 6 and is still drawn the old way.

The choices are recorded in `docs/decisions/0087-the-content-list-create-form-and-managing-screen-follow-the-chosen-direction.md`. The main code is in `app/frontend/src/app/content-kit.tsx` and the three screens under `app/frontend/src/screens/`.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Question: does slice 5's restyle of the content list, create form and managing screen still do what its criteria say? Ruling: approve. The verify result is a pass and current (recorded against application tree 8d6c048, which is this branch's app tree), with all 18 claimed criteria exercised and met and none unasserted. The diff is limited to layout: shared pieces consolidated into content-kit.tsx, existing test IDs and wording preserved, Delete still withheld and the address read-only on needed pages (R-7.25), authorship with System fallback kept (R-7.27), no history surfaced (R-7.23), and the duplicate-address refusal still focused on each appearance (R-7.22). Slice 6's terms-notification section is left untouched, no secrets, personal data or protected paths appear, and the six new unit tests cover the seams the restyle created. The 16-versus-22 needed-page question raised in the proposal is settled by R-7.12's text (twenty-two) and its passing test. What would change the ruling: a verify result on a different tree that does not pass, or a criterion found to depend on the list being a table on a phone.

**Conditions:**
none
