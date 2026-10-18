---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed all three conditions in `tests/adapters/new/index.ts` and checked them against the running target."
opened: 2026-10-18T07:00:45.837Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed all three conditions in `tests/adapters/new/index.ts` and checked them against the running target.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed all three conditions in `tests/adapters/new/index.ts` and checked them against the running target. The project type-check (`tsc`) needed approval this session never got, so it was not run. I checked the new lines by hand against the helpers they call. `bindings.yaml` is unchanged: every member these conditions touch was already `bound`, and that stays true.

**Conditions 1 and 2: evaluation panel lock (R-1.43, R-5.16).** Both Sprint With Us and Team With Us use one shared helper, `evaluationPanelPage`, so one change covers both.
- **What the page has.** I signed in as the administrator through the identity provider. On a locked panel (`…/sprint-with-us/00000000-0000-4000-a011-000000000001/edit?tab=evaluationPanel`) there are two regions. The outer one, named "Evaluation panel", holds the lock note (`evaluation-panel-locked-message`). Inside it is a second region, "Members of the evaluation panel", which holds the member rows but not the note. An editable panel (the seeded opportunity `…-a024-000000000001`) has only the one "Evaluation panel" region.
- **The fix.** `section()` ended in `.last()`, which picked the inner table region on the locked page. It now ends in `.first()`. Regions come in page order, so that is always the outermost "Evaluation panel" region.
- **Checked live.** On the locked page the section now finds the lock note and both member rows, so `lockNote()` counts it, `editable()` returns false and `addPanelMember` notes the refusal instead of timing out on a member chooser. On the editable page the section still finds "Save evaluation panel" and no lock note, so editing works as before. `lockNote()` itself is unchanged.
- **The 701 opportunity.** On this instance, `…-8000-000000000701` is still at "Team questions: individual evaluation". Its panel is editable, because only the reviewer's run had moved it on to consensus. I could not see its locked state here. The locked page it would show is the one I checked on the a011 opportunity, so the same fix applies.

**Condition 3: full report heading (R-1.40).** On `…/code-with-us/00000000-0000-4000-a008-000000000001/complete`, signed in as administrator, the report article carrying `opportunity-full-report` is labelled by a level-1 heading drawn just above it. That heading is the opportunity's title, "Seeded awarded Code With Us opportunity", and it is the only one on the page. The article has no heading of its own inside it.
- **The fix.** When the page carries `opportunity-full-report`, `documentText()` now puts the main area's level-1 heading on the first line, then the article's text as before. It skips this if the article ever holds its own level-1 heading, so the title is never read twice.
- **Scope.** The same change applies to the Sprint With Us and Team With Us reports, which use the same reader. It does not change the printable proposal copies (`proposal-export-document`), which no condition named. A reader refused the page still gets an empty reading.

No route failed to resolve in this run. I wrote nothing outside `tests/adapters/new/`, and no condition is deferred.
