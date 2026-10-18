---
gate: G3
question: "Do the revised organizations tests now follow from their criteria and from nothing else?"
recommendation: "I changed one file, `tests/acceptance/organizations/R-3.28.spec.ts`, so its two cases now run one after the other in a single worker."
opened: 2026-10-18T04:27:00.236Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do the revised organizations tests now follow from their criteria and from nothing else?

**Recommendation.** I changed one file, `tests/acceptance/organizations/R-3.28.spec.ts`, so its two cases now run one after the other in a single worker.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I changed one file, `tests/acceptance/organizations/R-3.28.spec.ts`, so its two cases now run one after the other in a single worker. I could not run the file here, because the command to list it needed an approval nobody was present to give. The first real check will be the next verify run.

**Request 1 (build-slice-14-7, ruled at G3): taken up.** The ruling offered two fixes: run the cases serially, or give each case its own organization. The second was not possible. In the seed, the qualified organization is the only one approved for two service areas. The owner case also needs the qualified organization's own owner signed in, and that owner belongs to this organization alone.

So I added `test.describe.configure({ mode: "default" })` at the top of the file. This runs the two cases in file order in one worker, even if the run is started with full parallelism. I chose `"default"` rather than `"serial"` because `"serial"` would skip the second case whenever the first fails, and that would hide its result.

Both cases still do what the ruling's last sentence asks:
- **Own starting state:** each case first checks, as the administrator, that the organization is approved for exactly the seed's two areas, and saves them back if not.
- **Order doesn't matter:** case 2 does not rely on case 1 leaving the approvals in place, and neither case depends on running first.

I added a short comment explaining why the cases are serialised, and moved the header's derived date to 2026-10-17 because the file's content changed. I left the spec sha in the header as it was. No test body or assertion changed.

One thing I could not settle without the target: the fixture resets the seed before every test, and `tests/playwright.config.ts` already sets `fullyParallel: false`. That the two cases still saw each other's writes suggests the verify run either overrides parallelism or shares one target between workers. If several instances write to one target, two separate files touching this organization could still collide. Forcing this file's order covers the case the ruling describes, but not that wider one. Whoever owns the runner configuration should check how the seven instances map to targets. That configuration is not this stage's to change.

No other spec file and no entry in `tests/acceptance/not-testable.yaml` was touched.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: do the revised R-3.28 organizations tests follow from their criterion and from nothing else, and do they answer the request to stop the two cases changing each other's state? Approve. The only change is a file-level `test.describe.configure({ mode: "default" })` plus an explanatory comment. It makes the file's two cases run in order in one worker, which takes the file out of fully parallel scheduling. That removes the interleaving the build-slice-14-7 ruling saw, where each case's poll observed the other's write to the shared qualified organization. 'default' is correctly preferred over 'serial': serial would skip the second case whenever the first fails and hide its result. The writer's reason for not giving each case its own organization holds: the seed has only one organization approved for two areas, and the owner clause needs that organization's own owner. Each case still sets up the two-area starting state as the administrator and does not depend on the other or on order, as the ruling asked. No assertion changed, so the test still checks the criterion's given/when/then, including the owner-has-no-editing-control clause, and nothing about the implementation was added. The typecheck passed with no diagnostics. The revision request this answers is not open in the project, so no condition-met is recorded. What would change the ruling: the next verify run showing the two cases still interfering, or a cross-file collision on this organization from instances sharing one target. That would be a runner-configuration question, not this stage's.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `d81446a5731aba5f4fd5a2134b21e5594d3ce70a`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `acceptance/organizations/`, which this proposal answers for.

    No diagnostics.
