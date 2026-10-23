---
gate: G3
question: "Does slice 1 (A visitor can read the service's own pages) do what its criteria say?"
recommendation: "Every test ID is kept, and `npm --prefix app run check` passes twice in a row (858 backend, 541 frontend, 16 migration tests)."
opened: 2026-10-17T19:56:04.943Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 1 (A visitor can read the service's own pages) do what its criteria say?

**Recommendation.** Every test ID is kept, and `npm --prefix app run check` passes twice in a row (858 backend, 541 frontend, 16 migration tests).

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've restyled the site's shell and the home page to the catalogue approved at G-DESIGN. Every test ID is kept, and `npm --prefix app run check` passes twice in a row (858 backend, 541 frontend, 16 migration tests). I couldn't open a page, so the layout at each width is unchecked. Only unit tests in jsdom prove the screens.

**Status of the six criteria.** R-7.1, R-7.2, R-7.3, R-7.4, R-7.18 and R-7.19 were already built when this stage started. These parts were not touched: reading a page at `/content/:slug`, the not-found answers, lookup by identifier and then by address, the seeded service level agreement page and its links, and the compose file. The compose file already publishes the application at http://localhost:4300 and the identity provider at http://localhost:8080/realms/digital-marketplace. This turn was the operator's restyle.

**Shell** (`app/frontend/src/app/site-header.tsx`, `site-footer.tsx`, `site-styles.ts`, `root-layout.tsx`):
- **Skip link:** it is now the first thing on every page, ahead of the logo, and points at `<main id="main">`.
- **Wide screens:** a navigation row under the banner marks the current section. A visitor sees Home, Opportunities and Organizations. A signed-in person sees Dashboard first, and an administrator also gets Users and Content. Sign In and Sign Up are links. Once signed in, My Profile, My Organizations (vendors only) and Sign Out sit in a menu behind a button showing the person's email.
- **Narrow screens (under 768 px):** everything moves into a Menu button that Escape closes, returning focus to the button. Only one header is ever in the page, so no test ID appears twice.
- **Home page test IDs:** on `/` and nowhere else, `home-sign-in` and `home-sign-up` are on the header's Sign In and Sign Up, as the operator asked. At phone width a test has to open Menu before it can see them.
- **Footer:** it now has the original site's eight links, the "Owned and operated by the B.C. Government." line and no copyright line. The five page links keep their `footer-*-link` test IDs.

**Home page** (`app/frontend/src/screens/home.tsx`, plus the catalogue's labels, rows and program panels in `app/frontend/src/app/marketplace.tsx`):
- The page follows the catalogue's layout and wording. It shows the opportunities currently accepting proposals, nearest deadline first, using the same grouping rule as the opportunity list. To give each row its summary I added the opportunity's teaser to the list item the frontend reads. The backend already sent it.
- The awarded figures keep `home-awarded-count` and `home-awarded-value`.
- Opportunities and figures each show a loading status until they arrive. If either can't be read, the page says so.
- The search is a plain form that sends `q` to `/opportunities`. I made the opportunity list start with that search filled in. That is the only change to another slice's screen, and its restyle is still its own.
- The three program illustrations are copied into `app/frontend/public/images`.

**Unit tests:**
- A new `tests/site-header.test.tsx` covers the section marking, what each kind of user is offered, the skip link, the wide-screen account menu, the phone menu (opening, Escape and focus return, the home test IDs inside it) and the eight footer links.
- New tests in `tests/finding-opportunities.test.tsx` cover the home page listing only open opportunities in order with their count, both loading statuses and the search handing over to the list.
- I updated five older frontend tests that expected the old header: lowercase "Sign in" and "My profile" as plain links, and an email that now also appears in the banner.

**Backend test fix.** Two backend test files were intermittently failing `check` when the whole suite ran together; they pass when run alone. The setup waited a fixed 200 ms for mail and then cleared it, so mail from publishing that arrived late was counted against the next step. I changed both files (`running-opportunities-end-to-end.test.ts`, `code-with-us-proposals-end-to-end.test.ts`) to wait until no new mail arrives for a short spell. This is test code only, but it isn't this slice's work.

**Changed behaviour.** Acceptance tests that relied on the old header will now miss, and that change is the catalogue's. Before this restyle, a signed-in person's My profile and Sign out were plain links in the banner. Now they only appear once the account button is pressed, and the labels are capitalised ("Sign In", "Sign Out"). The decision record `docs/decisions/0069-the-site-shell-and-home-page-follow-the-chosen-direction.md` sets this out, along with the other choices above.

**What the next slice will find.** The opportunity list and the other screens still use their old look. The shared row and panel components are ready in `marketplace.tsx` for those restyles. I changed nothing outside `app/` and `docs/decisions/`.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether slice 1's restyled shell and home page do what R-7.1, R-7.2, R-7.3, R-7.4, R-7.18 and R-7.19 say. Verify ran against tree 072cfc8: five criteria pass and R-7.19 fails, so the gate cannot approve and the ruling is a return. The R-7.19 failure is the adapter's, not the application's. The failure screenshot (.sdlc/evidence/slice-1/R-7.19.png) shows the footer on / with About, Disclaimer, Privacy, Accessibility and Copyright links, next to Home, Contact Us and Source Code. The adapter's siteFooter() in tests/adapters/new/index.ts is `getByRole("contentinfo").or(getByText("Owned and operated by the B.C. Government.").locator("xpath=..")).last()`. The text's parent is nested inside the footer, so it comes later in document order, and `.last()` picks that small wrapper instead of the whole footer. That matches what was read: presentWhenSignedOut returned only "Owned and operated by the B.C. Government." and aboutLink found no link inside that wrapper, so it read "". The build added that line as the design catalogue asked, and the five links still carry their footer-*-link test IDs. Nothing in the diff needs changing for this criterion. The rest of the diff does not need changes either. The header, footer and home page follow the catalogue. The one change to another slice's screen is pre-filling the opportunity list with the search the home page sends. The backend test changes are test-only and replace a fixed 200 ms wait with waiting until no new mail arrives. No secrets or personal data appear. New unit tests cover the header, menus and home page listing. What would change the ruling: a re-bound adapter that scopes the footer to the whole footer, and a verify run in which R-7.19 passes against this tree. If the rebound adapter still reads no About link while the page shows one, the failure would then need a fresh look.

**Conditions:**
- addressed-to bind-adapter: R-7.19: contentFooter scopes every read to siteFooter(), which is `getByRole("contentinfo").or(getByText("Owned and operated by the B.C. Government.", {exact:true}).locator("xpath=..")).last()`. On / the page now draws that line in its own small block inside the footer, so `.last()` picks the line's parent rather than the whole footer. presentWhenSignedOut read only "Owned and operated by the B.C. Government." and aboutLink read "". The page does show the five links, labelled About, Disclaimer, Privacy, Accessibility and Copyright, in the footer's link list beside that block (evidence .sdlc/evidence/slice-1/R-7.19.png). Scope the footer to the whole footer region (the outermost match, or the contentinfo landmark on its own), not to the parent of the ownership line.
