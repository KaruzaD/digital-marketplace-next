---
gate: G-DESIGN
question: "Do these screens serve the proposals criteria, and are they built out of the design system?"
recommendation: "I redrew all of the proposals domain's screens in the chosen direction: about 115 stories on 19 of the 20 pages."
opened: 2026-10-17T21:43:18.502Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do these screens serve the proposals criteria, and are they built out of the design system?

**Recommendation.** I redrew all of the proposals domain's screens in the chosen direction: about 115 stories on 19 of the 20 pages.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I redrew all of the proposals domain's screens in the chosen direction: about 115 stories on 19 of the 20 pages. The Code With Us proposal form was the reference and stays as it was, except for one added test ID. Nothing has been compiled or scanned yet: there is no compiler or `node_modules` in this workspace. A separate agent read all 115 restyled stories against the kits' prop types and the design system's existing uses and found no errors. The pipeline's compile and accessibility scan will be the first real check.

**What I built.** I added `design/catalogue/proposal-kit.tsx`, the project's own components on top of the opportunity kit and `marketplace.tsx`:
- **Proposal page and head:** the small page-kind line, the program as a grey label, the proposal's status as a coloured label, then the H1.
- **Status colours:** Draft is blue, matching the Code With Us form; Submitted and Awarded are green; review stages are yellow; Not awarded and Withdrawn are grey; Disqualified is red.
- **Action bar and tabs:** the action bar keeps `proposal-actions`; the tabs are marked the same way as the header's navigation.
- **Shared form layout:** the Code With Us form's layout, reused, with numbered parts and a 320-pixel opportunity summary beside the form that holds the actions. On a phone it becomes a compact card and the actions follow the form.
- **Small helpers:** team-member rows, group errors, messages that take focus, and catalogue notes.

Every story renders inside `SitePage` with a viewer and a section:
- **Vendor:** create pages (Opportunities); manage pages, the dashboard and export-one (Dashboard).
- **The opportunity's author or an administrator:** evaluate pages and export-all (Dashboard).
- **No section:** not-found pages, `/proposals` and the three request addresses.

The stories lean mostly on the design system's `Button`, `ButtonGroup`, `Link`, `InlineAlert`, `Modal` with `AlertDialog` and `Dialog`, `Select`, `TextField`, `TextArea`, `NumberField`, `RadioGroup`, `Checkbox` and `Form`. Labels, details lists, regions, panels, fieldsets and tables come from the opportunity kit, as on the opportunity screens. No `Stack`, inline style or colour value is left in any proposal story.

**States.** Every page keeps exactly the states it had, so `design/screens.yaml` is unchanged.

**Test IDs.** I filled every `null` on this domain's pages in `spec/contract/surface.yaml`, each with an identifier a story actually renders:
- `field_errors_by_field` → `proposal-field-errors` (the one attribute added to the Code With Us form)
- `team_member_choices` → `proposal-team-member-choice`
- `phase_team_sections` → `proposal-phase-team`
- `phase_requirements` → `proposal-phase-requirements`
- `cost_errors` → `proposal-cost`
- On the Sprint With Us and Team With Us manage pages: the organization, add-member, scrum master and hourly-rate controls reuse the create page's IDs. `submission_refusal` is `proposal-submit-refused-message`, `field_error` is `field-error`, and `organization` is `proposal-organization`.
- On the Sprint With Us and Team With Us evaluate pages: `history_entries` → `proposal-history-table`, `rank` → `proposal-rank`, `offered_score_actions` → `proposal-score-actions`

Every test ID that was already filled is kept, on an element that does the same thing.

**Words changed, against the request to keep them.** Each change was forced by an accepted criterion or by the contract:
- **Scrum master:** R-2.19 v3 makes it a single choice per phase, so the per-member checkboxes became one radio group per phase. The invalid story's "two scrum masters" problem became "choose a scrum master".
- **Phase requirements:** each Sprint With Us phase now says whether its team meets its requirements.
- **Cost messages:** the over-budget messages now use the contract's wording.
- **Disabled submit:** in the Sprint With Us invalid story, Submit is disabled while problems stand, as the contract says.
- **Scoring at the right stage:** R-2.28 v2 says a stage's score is offered only once the opportunity reaches that stage. The wrong-stage stories therefore lost their score button, and the tab now says the proposal can be scored once that stage is reached.
- **Rank:** reads "1st", as the contract states, instead of "1 of 3".
- **Removed and added labels:** "Status:" labels are gone, because status now sits in the head. "Legal name" and "Not yet ranked" were added.

All of this is recorded in DESIGN.md under "Proposal screens in the chosen direction", which I appended. It also closes the older section's gaps 4 and L4.

**Gaps for the spec** (35–40 in DESIGN.md):
- **35:** with no score button at the wrong stage, the screen cannot itself trigger the wrong-stage refusal, yet the contract keeps that observation on both evaluate pages.
- **36:** the cost messages and the pending marking come only from the contract's notes; no criterion owns them.
- **37:** the wording a phase uses to say it is complete or incomplete is the design's own.
- **38:** so is the message when no scrum master is chosen.
- **39:** the Sprint With Us and Team With Us summaries lack location and Remote OK, because the test data has none.
- **40:** tables still scroll sideways on phones rather than becoming stacked cards. That is the opportunity screens' choice too, and changing it would be a new component for both domains.
- **Not numbered:** who may award is still unstated. The evaluated and History stories show Award to the opportunity's author, because their comments say so.

I changed nothing outside `design/` and `spec/contract/surface.yaml`.

## Fix turn

I fixed the `landmark-unique` failure on both states of proposal-cwu-export-all (`default` and `anonymous`). Inside each exported proposal, the stories used the opportunities kit's `Region`, which renders a `<section>` named by its heading. With two proposals on the page, that gave two section landmarks with the same name, "Proposal", which is what the scan flagged. In `design/catalogue/proposal-cwu-export-all.default.stories.tsx` and `design/catalogue/proposal-cwu-export-all.anonymous.stories.tsx` I swapped that `Region` for a plain `div` with the same `op-region` class, holding the kit's own `SectionTitle` (still a level-3 "Proposal" heading with the same id). The block should look the same, and the per-proposal "Proposal" heading is no longer a duplicate landmark: each proposal's named `<article>` is the only landmark it adds. The words, the `test_id`s, the shared `opportunity-kit.tsx` and every other story are unchanged. The fix will be confirmed only when the pipeline's scan writes the next `design/report.json`. The Sprint With Us and Team With Us export-all stories were not in the failure list, so I left them as they are.
