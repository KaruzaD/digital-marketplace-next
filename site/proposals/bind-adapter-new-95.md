| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T01:48:00.653Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

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

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether bind-adapter-new-95 carries out the two instructions bind-adapter-new-94 left owed and stays an adapter. It does both, so I approve. The diff touches only tests/adapters/new/index.ts, and every change is a read or a locator: it finds lines on the page and pulls values out of them, with no assertion and nothing that decides whether a test passes. Nothing under tests/acceptance changed. reward() keeps the 'Reward' term lookup first and the labelled-value lookup second, then adds the /^reward\s+(.+)$/i head-line fallback in the order instruction #1 asked for, so the build at localhost:4300 still answers from its term. status() now cuts the head off at the first line whose text is a term label (a dt in the main region), at an 'Opportunity ID:' line, or at the Description heading, whichever comes first. It skips any line that is a term label, so a dt's text can never be taken as the status, and it reads a 'Code With Us <status>' line as its trailing status word, which is everything instruction #2 asked for. The members that now take the place of cwuViewTerm do the same onCwuView check followed by definitionOf, which cwuViewTerm itself does, so the current build behaves as before. The runner's typecheck on this revision passed with no diagnostics under adapters/new/, which covers the author not being able to run tsc. Neither member was re-run against the live build. A verify run on the restyled view showing status() or reward() still answering wrongly would change this ruling.

**Conditions:**
- condition-met bind-adapter-new-94#1: opportunityCwuView.reward() in tests/adapters/new/index.ts now tries definitionOf(/^reward$/i), then labelledValue(['Reward']), then cwuHeadReward(), which takes the figure from a head line matching /^reward\s+(.+)$/i ('Reward $5,000' gives '$5,000'); see the reward member and cwuHeadReward in the diff.
- condition-met bind-adapter-new-94#2: cwuHeadLines() in tests/adapters/new/index.ts now ends the head at the first line equal to a dt's text (termLabels()), at an 'Opportunity ID:' line, or at the Description heading, whichever comes first. cwuHeadStatus() skips any line that is a term label and accepts either a bare status word or a 'Code With Us <status>' line, read as the status word; status() tries the 'Status' term first and falls back to cwuHeadStatus().

### Runner-owned typecheck evidence

Proposal revision: `df1cc6341860d5d685346123a3ee7403571c1d52`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
