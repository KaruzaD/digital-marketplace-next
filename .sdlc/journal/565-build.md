---
stage: "build"
title: "build slice 15"
at: "2026-10-18T16:09:02.911Z"
cost: 0
turns: 0
session: ""
---

The application build-slice-15-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-2.19: proposalSwuCreate.phaseRequirements (phaseRequirementLines, tests/adapters/new/index.ts:14011-14032) read 'Prototype | complete' for a prototype phase with no team. It only counts a phase as incomplete when a line starts 'Incomplete:'. The page's phase group 'Prototype phase' says 'This phase’s team is incomplete. Name at least one team member. Not yet held: Frontend Development.' (.sdlc/evidence/slice-15/R-2.19.txt line 52). Count a phase as incomplete when its requirements line says 'is incomplete', and complete when it says 'meets its requirements'.
- to bind-adapter: R-2.19: in the missing-capability case phaseRequirementLines read both phases as complete with nothing missing. It looks for missing capabilities only in lines ending ': not held' (index.ts:14022, 14028). Each phase now gives them in one sentence: 'This phase’s team is incomplete. Not yet held: Frontend Development.' and 'This phase’s team is incomplete. Not yet held: Backend Development.' (.sdlc/evidence/slice-15/R-2.19-2.txt lines 59, 84). Read the missing capabilities from the comma-separated list after 'Not yet held:'.
- to bind-adapter: R-2.19: proposalSwuCreate.costErrors (costErrorLines, tests/adapters/new/index.ts:13945) read '' for a total cost over the opportunity's budget. It looks for a region named exactly 'Cost', but the page names the region '4. Cost', and inside it, under 'Total proposed cost: $480,000 of the $400,000 maximum budget.', it shows 'The proposed cost exceeds the maximum budget for this opportunity.' (.sdlc/evidence/slice-15/R-2.19-3.txt lines 99-103). Accept a numbered part name such as '4. Cost' when finding the cost region.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.