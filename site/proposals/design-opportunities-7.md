| Field | Value |
| --- | --- |
| gate | G-DESIGN |
| opened | 2026-10-17T21:17:19.795Z |
| holder | agent:ux-reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Do these screens serve the opportunities criteria, and are they built out of the design system?

**Recommendation.** Nothing was left to do when this check came back.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Nothing was left to do when this check came back.

- **Helper stories:** all four helpers finished, and I reviewed their stories and fixed what I found. The report pages' proposal headings now sit at H3 under "Proposals", and the Sprint With Us editing form's parts are bordered panels again.
- **Contract test IDs:** every `test_id: null` on this domain's pages in `spec/contract/surface.yaml` is filled. The first remaining `null` is at line 479, on the proposal pages, which belong to another domain.
- **`DESIGN.md`:** the new section "Opportunity screens in the chosen direction" is added at the end of the file, with gaps 29 to 34.

The journal entry in my previous message stands as the final report for this stage.

## Ruling

**Verdict:** approve
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: do the opportunities screens serve their criteria and come from the design system? Approved. design/report.json is ok with zero axe violations across the catalogue, and typecheck and build pass. Every surface.yaml change on this domain fills a test_id that was null; none already filled was altered. The new opportunity-kit.tsx composes design-system components (Heading, ButtonGroup, Link, ProgressCircle, form fields) styled only with layout, surface and typography tokens. Its only literals are a 200px minimum detail-column width and the phone breakpoint, neither a colour or spacing value, and DESIGN.md names the kit as the project's own compositions rather than design-system components. In the screenshots (cwu-view default, swu-view awarded, dashboard default, program-select default, twu-edit default, swu-edit editing), content sits in the shared PageContainer aligned with the banner, regions and items are evenly spaced on the large/medium/small token rhythm with no doubled margins, and colour appears only on status labels. R-1.27 is honoured: contact and score render only for the administrator viewer in the awarded story. R-1.33 v2 is honoured: no note control on the History section. The phone menu becoming a labelled section fixes a landmark gap without changing layout. Tier is STANDARD, so no escalation. This would become a return if any axe violation appeared, a filled test_id changed, a hard-coded colour or spacing value were found, or a story's content sat outside the page container.

**Conditions:**
none
