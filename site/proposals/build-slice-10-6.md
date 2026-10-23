| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T08:30:40.562Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 10 (Staff can create Sprint With Us and Team With Us opportunities with an evaluation panel) do what its criteria say?

**Recommendation.** I restyled slice 10's screens to the approved catalogue.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 10's screens to the approved catalogue. All its test IDs are kept. `npm --prefix app run check` passes: the backend's 862 tests, the frontend's 590 and the migrations' 16.

**What was restyled**
- **Sprint With Us and Team With Us create forms:** each part of the form is now a panel, and each phase, resource, question and panel member is a numbered group. The words, rules and test IDs are the same as before.
- **Manage pages:** the heading block, the opportunity ID, an action bar that is always there (`opportunity-actions`), the tabs, then the tab's section. Two things are new here:
  - The History tab now carries `opportunity-history-section`. These pages were missing it, and the contract reads it to check that no screen offers a way to add a note.
  - The Summary tab shows the story's facts only: deadline, budget, published date, created by and last changed by.
- **Public views:** they follow the story's order. The Sprint With Us view always has its `opportunity-page-messages` area. It shows only the catalogue's two notices: one to a visitor while proposals are open, and one once the opportunity is awarded.
- **Embedded pages:** the scope and terms pages behave as before. Each is drawn by the same renderer as its own address, markup in it is shown but never run (R-7.17), and an unreadable page leaves its section empty with no message (R-7.29).
- **Shared components:** I reused slice 1's shell and the opportunity kit. I gave the kit two small options it lacked: a tab can name its own test ID (`?tab=evaluationPanel` is `opportunity-tab-evaluation-panel`), and a fieldset can carry an id. The evaluation kit's pieces (rows, error summary, notice, group error and their styles) now live once in `app/frontend/src/app/evaluation-kit.tsx`.

**The evaluation panel tab changed how it works, not just how it looks**, because the contract now says so:
- It opens read-only: the members and their roles, plus "Edit evaluation panel" (`evaluation-panel-edit`) while the panel can still change.
- In edit mode, each evaluator is a row showing name and email, with Chair and Remove. A person is chosen in "Public sector employee to add" (`evaluation-panel-member-choice`, each option "Name (email)") and added with "Add an evaluator". They join as an evaluator, not the chair.
- A Cancel button (`evaluation-panel-cancel`) returns to the read-only panel.
- The membership, chair and timing rules and the service's refusals are placed on the form as before.
- After a successful save the tab goes back to read-only and says "Opportunity Changes Published. The evaluation panel has been saved." The first sentence is the confirmation the contract's note quotes. No criterion says whether the tab stays open after saving, so going back to read-only is my choice.

**One change reached the backend.** The panel needs email addresses, so the list of possible panel members on a staff member's session now includes `email` next to `name`. Only active public sector employees and administrators get this list, and it lists only them, so the full list of registered accounts stays an administrator's (R-4.21). The create form's panel still shows names only, as its story does.

**Tests.** I updated the unit tests to match:
- the panel opens read-only;
- editing shows name and email;
- adding through the choice sends the new evaluator as not the chair;
- Cancel sends nothing;
- saving returns to read-only;
- a service refusal shows on the person's row;
- the locked panel offers no Edit;
- both panel modes pass accessibility checks;
- the new rules for the Sprint With Us notices and the people the tab can name;
- the manage page's heading, status, tab addresses, action bar and History section.

**Changes a test may notice**, recorded in `docs/decisions/0075-…`:
- A panel row read as text now includes a hidden column name ("Role: Evaluator").
- On the Team With Us view, `opportunity-start-date` and `opportunity-completion-date` hold the date alone, without the "Start date:" label.
- On both views, a vendor or visitor sees "Open" rather than "Published" as the status.

