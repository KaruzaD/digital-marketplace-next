---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed `opportunityCwuView.reward()` and `opportunityCwuView.status()` in `tests/adapters/new/index.ts`, as the ruling asked."
opened: 2026-10-18T01:48:00.653Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed `opportunityCwuView.reward()` and `opportunityCwuView.status()` in `tests/adapters/new/index.ts`, as the ruling asked.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed `opportunityCwuView.reward()` and `opportunityCwuView.status()` in `tests/adapters/new/index.ts`, as the ruling asked. Nothing else changed: no other member, and not `bindings.yaml`, where both members were already `bound`. I could not run a typecheck: the session needed permission to run `npx tsc` in `tests/` and none was given. I also did not re-run either member against the build at localhost:4300.

**reward().** It still tries the "Reward" term first, then the existing labelled-value lookup. After those it now takes the figure from a head line matching `/^reward\s+(.+)$/i`, so "Reward $5,000" gives "$5,000". On the build at localhost:4300 the "Reward" term still answers first, so that build reads as it did. The new pattern needs a space right after "Reward", so it does not catch "Reward: $5,000"; the labelled-value lookup already handles that form.

**status().** The head used to run until a line beginning "Opportunity ID:". On the restyled page "Opportunity ID" is a term with the id below it, so that line never appears, and the head ran on to the Description heading and took in the "Published" term label. The head now stops at whichever comes first:
- the first line whose text is one of the page's term labels (the text of every `dt` in the main region);
- an "Opportunity ID:" line;
- the "Description" heading.

On the restyled page that cuts the head off above "Opportunity ID" and the "Published" label below it. The status lookup also skips any line that is a term label. It now accepts either a line that is just a status word, or a line that starts with "Code With Us" and ends in a status word, which it reads as that word ("Code With Us Draft" gives "Draft"). It still ignores "Closed", as before. The "Status" term is still tried first, so the current build answers from its label as it did.

**proposalDeadline().** The ruling accepted this one. It shares the narrower head, and I left it otherwise untouched. The "Closes …" line would only be missed if the restyled page put it below the first term. Given the head the snapshot describes (status label, title, "Closes …", "Reward $5,000", then the terms), I expect it to sit above them, but I did not check that in the browser.

Every route in `surface.yaml` was already settled in the accepted binding, and this revision did not revisit any of them. I changed nothing outside `tests/adapters/new/`.
