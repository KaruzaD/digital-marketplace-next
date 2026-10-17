---
gate: G3
question: "Does slice 8 (Anyone can find opportunities and follow the ones they care about) do what its criteria say?"
recommendation: "I restyled slice 8's two screens, the opportunity list at `/opportunities` and the staff and administrator dashboard at `/dashboard`, to match their approved catalogue stories, and every test ID is st…"
opened: 2026-10-17T23:47:23.410Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 8 (Anyone can find opportunities and follow the ones they care about) do what its criteria say?

**Recommendation.** I restyled slice 8's two screens, the opportunity list at `/opportunities` and the staff and administrator dashboard at `/dashboard`, to match their approved catalogue stories, and every test ID is st…

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 8's two screens, the opportunity list at `/opportunities` and the staff and administrator dashboard at `/dashboard`, to match their approved catalogue stories, and every test ID is still on its element. `npm --prefix app run check` passes: typechecks clean, 16 migrations tests, 862 backend and 550 frontend unit tests. I could not run the acceptance suite or look at any page in a browser.

**What was already there.** Every criterion on the slice's list (R-1.2, R-1.3, R-1.5, R-1.6, R-1.38, R-4.22, R-6.20, R-6.21, R-6.27) was already built by an earlier pass and its tests passed before I started. So this stage was a restyle, not new behaviour.

**Shared pieces.** The catalogue's `opportunity-kit.tsx` now lives once in the app as `app/frontend/src/app/opportunity-kit.tsx`. As with the home page, it does not wrap itself in the page container, because the root layout already does that. A small `app/frontend/src/app/notification-kit.tsx` holds the button row and the save-status region the new-opportunity email control uses. The existing row component in `marketplace.tsx` gained the list's test IDs and a place for each row's Watch, so the home page and the list draw the same rows.

**The list.** It follows its story:
- The heading is "Welcome to the Digital Marketplace"; the browser tab still says "Opportunities".
- Filters sit in a sidebar on wide screens and above the results on narrow ones, followed by the three programs' descriptions.
- The new-opportunity email control is at the head of the results at every width, and saves at once in both directions (R-6.21, R-6.27). Its result, success or failure, is announced in its own status region.
- The groups are "Unpublished Opportunities", "Open Opportunities" with its count, and "Closed Opportunities". Each says when it is empty, in words that tell a search that matched nothing apart from a group that is simply empty.
- Clear search empties the search box and puts focus back in it; Reset clears everything.

**Behaviour the design changes.** Several of these are visible to the acceptance suite:
- **Closed and Unpublished start closed.** A button in each heading opens them. Their rows stay in the page and the groups keep their test IDs, but a row has to be opened before it can be seen or clicked.
- **Status words depend on who is looking.** Public sector staff and administrators see the stage in the words the other screens use ("Draft", "Under review", "Team questions: individual evaluation", "Cancelled"). Anyone else sees Open, Evaluation, Canceled or Completed. The rule is `listStatusWords` in `backend/src/rules/opportunity-list.ts`.
- **The status filter is offered to staff only.** The design takes this from the original site.
- **The search matches its words in the order typed** (`matchesSearch`). Anything the old exact-phrase search matched still matches.
- **Watch stays on every row the person did not create**, staff included. The stories only draw a vendor, but R-1.5 says anyone signed in may watch, and the design notes say staff lose Watch only on their own opportunities.

I made the staff-only filter and the collapsed groups match the design because the spec notes say the acceptance tests were checked against the original site, which behaved this way. Status wording is the change most likely to break an acceptance test: a vendor or visitor reading an open opportunity's status on the list now gets "Open", not "Published". Decision record `0070` sets all of this out.

**The dashboard.** It follows its stories: the heading, the primary "Create an opportunity" button, then the table with a grey program label and a coloured status label in each row. The page also carries the evaluation domain's section links and "Evaluations" table, which belong to a later slice. I restyled them with the same pieces, as their own stories draw them, and left their test IDs and in-page links unchanged.

**Tests.**
- **Updated:** the list's frontend tests now expect the new wording and open a collapsed group before reading its rows.
- **Added on the list:** the closed group opening on request, status words for a visitor against staff, the staff-only filter, the empty-group messages, Clear search and focus, Reset, and words matched in order.
- **Added elsewhere:** the email control's failure message, and an accessibility run for staff with every group open. There is a new test file for the kit, and rule tests for `matchesSearch`, `isNarrowed` and `listStatusWords`.

**Other things.**
- `npm ci` created `app/node_modules`, and my shell cannot delete it, so I added `app/.gitignore` to keep it out of the proposal.
- `app/compose/compose.yaml` was not changed. It already publishes the application at http://localhost:4300 and the identity provider's realm at http://localhost:8080/realms/digital-marketplace.
- The README's section on the list now mentions the restyle.
- I changed nothing outside `app/` and `docs/decisions/`.

**What the next slice will find.** The three opportunity view pages (Code With Us, Sprint With Us, Team With Us) are not restyled; they belong to slices 7 and 10. They still use the old status badge, which shows the stage to everyone, so a vendor sees "Published" there but "Open" on the list until those pages get their own restyle. That restyle can build on `opportunity-kit.tsx`. `statusFiltersFor` is still in the rules and its tests, but no screen uses it now.
