| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T08:47:54.721Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed `panelMemberRow()` on the Sprint With Us evaluation panel so it reads the read-only member list the page now shows.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed `panelMemberRow()` on the Sprint With Us evaluation panel so it reads the read-only member list the page now shows. I couldn't run the type-check: running `tsc` in the workspace needed an approval I didn't get. I checked the new parsing in the browser instead. The fix is not type-checked and has not been run through the suite.

**What was wrong.** The adapter's member-rows reader only handled two shapes:
- **Locked panel:** it read table cells. On this build the members are list items with no cells, so every row came back empty (request 1).
- **Unlocked panel:** it read each name from a member chooser. The panel now opens read-only, with no choosers, so every row was skipped and the reader timed out (requests 2–5).

**What changed.** All edits are in `rows()` and one new helper inside the evaluation panel binding in `tests/adapters/new/index.ts`. Each row is still found by its test ID `evaluation-panel-member-row`, and each still reads as "name — role", the form calibration accepted.
- **New helper.** It reads a row of cells as before. A row without cells is read from its own text: the name first, then the role after the visually hidden "Role:" label.
- **Locked panel.** It now uses that helper, so the a011 consensus-stage panel reads "Casey Placeholder — Evaluator" and "Robin Placeholder — Evaluator and chair".
- **Unlocked panel, before "Edit evaluation panel" is pressed.** Rows without a chooser are read the same way, so the a023 panel gives "Robin Placeholder — Evaluator and chair" and "Devon Placeholder — Evaluator". Requests 3–5 show the same read-only list, so they are answered by the same change.

**Something I found while checking.** After pressing "Edit evaluation panel" (`evaluation-panel-edit`), members already on the panel still have no chooser. Each shows its name with the email in brackets, plus a Chair checkbox and a Remove button. Only a slot added with "Add an evaluator" gets a chooser. So, in edit mode:
- a row with a chooser is read from the chooser, as before;
- a row with a name and Chair box is read as the name (email removed), with the role taken from the Chair box.

I also stopped the reader from asking the chair chooser for its choice when there is none on the page. Before, that wait ran until the timeout.

**Not changed, but the same problem applies.** `memberGroup` (used by remove and mark-as-chair) and `addPanelMember` still look for each member's name in a chooser. On this build, members already on the panel have none, so those actions may fail or wait out the timeout when such members are present. `chairField()` on an unlocked panel still reads the chair chooser, which the read-only view doesn't show. None of the five requests named these, so I left them for a later round.

`bindings.yaml` is unchanged: `panel_member_row` was already listed as bound on both evaluation panel pages. No route failed to resolve, and nothing outside `tests/adapters/new/` was touched.

All five requests were taken up; none deferred.

## Ruling

**Verdict:** approve
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether bind-adapter-new-103 binds the evaluation panel's member rows as the new build draws them, and nothing beyond that. bind-adapter escalated it to me because the build-slice-10 requests went past policy.loops.request (4 sends against a limit of 2). That is a policy cap on rounds, not a stage unable to produce what the gate asks, so I am ruling rather than escalating. The last five requests (build-slice-10-6#1-#5, items 18-22 of the account) say the same thing: panel members now appear as read-only list items with no cells or choosers, so rows() read '' or timed out. The diff does exactly that and no more: a shownRow() helper reads a cell row as before or a list item from its own text (name, then the role after the visually hidden 'Role:'); the unlocked branch uses the chooser only on rows that have one, and reads existing members in edit mode from name plus Chair box; and chairChooser() is only queried when present, which removes a timeout. Rows are still found by data-testid evaluation-panel-member-row and still read as 'name — role'. bindings.yaml is unchanged and nothing outside tests/adapters/new/ moved. The runner's type-check on af966c4 passed with no diagnostics in adapters/new/. The author names memberGroup, addPanelMember and chairField() as likely to hit the same chooser problem but leaves them alone because no request named them. That is right for evidence-scoped work: a failing verify run will raise its own request. What would change this ruling: a verify run on this revision where panelMemberRow() still reads '' on the read-only or locked list, which would mean the row-text parsing does not match the real markup. build-slice-10-6#1 (R-1.9 assignment date, owed by build) is not settled here and stays open.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `af966c496bf4eb4e10e714b8137d357be95b3a1f`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
