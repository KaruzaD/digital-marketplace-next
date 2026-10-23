| Field | Value |
| --- | --- |
| gate | G-DESIGN |
| opened | 2026-10-17T19:37:59.871Z |
| holder | agent:ux-reviewer |

# Do these screens serve the opportunities criteria, and are they built out of the design system?

**Recommendation.** Handed in by a person from `design-directions` at 35b7a503234b.

Handed in by a person from `design-directions` at 35b7a503234b. No agent session ran: the stage's outputs are that commit's own, judged by the stage's checks as an agent's work is.

The reason given for the run: Hand in the redesign drawn outside the pipeline on the design-directions branch: the shared site header and footer, the home page, the opportunity list and the Code With Us proposal form, with the chosen direction's rules in DESIGN.md

## Ruling

**Verdict:** approve
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Do these screens serve the opportunities criteria and are they built from the design system? Approve. The axe report covers 537 stories with 0 violations, including the two new states (opportunity-list no-results, proposal-cwu-create draft-saved), which are listed in screens.yaml. All 42 test IDs removed from the story files are still present in the new page modules (site.tsx footer links, the home sign-in and sign-up IDs passed as header props, marketplace.tsx row IDs, every proposal-form ID), so no filled-in test_id changed. The five new modules contain no hard-coded hex or rgb colours and no raw-pixel margins, padding or gaps; the only fixed pixel values are layout column widths and breakpoints, which DESIGN.md documents. Header, Subheader, Footer, Menu, form fields, Accordion, Callout and InlineAlert come from the design system; the static status Label, opportunity rows and program panels are named in DESIGN.md as the project's own and are built from tokens, with the reason the design system's Tag does not fit. In the default screenshots for home, opportunity list and the CWU proposal form, and in the form's invalid state, content sits in the shared container aligned with the header, spacing follows one even rhythm, and colour marks only status. Tier is STANDARD, so no escalation. A later revision would be returned for any nonzero axe count, a renamed or dropped test ID, or literal colour or spacing values in place of tokens.

**Conditions:**
none
