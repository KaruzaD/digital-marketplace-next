---
stage: "bind-adapter"
title: "bind adapter"
at: "2026-10-18T08:47:54.673Z"
cost: 0.7982768
turns: 31
session: "0fbe9c3a-1a71-43d6-badc-d9d1e42b161d"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

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