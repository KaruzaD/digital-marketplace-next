| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T06:24:27.027Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 1 (A visitor can read the service's own pages) do what its criteria say?

**Recommendation.** I restyled slice 1's remaining screens to match the design catalogue.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 1's remaining screens to match the design catalogue. `npm --prefix app run check` passes: the typecheck is clean, 862 backend tests pass and 577 frontend tests pass, including 12 new ones.

**Starting point.** An earlier restyle had already done the header, the footer and the home page (decision record 0069). The footer story is the same footer, so it needed no work. Three things were still in the old layout: the public page at `/content/:slug`, the three learn-more screens, and the shared not-found page.

**What I changed:**
- **Shared content kit.** I added `app/frontend/src/app/content-kit.tsx`, taken from the catalogue's content kit. For now it holds only the page frame, the article wrapper (`content-page`, labelled by its H1) and a date element. The kit's managing-screen parts are for slice 5's screens, so I left them for when those are restyled.
- **Public page (R-7.1).** It now follows the `content-view` stories. The title is the H1, then the Published and Last updated dates, then the body, and the address line last. While the page loads, only a "Loading page" status row shows, with no heading. The loading logic and the not-found handling (R-7.2, R-7.3) are unchanged.
- **Formatted-text renderer.** A body's level-2 headings now use the direction's section size, and deeper headings use bold body text. Markup in a body is still shown as text and never run (R-7.17). This is the only renderer in the app, so every embedded body changes the same way: terms, opportunity descriptions, evaluation instructions.
- **Learn-more screens (R-7.18).** They follow the service-level-agreement-link story: the program name as the heading, "How … works" in a bordered panel, then a "What it costs" section with the cost and the service level agreement link. The link still points to `/content/service-level-agreement` and keeps its test ID. I kept the existing wording, because the catalogue doesn't design what these screens say.
- **Not-found page.** It now matches the catalogue: "Page not found", one sentence, and a Back to home button. Every screen that shows it picks this up, and its test ID is unchanged.

**Tests.** The new tests are in `app/frontend/tests/slice-one-screens.test.tsx`. They cover:
- the public page's layout, date order, body headings starting at level 2, address line last, and the loading state;
- the renderer's heading sizes, and raw markup still shown as text;
- the learn-more panel, the cost section, and where the link sits and points;
- the not-found page's heading, sentence and way home, and that it never says "not allowed".

All test IDs are unchanged. I recorded the choices in `docs/decisions/0073-the-public-page-learn-more-and-missing-page-follow-the-chosen-direction.md`.

**Not done here:**
- I didn't change the backend, the migrations, `compose.yaml` or the seed. Nothing in this restyle needed it, and R-7.4 and the seeded service level agreement page work as before.
- The workspace had no dependencies installed, so I ran `npm ci` under `app/` before the check; it doesn't change any committed file.
- I couldn't look at the pages, because there is no browser here. I checked their structure in unit tests only.
- Slice 5's content screens (the list, create and manage pages) are still in the old layout.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether slice 1 (a visitor can read the service's own pages) does what its criteria say. Its own work does. All six criteria the slice claims pass: R-7.1, R-7.2, R-7.3, R-7.4, R-7.18 and R-7.19. The restyle changes only the public page, the learn-more screens, the missing page, the shared formatted-text renderer and a small new content kit. Test IDs, routes and loading/not-found behaviour are unchanged. Raw markup is still shown as text (R-7.17). There are unit tests for the new layout. No backend, secret or personal data is touched, and nothing else in the code needs to change. The verdict is still `fail`, because three earlier-approved criteria failed in the regression run (the whole suite re-run against this branch): R-1.43, R-5.16 and R-1.40. The diff touches none of their screens. In each case the page captured at the failure shows what the criterion needs, and the adapter (the test harness code that drives the pages) read the wrong place. For R-1.43 and R-5.16 the evaluation-panel page at consensus shows the note "The evaluation panel can no longer be changed" and a read-only members table. The adapter's `section()` in `evaluationPanelPage` ends with `.last()`, which picks the inner "Members of the evaluation panel" table region instead of the outer "Evaluation panel" region. So `lockNote()` finds nothing, `editable()` returns true, and `addPanelMember` clicks a chooser that does not exist until it times out. For R-1.40, the administrator's report shows the opportunity's title as the H1, and that title also names the report article. But `documentText` reads only the element carrying `opportunity-full-report`, which starts at the "Opportunity" section below the H1, so the title is missing from what it read. The approval rule refuses any `fail` verdict, so this is a return. The only conditions are for `bind-adapter`, which owns that code. What would change the ruling: once the adapter fixes are approved and a fresh verify on this tree comes back with nothing failing, this build should be approved as it stands.

**Conditions:**
- addressed-to bind-adapter: R-1.43: on /opportunities/sprint-with-us/00000000-0000-4000-a011-000000000001/edit?tab=evaluationPanel at the consensus stage, the page shows a region "Evaluation panel" holding the note "The evaluation panel can no longer be changed — The consensus stage has begun, so the panel is fixed." (inside `evaluation-panel-locked-message`), with a read-only table region "Members of the evaluation panel" nested inside it. evaluationPanelPage's section() ends in `.last()`, so it resolves to the nested members-table region (it holds the member rows), which does not contain the note. lockNote() therefore counts 0, editable() returns true, and addPanelMember waits on a member chooser the locked page never draws until the 15s timeout. section() has to resolve to the outermost "Evaluation panel" region, or lockNote() has to look across the whole panel, so the lock is read as a refusal.
- addressed-to bind-adapter: R-5.16: the same fault in evaluationPanelSwu.addPanelMember on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluationPanel. The page shows status "Team questions: consensus" and the note "The evaluation panel can no longer be changed" in the outer "Evaluation panel" region. section()'s `.last()` picks the nested "Members of the evaluation panel" table region, the lock note is missed, and the adapter tries to click a member chooser that is not on the page (locator.click timeout) instead of noting the refusal.
- addressed-to bind-adapter: R-1.40: opportunityCwuComplete.fullReport on /opportunities/code-with-us/00000000-0000-4000-a008-000000000001/complete (as an administrator) returned text starting "Opportunity Status Awarded Reward $5,000 …". It read only the element carrying `opportunity-full-report`, which starts at the "Opportunity" section. The page shows the opportunity's title "Seeded awarded Code With Us opportunity" as the report's H1, just above that element, and the report article is named by that title. fullReport has to include the report's heading (the H1 that labels the document), not only the body below it.
