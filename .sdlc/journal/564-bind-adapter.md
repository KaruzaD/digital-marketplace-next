---
stage: "bind-adapter"
title: "bind adapter"
at: "2026-10-18T16:06:49.242Z"
cost: 0.47829239999999995
turns: 13
session: "271da607-4a1c-4aa2-8216-20ebd9921fe3"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I fixed all three conditions in `tests/adapters/new/index.ts`. I could not type-check the file or run the new patterns, because both commands were refused permission, so none of this has been run against the target yet. I didn't reopen the target either, since this revision asked me not to repeat the walk. The fixes are built from the page wording the reviewer quoted. `bindings.yaml` is unchanged: all three affected members were already marked `bound`, and nothing else in the adapter was touched.

**1. Phase marked complete with no team (R-2.19).** The phase-requirements reader used to count a phase as incomplete only when a line started with "Incomplete:", so a prototype phase with no team came back as complete. It now counts a phase as incomplete when its requirements say it "is incomplete", and as complete when they say it "meets its requirements". If both phrases appear, "meets its requirements" wins. The old "Incomplete:" wording still counts too.

**2. Missing capabilities not found (R-2.19).** The reader used to look only for lines ending ": not held", so both phases came back with nothing missing. It now reads the comma-separated list after "Not yet held:" and stops at the sentence's closing full stop. From the quoted text, that gives "Frontend Development" for the prototype phase and "Backend Development" for the other. The old ": not held" form is still read as well, with repeats removed.
- Both checks now sit in one small helper, `phaseRequirementState`, which the test-ID path and the fallback path share.
- One small addition beyond the literal request: when a phase's requirements element is found by its test ID, the phase group's own paragraphs are read alongside it. This covers the case where "Not yet held:" sits outside that element. The reviewer quoted the sentence from the phase group, not from the element.
- The returned line keeps its existing form: `<Phase> | complete|incomplete | <missing, comma-separated>`.

**3. Over-budget cost not reported (R-2.19).** The cost reader looked for a region named exactly "Cost", but the page names it "4. Cost". It now accepts either name. The region's numbered heading is skipped like the plain one, so it doesn't come back as an error line, and "The proposed cost exceeds the maximum budget for this opportunity." is returned as `total: …`. The over-budget reader (`budgetExceeded`) uses the same cost reader, so it picks up that notice too.

No condition was deferred, and nothing outside `tests/adapters/new/` was changed.