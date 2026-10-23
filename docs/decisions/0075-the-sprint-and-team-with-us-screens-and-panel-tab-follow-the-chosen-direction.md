# 0075 · The Sprint With Us and Team With Us screens and the panel tab follow the chosen direction

- Status: accepted for the build (slice 10, restyle)
- Date: 2026-10-18

## Context

The design catalogue approved at G-DESIGN redraws slice 10's screens: the two create forms
(`opportunity-swu-create.*`, `opportunity-twu-create.*`), their manage pages (`opportunity-swu-edit.*`,
`opportunity-twu-edit.*`), their public views (`opportunity-swu-view.*`, `opportunity-twu-view.*`, drawn
by `opportunity-view-page.tsx`) and the Evaluation panel tab (`evaluation-panel-swu.*`,
`evaluation-panel-twu.*`, drawn by `evaluation-pages.tsx`'s `PanelTab` on `evaluation-kit.tsx`).
DESIGN.md's "Opportunity screens in the chosen direction" and "Evaluation screens in the chosen
direction" say how. Decision record 0071 brought the opportunity kit into the app and placed its
style sheet in the root layout; this restyle builds on it.

## Decision

- **Every slice-10 screen is the opportunity kit's frame,** as the Code With Us screens are (0071):
  `OpportunityPage`, `OpportunityHead`, `Details`, `ActionBar`, `ManageTabs`, `Region`, `Panel`,
  `Fieldset`, `Actions` and `Waiting`. The kit gained two small things the Sprint and Team pages need:
  a tab may name its own test ID (`?tab=evaluationPanel` is `opportunity-tab-evaluation-panel`), and a
  fieldset may carry an `id` and an `aria-describedby` (the phases' shared error, the panel rows the
  summary links to).
- **The evaluation kit is added once,** at `frontend/src/app/evaluation-kit.tsx`: its style sheet,
  `Rows`, `ErrorSummary`, `Notice`, `Focused` and `GroupError`. Only the panel tab uses it so far; the
  other evaluation tabs keep their look until their own restyle, and can take it from there. Its
  style sheet is placed by the screen that draws the kit (`EvaluationStyles`), and every rule in it is
  scoped to its own classes.
- **The panel tab opens read-only** (the surface's `start_editing`): the two introductory sentences,
  the members as rows (Name, Role) and Edit evaluation panel (`evaluation-panel-edit`) while the panel
  may change (R-1.43, R-5.16). Editing shows one bordered row per evaluator — name, email address,
  Chair, Remove — then "Public sector employee to add" (`evaluation-panel-member-choice`, every option
  "Name (email)") and Add an evaluator, the Chair field, Save evaluation panel and Cancel
  (`evaluation-panel-cancel`). A person added is an evaluator and not the chair. Everyone is offered in
  the add choice, so a duplicate is still refused on save, on its row, as before (gap 68). The checks
  and the service's refusals are placed exactly as decision record 0045 describes. From the consensus
  stage the tab shows the notice and the rows, with no Edit.
- **A saved panel returns the tab to read-only** and says "Opportunity Changes Published. The
  evaluation panel has been saved." in a status region. The surface's note gives the first sentence as
  what the screen confirms; no criterion says whether the tab stays open (gap 67), and returning to
  the panel as it now stands is what Cancel does too.
- **Panel candidates carry their email address.** The surface says each person the tab offers is
  shown as "Name (email)", and a test names the person by email address. The session's
  `panelCandidates` (given only to an active public sector employee or administrator) now carries
  `email` beside `name`. It lists only active public sector employees and administrators, and nobody's
  standing, so the full list of registered accounts stays an administrator's (R-4.21). The create
  form's panel keeps the name alone, as its story does.
- **The manage page** is the head ("Manage a … opportunity", program, the stage as the program names
  it, title), the identifier as a detail, the always-present action bar (`opportunity-actions`, the
  Team With Us page's `offered_state_changes`), the tabs, any refusal from the bar, then the tab's
  region. The History region carries `opportunity-history-section` and holds nothing to add a note
  with (R-1.33). The Summary tab's facts are the story's: deadline, budget, published, created by and
  last changed by. As on the Code With Us page (0032, 0071), what an action came to is said at the top
  of the tab's region, and the bar keeps its actions on the Opportunity tab.
- **The view** follows the story's order. Its status follows the list for vendors and visitors ("Open",
  "Evaluation") and is the stage for staff (`listStatusWords`). Key dates are a details list, so
  `opportunity-start-date` and the like hold the date alone. The Sprint With Us view always carries
  `opportunity-page-messages`; it raises the catalogue's two notices (a visitor while proposals are
  accepted; an awarded opportunity) and nothing else, since the other two cases have no wording
  (gap 30). The embedded scope and terms pages keep decision record 0045's shape: the wrapper with the
  test ID is always there, and the section inside it appears only once the page has been read. The
  terms section is titled "Terms and Conditions", as the story has it.

## Consequences

A test that pressed `evaluation-panel-add-member` to get an empty row with a person `Select` in it now
chooses the person in `evaluation-panel-member-choice` first; one that opened the panel tab and found
the form at once presses `evaluation-panel-edit` first. A panel row read as text now carries the
visually hidden column name ("Role: Evaluator"). A test reading "Start date: …" in
`opportunity-start-date` on the Team With Us view now reads the date alone. A vendor or visitor reads
"Open" rather than "Published" in `opportunity-status` on either view.
