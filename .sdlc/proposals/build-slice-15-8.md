---
gate: G3
question: "Does slice 15 (A vendor can propose on Sprint With Us and Team With Us opportunities) do what its criteria say?"
recommendation: "The application build-slice-15-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T16:09:03.012Z
---

# Does slice 15 (A vendor can propose on Sprint With Us and Team With Us opportunities) do what its criteria say?

**Recommendation.** The application build-slice-15-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-15-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-2.19: proposalSwuCreate.phaseRequirements (phaseRequirementLines, tests/adapters/new/index.ts:14011-14032) read 'Prototype | complete' for a prototype phase with no team. It only counts a phase as incomplete when a line starts 'Incomplete:'. The page's phase group 'Prototype phase' says 'This phase’s team is incomplete. Name at least one team member. Not yet held: Frontend Development.' (.sdlc/evidence/slice-15/R-2.19.txt line 52). Count a phase as incomplete when its requirements line says 'is incomplete', and complete when it says 'meets its requirements'.
- to bind-adapter: R-2.19: in the missing-capability case phaseRequirementLines read both phases as complete with nothing missing. It looks for missing capabilities only in lines ending ': not held' (index.ts:14022, 14028). Each phase now gives them in one sentence: 'This phase’s team is incomplete. Not yet held: Frontend Development.' and 'This phase’s team is incomplete. Not yet held: Backend Development.' (.sdlc/evidence/slice-15/R-2.19-2.txt lines 59, 84). Read the missing capabilities from the comma-separated list after 'Not yet held:'.
- to bind-adapter: R-2.19: proposalSwuCreate.costErrors (costErrorLines, tests/adapters/new/index.ts:13945) read '' for a total cost over the opportunity's budget. It looks for a region named exactly 'Cost', but the page names the region '4. Cost', and inside it, under 'Total proposed cost: $480,000 of the $400,000 maximum budget.', it shows 'The proposed cost exceeds the maximum budget for this opportunity.' (.sdlc/evidence/slice-15/R-2.19-3.txt lines 99-103). Accept a numbered part name such as '4. Cost' when finding the cost region.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Should slice 15 (a vendor proposing on Sprint With Us and Team With Us opportunities) merge? Approve. The verify result is current for this proposal (application tree 5374089) and passed all 17 claimed criteria, including R-2.19, with none unasserted. The three conditions on build-slice-15-7 went to bind-adapter and asked nothing of the build. The diff is a restyle of slice 15's own create and manage screens and the shared Proposals tab table, recorded in decision record 0078. Behaviour stays as decisions 0058 and 0059 set it: submit refusals still come from the shared rule functions, and the R-2.22 organization lock still comes from Save changes. Withholding 'Save changes and submit' on an already-submitted proposal removes only a redundant action. The new seams (phaseRequirementsSentence, hourlyBid, the numbered form parts, the buttons offered for submitted versus draft proposals, the team table's membership columns) have unit tests. No secret, credential or logging appears in the touched screens, and the new team lookup reads only the organization named on the vendor's own proposal, showing nothing when that read is refused. This would become a return if the result went stale, a claimed criterion failed, or the manage-page team lookup were shown to expose organization members to a reader not entitled to them.

**Conditions:**
none
