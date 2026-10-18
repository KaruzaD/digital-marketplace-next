| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T09:16:06.644Z |
| holder | agent:reviewer |

# Does slice 10 (Staff can create Sprint With Us and Team With Us opportunities with an evaluation panel) do what its criteria say?

**Recommendation.** The application build-slice-10-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-10-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-1.55: evaluation-panel-swu.add_panel_member clicked "Add an evaluator" and timed out because the Evaluation panel section was still read-only: the page shows the members list and an "Edit evaluation panel" button (data-testid evaluation-panel-edit) that has to be pressed first, as start_editing already does. Once editing, the person is picked in one "Public sector employee to add" chooser (evaluation-panel-member-choice), with entries reading "Name (email)", and then "Add an evaluator" (evaluation-panel-add-member) seats them as a new evaluator row; member rows no longer have their own chooser. Seen in .sdlc/evidence/slice-10/R-1.55.txt and R-1.55-2.txt at /opportunities/sprint-with-us/<id>/edit?tab=evaluationPanel.
- to bind-adapter: R-5.1: same cause as R-1.55. add_panel_member was called on the read-only Evaluation panel section (members listed, "Edit evaluation panel" button shown) without pressing that button, then waited for "Add an evaluator" until it timed out. It must enter editing first, then add through the single "Public sector employee to add" chooser and "Add an evaluator". Seen in .sdlc/evidence/slice-10/R-5.1.txt and R-5.1-2.txt.
- to bind-adapter: R-5.17: in the published case, chair_field read "" and mark_member_as_chair reported no evaluator named "Emery Placeholder" ("nobody chosen, nobody chosen") although the read-only section lists "Casey Placeholder, Role: Evaluator" and "Emery Placeholder, Role: Evaluator and chair" above an "Edit evaluation panel" button. The adapter looked for per-row choosers and the Chair chooser without entering editing. Once editing, each seated member is a fieldset whose paragraph reads "Name (email)" beside a Chair checkbox (evaluation-panel-member-chair). In the draft case, add_panel_member timed out on "Add an evaluator" for the same reason as R-1.55. Seen in .sdlc/evidence/slice-10/R-5.17.txt and R-5.17-2.txt.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

_Ruled: return by tech-lead_
