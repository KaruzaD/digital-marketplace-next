| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T09:14:05.417Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** All three conditions are fixed in `tests/adapters/new/`.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

All three conditions are fixed in `tests/adapters/new/`. One check is missing: the TypeScript type-check needed an approval this session couldn't get, so it never ran. Instead I read the helpers' signatures and replayed the new steps by hand in the live browser.

**What I found on the target.** I signed in through the identity provider as the administrator and opened the Evaluation panel tab of the seeded closed Sprint With Us opportunity (`/opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluationPanel`). The section opens read-only: a "Members of the evaluation panel" list ("Casey Placeholder, Role: Evaluator" / "Robin Placeholder, Role: Evaluator and chair") above an "Edit evaluation panel" button (`evaluation-panel-edit`). The adapter had been written for a panel that opens ready to edit, so it went straight for controls that only appear after that button is pressed.

Once the button is pressed:
- Each seated member is a fieldset (`evaluation-panel-member-row`) holding a paragraph "Name (email)", a Chair checkbox (`evaluation-panel-member-chair`) and a Remove button. Members no longer have their own chooser.
- There is one "Public sector employee to add" chooser (`evaluation-panel-member-choice`). It lists people as "Name (email)". "Add an evaluator" (`evaluation-panel-add-member`) seats the chosen person as a new row and resets the chooser.
- Pressing "Add an evaluator" with nobody chosen does nothing. Adding someone already on the panel creates a second row; refusing it is left to the save.
- The "Chair (required)" chooser also shows "Name (email)".

I added, ticked a chair and pressed Cancel each time, so nothing was saved on the target.

**What I changed:**
- **Editing first (conditions 1, 2, 3).** One new step makes the panel editable: it presses "Edit evaluation panel" when the editing controls aren't shown yet. `start_editing` now just calls it, and so do `add_panel_member`, `mark_member_as_chair`, `choose_panel_chair` and `remove_panel_member`. Condition 3 names the Chair chooser, and `remove_panel_member` finds its member through the same code, so those two needed it as well. A locked panel is still recorded as a refusal, as before.
- **Adding (conditions 1, 2, 3).** `add_panel_member` now picks the person in "Public sector employee to add", presses "Add an evaluator", waits for the new row and ticks its Chair box if the input asks. It throws `unbound:` if no row appears. A person the chooser doesn't offer still throws `refused:`. The old one-chooser-per-member path is kept as a fallback in case a build draws that layout again.
- **Names with an email suffix.** Options and chooser values are now matched and returned by the name alone, without the "(email)". A seated member is found by the name in its paragraph, which is what fixes "nobody chosen, nobody chosen" in `mark_member_as_chair`.
- **`chair_field` (condition 3).** When the panel is shown read-only, it now reads the chair from the members list (the row whose role ends "chair"), as it already did on a locked panel, instead of returning "". While editing it reads the Chair chooser, name only. That matches the old binding, which returns names only.

**Not changed.** `save_evaluation_panel` and the error readers are as they were; the conditions don't name them and a save always follows an edit. The Team With Us panel uses the same code, so it gets the same fixes; I didn't open it again. In `bindings.yaml`, every member on both panel pages stays `bound`; I only updated the comment on `evaluation-panel-swu`, which still described the panel opening ready to edit. No other page or member was touched, and every route I used loaded.

None of the three conditions is deferred.

## Ruling

**Verdict:** approve
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does the new adapter bind every surface action and observation on new, and nothing else, now that it has answered the three open requests from build-slice-10-7? This reached tech-lead because bind-adapter was sent work more often than policy.loops.request allows. The pipeline is not at fault: each send in the account carried different faults that were fixed in their round (status reads, the top-level chair, the 'create' identifier, refusals on add, read-only rows), and only build-slice-10-7#1-#3 are still open. Those three exist because the new Evaluation panel opens read-only behind 'Edit evaluation panel'. The diff answers them where they are owed. A shared editing() step presses that button before start_editing, add_panel_member, remove_panel_member, choose_panel_chair and mark_member_as_chair, and a locked panel is still recorded as a refusal. add_panel_member adds through the single 'Public sector employee to add' chooser and 'Add an evaluator', waits for the new row, and throws refused: when the person is not offered. Names shown as 'Name (email)' are compared by name alone, which fixes 'nobody chosen, nobody chosen' in mark_member_as_chair. chair_field reads the chair from the read-only member list when no Chair chooser is drawn. The change stays inside the evaluation-panel binding and one bindings.yaml comment, every binding stays bound, and the runner's tsc on af73ecd5aa passed with no diagnostics under adapters/new/, which covers the check the authoring session could not run. Approved. If the next verify of R-1.55, R-5.1 or R-5.17 still fails on these panel steps, it returns to bind-adapter, or goes to build if the panel's markup turns out to be unstable.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `af73ecd5aa60d8f1111f95cd3029868afd06a051`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
