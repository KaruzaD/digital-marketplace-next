| Field | Value |
| --- | --- |
| gate | G-DESIGN |
| opened | 2026-10-18T15:52:12.560Z |
| holder | agent:ux-reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Do these screens serve the proposals criteria, and are they built out of the design system?

**Recommendation.** I changed four files under design/ to answer one ruling and two faults that the operator named in the same domain.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I changed four files under design/ to answer one ruling and two faults that the operator named in the same domain. I added no page or state, changed no test ID, and did not touch spec/contract/surface.yaml. I have no shell, so I couldn't compile or scan the catalogue; the pipeline does that after this turn. I deferred nothing.

**Request 1 (build-slice-15-6, scrum master names).** The prose was wrong and the catalogue was right. Every Sprint With Us story that draws a scrum master choice draws the same thing: one required `RadioGroup` per phase, labelled "Scrum master for the <phase> phase", with one `Radio` per member (`proposal-scrum-master`). Each radio is named by the person alone. That covers the create default and invalid stories and the edit editing and organization-locked stories. None of them ever had the `aria-label` "Scrum master: <name>, <phase> phase" that DESIGN.md described.

In the proposals accessibility list in DESIGN.md I took the scrum master out of the bullet about repeated controls with `aria-label`s. That bullet now covers only "Add team member" and "Remove", with the "Remove" example the story actually draws. A new bullet says what the radio group draws and how a test finds a radio: by the group's label and the person's name.

The same section's components table had another line contradicting the catalogue: it listed the scrum master under `Checkbox`, as one per member per phase. A later section had already recorded that those checkboxes were gone. I moved the scrum master to the `RadioGroup` row, because leaving it would have left the two disagreeing, which is exactly what the ruling asked me to fix.

**The Code With Us edit story's proponent question.** `proposal-cwu-edit.editing.stories.tsx` now asks the create page's question, "Will you be submitting a proposal for this opportunity as an Individual or Organization?", with "Individual" and "Organization". The test IDs `proposal-proponent-individual` and `proposal-proponent-organization` are unchanged. The components table's `RadioGroup` row now gives this wording too and says create and edit use the same words.

**The second street line.** In `proposal-cwu-create-page.tsx` the second street line is now labelled "Street Address line 2", so the two street fields no longer share a name (WCAG 2.2 success criterion 2.4.6). Its test ID `proposal-street-2-field` is unchanged. DESIGN.md's section on the Code With Us proposal form notes that this label is the design's, not the original site's. The edit story already labelled its second line "Street address line 2 (optional)", so it needed nothing.

I also added a short section, "Corrections after the build", at the end of the proposals' chosen-direction part of DESIGN.md. It records all three corrections and states that no page, state or test ID changed.

**Inconsistency I left alone:** the edit story's other field labels use sentence case ("Legal name", "Email address"), while the create page uses the original site's title case ("Legal Name", "Email Address"). Nobody asked about those labels, so I didn't change them. A later pass may want to make them match.

No condition here was addressed to a person, and nothing asked me to change paths outside this stage's boundary.

## Ruling

**Verdict:** approve
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether the proposals screens still meet their criteria and use the design system, now that the revision makes DESIGN.md match the catalogue. Approved. Every Sprint With Us create and edit story (swu-create default and invalid, swu-edit editing and organization-locked) draws one required RadioGroup per phase labelled 'Scrum master for the <phase> phase', and each Radio in it (proposal-scrum-master) is named by the person alone. DESIGN.md's accessibility list and components table now say exactly that, and the stale Checkbox row is gone, which answers the revision request from build-slice-15-6. The Code With Us edit story now asks the create page's proponent question with 'Individual' and 'Organization', and the create page's second street line is now a separate named field, 'Street Address line 2' (WCAG 2.2 SC 2.4.6). Both screens were checked by eye: content stays in the shared page container, in line with the banner, with even spacing. No test_id changed, and report.json shows ok: true with no axe messages. Two small inconsistencies are left for a later pass and do not justify a return: the proponent radios run side by side on create but stack on edit, and edit uses sentence-case labels where create uses title case. The ruling would change if a story still drew the scrum master any other way, or if the rescanned catalogue showed an accessibility violation.

**Conditions:**
none
