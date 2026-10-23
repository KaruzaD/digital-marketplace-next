| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T01:42:59.171Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I rebound `status()`, `proposalDeadline()` and `reward()` on the Code With Us view, but I could not see the restyled page, so the new code paths have not been run against it.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I rebound `status()`, `proposalDeadline()` and `reward()` on the Code With Us view, but I could not see the restyled page, so the new code paths have not been run against it. I also could not type-check the edited file: the compile command needed an approval this run doesn't have.

**What the running target shows.** The build at http://localhost:4300 is not the restyled one. Opened anonymously on the seeded published Code With Us opportunity (`/opportunities/code-with-us/00000000-0000-4000-8000-000000000601`), its head still has a "Status" label over "Published", a "Proposal deadline" label over "June 1, 2030 at 4:00 p.m. Pacific time", and a "Reward" label over "$5,000". The test IDs the ruling names are already on the markup, but the labels they replace are still there too. So the head the ruling describes, with no labels, could only be taken from the ruling's own description.

**Why I did not use the test IDs.** The ruling asks for both reads to use test IDs. This stage may not bind by test ID, and the separation check refuses one. I read the same values by visible text instead:

- **`status()`** reads the "Status" label first, as before. When the page has no such label, it reads the head: the lines up to "Opportunity ID: …", or up to the Description section if that line is missing. It returns the first line that is exactly a status word ("Draft", "Under review", "Published", "Evaluation", "Awarded", "Cancelled" and the like).
- **`proposalDeadline()`** reads the "Proposal deadline" label first. Failing that, it returns the head line beginning "Closes…" or "Closed". This matches how the old target's binding reads its own head ("Closes <date> at …").
- **`reward()`** still reads its "Reward" label, which the ruling says is still there. If the label is ever drawn another way ("Reward: $5,000", or a label over its figure), it now falls back to finding that label.

All three still return empty when the page is withheld from the reader, and still report unbound for an unknown identifier, as before. On the running build the label path still answers first, so nothing that was accepted reads differently.

**What I left alone.** Nothing else in the adapter changed. `bindings.yaml` is unchanged, since all three members were already bound. I wrote nothing outside `tests/adapters/new/`. The evidence file the ruling cites (`.sdlc/evidence/slice-7/R-1.21.txt`) is not in this workspace, so I could not check the restyled head's exact lines against it. The next run against the restyled build should confirm that "Draft" and the "Closes … at 4:00 p.m. Pacific time" line come back for R-1.14, R-1.21 and R-1.22, and the file should be type-checked then.

No page's route failed to resolve; I opened only the Code With Us view this run.

## Ruling

**Verdict:** return
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether bind-adapter-new-94 binds opportunityCwuView's status, proposal deadline and reward on target new so they read what the restyled Code With Us head shows. I am ruling on the escalation's eleventh request, because the other ten are older sends this proposal does not touch, and the eleventh is why the loop limit was hit. Reading by visible text instead of test IDs is acceptable: the separation check forbids test-ID binding, and the criteria ask only for the values. proposalDeadline() is correct: the page snapshot verify took for R-1.21 shows the head line 'Closes October 31, 2026 at 4:00 p.m. Pacific time', which /^close[sd]\b/ takes. reward() is not. The same snapshot draws the reward as one head list item, 'Reward $5,000', with no colon and no definition term. definitionOf(/^reward$/i) only finds a dt, and labelledValue(['Reward']) only matches 'Reward: x' or 'Reward' on a line by itself (index.ts:207-216), so it returns '' on the restyled page. The page is drawn as the approved design specifies, so the fix belongs in the adapter, not the app. status() is also unsafe. The snapshot shows the program label and status together as 'Code With Us Draft', which the anchored CWU_STATUS_SHOWN pattern does not match. And because that page draws Opportunity ID as a term with its value below, not as 'Opportunity ID: <id>', cwuHeadLines runs on to the Description heading and takes in the 'Published' term label. That matches the status pattern, so on a draft status() can return 'Published', a wrong value where it used to return an empty one. Typecheck passed on the runner. This would be approved once reward() takes the figure from a 'Reward <figure>' head line and status() reads the status label in the head only, never a term label below it, with the label lookups still answering first on the build at localhost:4300.

**Conditions:**
- opportunityCwuView.reward() in tests/adapters/new/index.ts returns '' on the restyled Code With Us view. Its head draws the reward as one list item: the word 'Reward', a space, then the figure (the page verify captured for R-1.21 on build-slice-7-11 shows the line 'Reward $5,000'), with no colon and no definition term. Neither definitionOf(/^reward$/i) nor labelledValue(['Reward']) matches that line. After the existing term lookup, add a fallback that takes the figure from a head line matching /^reward\s+(.+)$/i, so the build at localhost:4300 still reads the same way. No test ID is needed.
- opportunityCwuView.status() in tests/adapters/new/index.ts can return a term label as the status. On the restyled view verify captured for R-1.21, the program and status labels read together as the one line 'Code With Us Draft', which the anchored CWU_STATUS_SHOWN pattern does not match. Opportunity ID is drawn as a term ('Opportunity ID') with the id below it, not as 'Opportunity ID: <id>', so cwuHeadLines() runs on to the Description heading and takes in the 'Published' term label, which CWU_STATUS_SHOWN accepts. On a draft, status() can then answer 'Published'. Bound the head at the title heading (the lines above the level-1 heading), or at the first line that is a definition term, rather than at 'Opportunity ID:'. Take the status as a trailing status word on a line that begins with the program name ('Code With Us Draft' gives 'Draft') as well as a line that is just a status word. Never take a dt's text as the status.

### Runner-owned typecheck evidence

Proposal revision: `54ffe5b50fd368ddc9ee8d5fe15c66fc9e6204d5`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