**Not built, and why:**
- The design has wording for only two of the four Sprint With Us notices. The other two (a vendor who has already proposed, a vendor whose organizations don't qualify) have no wording anywhere, so they show nothing.
- The contract names Team questions and Resource questions tabs on the manage pages, but this slice's criteria don't cover them. The next slice that owns those tabs will find them missing.
- The other evaluation tabs (instructions, evaluation, consensus) and the full report are other slices' screens. They keep their current look, and their restyle can reuse the evaluation kit.

I changed nothing outside `app/` and `docs/decisions/`.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 10 do what its criteria say? Return. Verify recorded a current fail (tree bcefba7), so approval is not open. Five of the six failures (R-1.43, R-1.55, R-5.1, R-5.17, R-5.18) are the adapter's: each stops on evaluationPanelSwu.panelMemberRow() reading an empty string, while every saved page outline shows the panel's member rows drawn as list items (for example R-5.18: 'Robin Placeholder Role : Evaluator and chair', 'Devon Placeholder Role : Evaluator', then 'Edit evaluation panel'). The adapter's rows() reads names from each row's chooser control when the panel can still change, and only table cells (rowsText) when it is locked; the read-only panel this build draws has neither, so every row is skipped. These go to bind-adapter. R-1.9 is the application's: on the manage page the adapter read the proposal deadline from the form field ('2026-11-01'), but the assignment date field gave no date, so it fell back to the Summary tab, which now lists no assignment date and read empty. The rest of the diff is sound: the read-only panel with an Edit button, the action bar, the History section, and email on the panel candidate list, which goes only to active staff and lists only staff, consistent with R-4.21. The ruling changes once R-1.9 is fixed, the panel rows are rebound, and verify passes on a current tree.

**Conditions:**
- R-1.9, in the cases "Sprint With Us: a draft whose dates are missing is accepted, its proposal deadline, assignment date and start date are set to fourteen days from the day of saving, and its completion date is left emp…", "Sprint With Us: a draft whose dates are invalid is accepted, its proposal deadline, assignment date and start date are set to fourteen days from the day of saving, and its completion date is left emp…", "Team With Us: a draft whose dates are missing is accepted, its proposal deadline, assignment date and start date are set to fourteen days from the day of saving, and its completion date is left empty" and "Team With Us: a draft whose dates are invalid is accepted, its proposal deadline, assignment date and start date are set to fourteen days from the day of saving, and its completion date is left empty": Error: assignment date should be set — Received: "" — at tests/acceptance/opportunities/R-1.9.spec.ts:52 — on the draft's manage page the opportunity-assignment-date-field held no date while the proposal deadline field held 2026-11-01, and the Summary tab no longer lists an assignment date; a draft saved with missing or invalid dates must hold, and show, an assignment date and start date fourteen days from the day of saving.
- addressed-to bind-adapter: R-1.43: evaluationPanelSwu.panelMemberRow() read "" on /opportunities/sprint-with-us/00000000-0000-4000-a011-000000000001/edit?tab=evaluationPanel at the consensus stage. The page shows the lock note and, in the 'Evaluation panel' region, a list 'Members of the evaluation panel' whose items (data-testid evaluation-panel-member-row) read 'Casey Placeholder Role : Evaluator' and 'Robin Placeholder Role : Evaluator and chair'. rows() passes these list items to rowsText(), which reads only role=cell children, and list items have none; read each row's own text (name, then the role after the visually hidden 'Role:').
- addressed-to bind-adapter: R-5.18: evaluationPanelSwu.panelMemberRow() never read non-empty on /opportunities/sprint-with-us/00000000-0000-4000-a023-000000000001/edit?tab=evaluationPanel as the administrator. The panel now opens read-only: the list 'Members of the evaluation panel' shows 'Robin Placeholder Role : Evaluator and chair' and 'Devon Placeholder Role : Evaluator', followed by the 'Edit evaluation panel' button (evaluation-panel-edit). For a panel without a lock note, rows() reads each name from a chooser inside the row, which a read-only row lacks, so every row is skipped. Read the read-only rows' text, and use the chooser only once editing has started.
- addressed-to bind-adapter: R-1.55: after a fresh draft is saved, evaluationPanelSwu.open then panelMemberRow() times out reading "" (tests/acceptance/opportunities/R-1.55.spec.ts:131), while the page shows the read-only list item 'Robin Placeholder Role : Evaluator and chair' and 'Edit evaluation panel'. Same cause as R-5.18: rows() needs a member chooser, and the read-only panel has none.
- addressed-to bind-adapter: R-5.1: evaluationPanelSwu.panelMemberRow() times out reading "" (tests/acceptance/evaluation/R-5.1.spec.ts:94) on a fresh Sprint With Us draft's panel tab, which shows the read-only item 'Casey Placeholder Role : Evaluator and chair' and 'Edit evaluation panel'. Same cause as R-5.18: rows() reads names only from choosers.
- addressed-to bind-adapter: R-5.17: evaluationPanelSwu.panelMemberRow() times out reading "" (tests/acceptance/evaluation/R-5.17.spec.ts:91) on a published opportunity's panel tab, which shows the read-only items 'Casey Placeholder Role : Evaluator' and 'Emery Placeholder Role : Evaluator and chair' and 'Edit evaluation panel'. Same cause as R-5.18: rows() reads names only from choosers.
