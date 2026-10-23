| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T08:53:33.057Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 10 (Staff can create Sprint With Us and Team With Us opportunities with an evaluation panel) do what its criteria say?

**Recommendation.** I made the one fix the ruling gave this stage, for R-1.9.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I made the one fix the ruling gave this stage, for R-1.9. The full `npm --prefix app run check` passes: typecheck, plus 16 migrations, 862 backend and 592 frontend unit tests. Nothing has been run against the real application or the acceptance suite yet.

**What was wrong.** The server was already saving the dates correctly. When a Sprint With Us or Team With Us draft is saved with dates missing or invalid, it gets a proposal deadline, assignment date and (for Team With Us) start date fourteen days from the day of saving, and no completion date. Those values come back to the page, and the date fields on the Opportunity tab are filled from them. The problem was the draft's manage page, which opens on the Summary tab. That tab listed the proposal deadline but not the assignment date. The test found no date field on the Summary tab, fell back to the Summary list, and read nothing.

**What I changed.** The Summary tab for Sprint With Us and Team With Us now shows "Assignment date" right after the proposal deadline, as a written date such as "November 1, 2026". Team With Us also shows "Start date". The change is in `summaryDetails` in `app/frontend/src/screens/opportunity-other-manage.tsx`.
- **Sprint With Us start date:** not listed, because in that program the start date belongs to each phase.
- **Completion date:** left out on purpose. A completion date the draft never had would otherwise show as "Not entered", which could be read as a value when the criterion says it must stay empty.
- **Catalogue mismatch:** the catalogue's draft pages for both programs don't show these extra Summary lines. This is a small addition beyond the catalogue's drawing, made so the dates the draft was given are visible where the ruling says they should be.

**How I tested it.** One new test, run once for each program, in `app/frontend/tests/other-program-drafts.test.tsx`. It opens a draft's manage page on the Summary tab and checks:
- the order of the listed items;
- that the assignment date reads "November 1, 2026";
- that no completion date is listed.

**Left for another stage.** The other five failures (R-1.43, R-1.55, R-5.1, R-5.17, R-5.18) went to the bind-adapter stage. The page already draws the panel's member rows; the adapter doesn't read them. I didn't touch the panel markup.

Code With Us has the same Summary tab, also without an assignment date. It wasn't in this ruling, so I left it alone. If its R-1.9 test reads the dates the same way, it may hit the same problem.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 10 do what its criteria say? Return. The build's one owed fix is done: the Summary tab of a Sprint With Us / Team With Us draft now lists the assignment date (and Team With Us start date) in summaryDetails, and R-1.9 passes on tree 407d7d3, so build-slice-10-6#1 is met. All three remaining failures (R-1.55, R-5.1, R-5.17) are the adapter's: every captured outline shows the Evaluation panel section read-only, with the members listed and an "Edit evaluation panel" button. The adapter's addPanelMember and markMemberAsChair never press that button (only startEditing does), and they look for a person chooser on each member row, where the tab now has a single "Public sector employee to add" chooser and seated members show as a name with a Chair box. Nothing in the evidence points at the application, so nothing is returned to build. Exposing candidate email addresses to active staff follows decision record 0075 and the panel tab that shows them; R-4.21 and R-5.18 still hold, and R-5.18 passes. This would become an approval on a current verify result with no failures once bind-adapter re-binds these members; if the re-bound adapter, after pressing Edit evaluation panel, still cannot add a member or mark a chair, those failures become the application's.

**Conditions:**
- condition-met build-slice-10-6#1: summaryDetails in app/frontend/src/screens/opportunity-other-manage.tsx lists Assignment date after the proposal deadline (and Start date for Team With Us) on the draft's Summary tab, covered by the new case in app/frontend/tests/other-program-drafts.test.tsx; R-1.9 passes in the verify result for tree 407d7d3.
- addressed-to bind-adapter: R-1.55: evaluation-panel-swu.add_panel_member clicked "Add an evaluator" and timed out because the Evaluation panel section was still read-only: the page shows the members list and an "Edit evaluation panel" button (data-testid evaluation-panel-edit) that has to be pressed first, as start_editing already does. Once editing, the person is picked in one "Public sector employee to add" chooser (evaluation-panel-member-choice), with entries reading "Name (email)", and then "Add an evaluator" (evaluation-panel-add-member) seats them as a new evaluator row; member rows no longer have their own chooser. Seen in .sdlc/evidence/slice-10/R-1.55.txt and R-1.55-2.txt at /opportunities/sprint-with-us/<id>/edit?tab=evaluationPanel.
- addressed-to bind-adapter: R-5.1: same cause as R-1.55. add_panel_member was called on the read-only Evaluation panel section (members listed, "Edit evaluation panel" button shown) without pressing that button, then waited for "Add an evaluator" until it timed out. It must enter editing first, then add through the single "Public sector employee to add" chooser and "Add an evaluator". Seen in .sdlc/evidence/slice-10/R-5.1.txt and R-5.1-2.txt.
- addressed-to bind-adapter: R-5.17: in the published case, chair_field read "" and mark_member_as_chair reported no evaluator named "Emery Placeholder" ("nobody chosen, nobody chosen") although the read-only section lists "Casey Placeholder, Role: Evaluator" and "Emery Placeholder, Role: Evaluator and chair" above an "Edit evaluation panel" button. The adapter looked for per-row choosers and the Chair chooser without entering editing. Once editing, each seated member is a fieldset whose paragraph reads "Name (email)" beside a Chair checkbox (evaluation-panel-member-chair). In the draft case, add_panel_member timed out on "Add an evaluator" for the same reason as R-1.55. Seen in .sdlc/evidence/slice-10/R-5.17.txt and R-5.17-2.txt.
