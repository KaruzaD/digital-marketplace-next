---
gate: G-DESIGN
question: "Do these screens serve the evaluation criteria, and are they built out of the design system?"
recommendation: "I restyled every evaluation screen in the chosen direction and filled the six test IDs the contract had left empty in this domain."
opened: 2026-10-17T23:32:19.103Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do these screens serve the evaluation criteria, and are they built out of the design system?

**Recommendation.** I restyled every evaluation screen in the chosen direction and filled the six test IDs the contract had left empty in this domain.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled every evaluation screen in the chosen direction and filled the six test IDs the contract had left empty in this domain. I had no shell to compile or scan with. The pipeline's typecheck and accessibility scan, run after this turn, are the first real check, so read `design/report.json` before ruling.

**How the stories are built now.** The Sprint With Us and Team With Us copies of each page used to be separate files that differed only in their words. Each page is now drawn once:
- `design/catalogue/evaluation-pages.tsx` has one component per page, taking the state to draw.
- `design/catalogue/evaluation-kit.tsx` holds the program data (question words, address segment, how many proponents go forward, the next stage, the tabs) and the earlier stories' record text, moved unchanged.
- Each of the 113 story files is now a few lines: its comment, its title and one render of a page with a program and a state.

Every story sits inside `SitePage` with the person the state is seen by. The table in the new DESIGN.md section lists who that is for each page and state.

**What I reused and what is new.** The catalogue leans on the opportunities domain's kit throughout: the page frame, the opportunity head, the details list, the action bar, regions, panels, the tables, the loading spinner and the missing page. It also uses `marketplace.tsx`'s `Label` and the design system's `InlineAlert`, `Select`, `Checkbox`, `NumberField`, `TextArea`, `Form`, `ButtonGroup`, `Modal` and `AlertDialog`. `statusOf` had no use, because no screen here shows the public's view of an opportunity's status.

The project's own components, all listed in DESIGN.md as not the design system's, are:
- **Manage frame**: the manage page around one of this domain's tabs.
- **Scoring head**: the top of a scoring form, with the proponent's anonymous name as the heading.
- **Evaluation status**: a status label for evaluations and consensuses (grey for Not started, blue for a draft, green for Submitted). Whether a draft is complete is in its words, not its colour.
- **Rows**: the proponent lists, the panel's members and each question's evaluators' scores. They sit in columns where the list is wide and become stacked cards on a phone. This replaces the tables that scrolled sideways and settles the proposals section's gap 40 for this domain.
- Smaller pieces: a question box, a response block, the panel's member row, a pick-and-add control, the alerts and the response reference.

The dashboard's Evaluations list is the exception to rows: it shares a page with the opportunity dashboard's table, so I kept it a table too, so the one page doesn't show two kinds of list (gap 72).

**States.** Every earlier state is kept, with its words. The contract asked for three changes, which I made:
- **The panel tab opens read-only.** `default` now shows the panel and an "Edit evaluation panel" button. A new `editing` state holds the form that `default` used to show.
- **Adding a panel member.** You now choose a person, listed as "Name (email)", and press Add an evaluator. Each row shows the person it holds instead of its own dropdown.
- **A new page, `evaluation-individual-submission-request-swu`.** It is the response reference for an evaluator submitting scores while naming fewer than every proponent, with `default` and `refused` states.

Both changes are recorded in `design/screens.yaml`.

**Test IDs filled:**

| Entry | Test ID |
| --- | --- |
| `start_editing` on both panel pages | `evaluation-panel-edit` |
| `submit_scores_for_consensus_naming` | `evaluation-submission-request-submit` |
| `request_accepted` | `evaluation-submission-request-accepted` |
| `refusal_messages` | `evaluation-submission-request-refusal-messages` |
| `stored_status` | `evaluation-submission-request-status` |

Every test ID already filled stays on an element that does what the surface says. Two extra IDs the surface doesn't name are new: `evaluation-panel-member-choice` (the person to add) and `evaluation-panel-cancel` (Cancel while editing). The old per-row `evaluation-panel-member-field` is gone, along with the per-row dropdown it was on.

**Other visible changes:**
- Error summaries now show their titles. The earlier stories gave the alert both a title and content, so the design system never displayed the title.
- Stories that used to say "trimmed here" now draw the manage frame and the full form.

**Gaps found (67 to 73 in DESIGN.md):**
- No confirmation state after the panel is saved. The surface quotes "Opportunity Changes Published", but no criterion gives it.
- With pick-and-add, the form could stop offering people already on the panel, but the surface still observes a duplicate error. I kept offering everyone and refusing the duplicate on save.
- R-5.25 says submission is "not offered" until every evaluation is complete; the surface observes a disabled button. The two may disagree.
- Whether the seeded submission actually moves the opportunity to consensus depends on the seed, so that story's outcome is illustrative.
- There is no Team With Us page for the submission request.
- The dashboard's tables (above).
- Nothing says whether an administrator, as well as the owner, is offered the panel's Edit; the stories show the owner.

I changed nothing under `spec` except `spec/contract/surface.yaml`, and nothing under `constitution.md` or `.claude/skills`.
