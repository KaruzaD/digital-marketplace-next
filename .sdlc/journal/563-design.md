---
stage: "design"
title: "design proposals"
at: "2026-10-18T15:52:12.515Z"
cost: 0.6138938
turns: 22
session: "138c2bcc-4b80-4b79-8f6f-cac59a9c82db"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I changed four files under design/ to answer one ruling and two faults that the operator named in the same domain. I added no page or state, changed no test ID, and did not touch spec/contract/surface.yaml. I have no shell, so I couldn't compile or scan the catalogue; the pipeline does that after this turn. I deferred nothing.

**Request 1 (build-slice-15-6, scrum master names).** The prose was wrong and the catalogue was right. Every Sprint With Us story that draws a scrum master choice draws the same thing: one required `RadioGroup` per phase, labelled "Scrum master for the <phase> phase", with one `Radio` per member (`proposal-scrum-master`). Each radio is named by the person alone. That covers the create default and invalid stories and the edit editing and organization-locked stories. None of them ever had the `aria-label` "Scrum master: <name>, <phase> phase" that DESIGN.md described.

In the proposals accessibility list in DESIGN.md I took the scrum master out of the bullet about repeated controls with `aria-label`s. That bullet now covers only "Add team member" and "Remove", with the "Remove" example the story actually draws. A new bullet says what the radio group draws and how a test finds a radio: by the group's label and the person's name.

The same section's components table had another line contradicting the catalogue: it listed the scrum master under `Checkbox`, as one per member per phase. A later section had already recorded that those checkboxes were gone. I moved the scrum master to the `RadioGroup` row, because leaving it would have left the two disagreeing, which is exactly what the ruling asked me to fix.

**The Code With Us edit story's proponent question.** `proposal-cwu-edit.editing.stories.tsx` now asks the create page's question, "Will you be submitting a proposal for this opportunity as an Individual or Organization?", with "Individual" and "Organization". The test IDs `proposal-proponent-individual` and `proposal-proponent-organization` are unchanged. The components table's `RadioGroup` row now gives this wording too and says create and edit use the same words.

**The second street line.** In `proposal-cwu-create-page.tsx` the second street line is now labelled "Street Address line 2", so the two street fields no longer share a name (WCAG 2.2 success criterion 2.4.6). Its test ID `proposal-street-2-field` is unchanged. DESIGN.md's section on the Code With Us proposal form notes that this label is the design's, not the original site's. The edit story already labelled its second line "Street address line 2 (optional)", so it needed nothing.

I also added a short section, "Corrections after the build", at the end of the proposals' chosen-direction part of DESIGN.md. It records all three corrections and states that no page, state or test ID changed.

**Inconsistency I left alone:** the edit story's other field labels use sentence case ("Legal name", "Email address"), while the create page uses the original site's title case ("Legal Name", "Email Address"). Nobody asked about those labels, so I didn't change them. A later pass may want to make them match.

No condition here was addressed to a person, and nothing asked me to change paths outside this stage's boundary.