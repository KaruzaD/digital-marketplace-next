---
gate: G3
question: "Does slice 7 (Staff can draft, submit and publish a Code With Us opportunity) do what its criteria say?"
recommendation: "I restyled slice 7's screens to match the approved design catalogue."
opened: 2026-10-18T01:34:03.230Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 7 (Staff can draft, submit and publish a Code With Us opportunity) do what its criteria say?

**Recommendation.** I restyled slice 7's screens to match the approved design catalogue.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 7's screens to match the approved design catalogue. Every test ID the stories and `surface.yaml` give these pages is still on the matching element, and what the screens do is unchanged apart from two wording changes covered below. `npm --prefix app run check` passes: 862 backend tests, 554 frontend and 16 migration. I could not run the app in a browser here, so the screens have only been checked by unit tests.

**What this run was.** Slice 7 was already built in earlier runs. The backend for every criterion assigned to it (R-1.4, R-1.7, R-1.10, R-1.11, R-1.12, R-1.14, R-1.21, R-1.22, R-1.23, R-1.29, R-1.34, R-1.37, R-1.51, R-6.8, R-8.17, R-8.27) was in place, and the existing tests for it passed before I changed anything. The operator asked for this slice's pages to be redrawn from their stories, reusing the site shell and opportunity kit that the earlier restyles had already put in `app/frontend/src/app`. So I changed only how the pages look and touched no backend code, rules or compose services. Compose still publishes the app on :4300 and the identity provider's realm on :8080.

**Screens restyled**
- **Program chooser:** three equal panels, each with a secondary Create link. Each panel keeps the service level agreement link even though its story leaves it out, because R-7.18 and DESIGN.md's content test IDs need it there.
- **Create form, and the manage page's Opportunity tab:** each part of the form is now a panel (H2 on the create page, H3 on the tab).
- **Manage page:** now in the catalogue's order — page header with program and status, the opportunity ID, the action bar (always present, empty when nothing is offered), the tabs, then the tab's section. The Summary tab's facts and reporting figures are a details list, and the History tab is the kit's table. The History section now carries `opportunity-history-section` and has no way to add a note (R-1.33).
- **Public view:** the facts appear in the fixed order. Key dates are a details list with their own test IDs, and there is no completion date, as the contract says. A vendor's Watch and Start a proposal share one region. The successful proponent's contact and score now carry their contract test IDs and appear only when the service sends them.
- **Attachment control:** redrawn from the files catalogue's rows, with the size limit stated before a file is chosen (R-8.17). Its behaviour is unchanged.

**Decisions** (recorded in `docs/decisions/0071`)
- **Shared style sheet:** the attachment control, history table, reporting figures, addenda list, Watch control and successful-proponent section also appear on screens not yet restyled (the other two programs' pages, the proposal forms). So the root layout now loads the kit's styles once for every screen. Every rule is scoped to the kit's own classes, so nothing else changes.
- **Status wording on the view:** vendors and visitors now see "Open", "Evaluation", "Canceled" or "Completed"; staff and administrators see the stage. This follows DESIGN.md and matches the list's wording from decision 0070. I updated the one unit test that expected "Published".
- **Two departures from the stories, kept from decision 0032:** the result of an action is shown inside the tab's section rather than between the tabs and the section, and the action bar stays on the Opportunity tab even though the editing story shows it empty. Decision 0032 made both choices after R-1.21 failed an acceptance run because it couldn't be reached from that tab, and I did not reopen them.

**New unit tests**
- The program panels are sections, named by their program.
- The manage page appears in the catalogue's order, with `aria-current` on the current tab and an empty action bar for an author once the opportunity is published.
- The form's panels appear in order.
- The view's header shows the program label, then the status, then the facts in order, and the vendor's Watch and Start a proposal share one region.
- Staff read the stage on the view, and the author is not offered Watch.

**Not done here**
- The shared "Page not found" screen is not in the direction's type yet; that belongs to the site shell.
- The other two programs' create, manage and view pages, and the proposal forms, still have their old layout. They now pick up the restyled shared pieces, but their own restyle needs their own stories.

I changed nothing outside `app/` and `docs/decisions/`.

## Ruling

**Verdict:** return
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 7 do what its criteria say, given verify failed R-1.14, R-1.21 and R-1.22 three times running? Ruling: return, with the work addressed to bind-adapter. The verify evidence decides it: the R-1.21 page snapshot (.sdlc/evidence/slice-7/R-1.21.txt) shows the page head reading 'Code With Us Draft' and 'Closes October 31, 2026 at 4:00 p.m. Pacific time', so the application renders the status and the 4:00 p.m. deadline these criteria ask about. The adapter's opportunityCwuView.status() and proposalDeadline() (tests/adapters/new/index.ts:8313, :8320) read them as definition-list terms labelled 'Status' and 'Proposal deadline', which the restyle removed to follow the catalogue approved at G-DESIGN, while keeping the opportunity-status and opportunity-proposal-deadline test IDs on the elements. Every read returned an empty string, and that single mismatch accounts for all three failures. Another build cannot fix this without undoing an approved design, and it is not a pipeline defect, because bind-adapter can be asked to rebind. R-1.51 is not asserted through the running service but is covered by the app's state rules, backend tests and migration, and does not block on its own. What would change the ruling: a rebound adapter reading the test-ID elements that still fails to see 'Draft', 'Published' or 4:00 p.m. where the page shows them, which would put the fault back on the application.

**Conditions:**
- addressed-to bind-adapter: opportunityCwuView.status() and opportunityCwuView.proposalDeadline() in tests/adapters/new/index.ts look up definition-list terms labelled 'Status' and 'Proposal deadline'. The Code With Us view, restyled to the catalogue approved at G-DESIGN, no longer has either label. Status is now an unlabelled label in the page head (data-testid opportunity-status), and the deadline is a head fact reading 'Closes <date> at 4:00 p.m. Pacific time', or 'Closed' once passed (data-testid opportunity-proposal-deadline). Rebind both reads to those test IDs, and check reward(), which still finds its 'Reward' label but now carries data-testid opportunity-reward. Shown by verify on build-slice-7-11 (application tree 7e29391): R-1.14, R-1.21 and R-1.22 all read '' from these members, while the page snapshot .sdlc/evidence/slice-7/R-1.21.txt shows 'Draft' and the 4:00 p.m. deadline on the page.
