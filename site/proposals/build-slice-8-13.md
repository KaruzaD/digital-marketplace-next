| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T00:38:22.715Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 8 (Anyone can find opportunities and follow the ones they care about) do what its criteria say?

**Recommendation.** The Closed Opportunities group on `/opportunities` starts collapsed again, as DESIGN.md says ("Closed and Unpublished start closed").

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The Closed Opportunities group on `/opportunities` starts collapsed again, as DESIGN.md says ("Closed and Unpublished start closed"). `npm --prefix app run check` passes: it typechecks every package and runs all the unit tests, and the three test suites passed 16, 862 and 550 tests. I had to install the dependencies first (`npm ci`), because `tsc` was missing from the workspace.

**What I changed:**
- **The screen:** in `app/frontend/src/screens/opportunity-list.tsx` I removed `defaultOpen` from the Closed group's `Disclosure`, so it starts closed like the Unpublished group. The comment above it no longer points to the withdrawn decision. I kept the `defaultOpen` option on the component itself, because the catalogue's `Disclosure` takes it, but no group uses it now.
- **The decision record:** I deleted `docs/decisions/0071-the-closed-opportunities-group-starts-open.md`. Nothing else in `app/` or `docs/` referred to it.
- **The unit test:** in `app/frontend/tests/finding-opportunities.test.tsx`, the visitor test of the list now checks that the closed rows are hidden at first. It opens the group with `openGroup`, which checks `aria-expanded` goes from false to true, before reading the rows. It then checks that the button still hides and shows them.

Nothing else from the previous revision was touched: the restyle, the status words by role, the search, the shared kit and the dashboard tables stay as they were.

**Still outstanding, for another stage:** with Closed collapsed and last on the page, this slice will fail its acceptance run again until the adapter is fixed. It has to read each group's rows from inside that group's own section and open a collapsed group before reading it. That fix belongs to bind-adapter, it has been filed there, and I left `tests/adapters` alone. I have no browser or Docker here, so this change is proven only by the unit tests.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 8 do what its criteria say? Return. Verify reports R-1.3 (both cases) and R-1.38 failing, and every one of those failures is the adapter reading nothing from a page that shows what the criterion needs. The pictures of the page as it failed (.sdlc/evidence/slice-8/R-1.3.txt, R-1.3-2.txt, R-1.38.txt) show 'Seeded published Code With Us opportunity' and both R-1.38 opportunities, soonest deadline first, inside the open group's own region. Its heading's accessible name is 'Open Opportunities 3' or 'Open Opportunities 5', because the approved design draws the open count inside the heading. The adapter's OPPORTUNITY_GROUPS patterns (tests/adapters/new/index.ts:4312, e.g. /^open(?: opportunities)?$/i) are anchored at the end and do not allow the count, so groupSection finds no section and no heading, and opportunityGroup returns '' at line 4365 as if the reader were shown no such group. Nothing in the application has to change for these criteria. This revision does what build-slice-8-12#2 asked: the Closed group's Disclosure no longer takes defaultOpen, decision record 0071 is withdrawn, and the unit tests open the closed group with openGroup (which checks aria-expanded goes from false to true) before reading its rows. Unit checks pass, as reported by the builder. The ruling would become an approval once bind-adapter matches a group heading that carries a count and verify records a current pass for R-1.3 and R-1.38 against this tree.

**Conditions:**
- addressed-to bind-adapter: R-1.3: in both cases (public sector staff; administrator) opportunityList.openGroup() read '' at /opportunities, but the page shows 'Seeded published Code With Us opportunity' as a level-3 heading inside the region whose heading is 'Open Opportunities 3' (evidence R-1.3.txt and R-1.3-2.txt). The open group's heading name includes its count, and OPPORTUNITY_GROUPS in tests/adapters/new/index.ts (/^open(?: opportunities)?$/i and its siblings) is anchored so that it does not match 'Open Opportunities 3', so groupSection and the heading fallback both find nothing and opportunityGroup returns ''. Match a group heading or region whose name is followed by a count, e.g. /^open(?: opportunities)?(?:\s+\d+)?$/i, for all three groups.
- addressed-to bind-adapter: R-1.38: opportunityList.openGroup() read '' at /opportunities after publishing, but the page shows 'R-1.38 open opportunity whose deadline is sooner' (closes December 17, 2026) and then 'R-1.38 open opportunity whose deadline is later' (closes February 15, 2027) inside the region headed 'Open Opportunities 5' (evidence R-1.38.txt). This is the same cause as R-1.3: the OPPORTUNITY_GROUPS pattern for the open group does not allow the count that follows the heading's words, so the adapter never finds the open group's section.
- condition-met build-slice-8-12#2: app/frontend/src/screens/opportunity-list.tsx renders the Closed Opportunities Disclosure without defaultOpen, so it starts collapsed like Unpublished. docs/decisions/0071-the-closed-opportunities-group-starts-open.md is withdrawn. app/frontend/tests/finding-opportunities.test.tsx opens the closed group with openGroup (aria-expanded false to true) before reading its rows, and checks that the button hides and shows them again.
