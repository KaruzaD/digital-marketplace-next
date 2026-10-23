---
stage: "derive-tests"
title: "derive tests"
at: "2026-10-18T04:27:00.191Z"
cost: 0.3404018
turns: 9
session: "88c65dd7-6f06-44fe-956b-ca9cb9b67447"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I changed one file, `tests/acceptance/organizations/R-3.28.spec.ts`, so its two cases now run one after the other in a single worker. I could not run the file here, because the command to list it needed an approval nobody was present to give. The first real check will be the next verify run.

**Request 1 (build-slice-14-7, ruled at G3): taken up.** The ruling offered two fixes: run the cases serially, or give each case its own organization. The second was not possible. In the seed, the qualified organization is the only one approved for two service areas. The owner case also needs the qualified organization's own owner signed in, and that owner belongs to this organization alone.

So I added `test.describe.configure({ mode: "default" })` at the top of the file. This runs the two cases in file order in one worker, even if the run is started with full parallelism. I chose `"default"` rather than `"serial"` because `"serial"` would skip the second case whenever the first fails, and that would hide its result.

Both cases still do what the ruling's last sentence asks:
- **Own starting state:** each case first checks, as the administrator, that the organization is approved for exactly the seed's two areas, and saves them back if not.
- **Order doesn't matter:** case 2 does not rely on case 1 leaving the approvals in place, and neither case depends on running first.

I added a short comment explaining why the cases are serialised, and moved the header's derived date to 2026-10-17 because the file's content changed. I left the spec sha in the header as it was. No test body or assertion changed.

One thing I could not settle without the target: the fixture resets the seed before every test, and `tests/playwright.config.ts` already sets `fullyParallel: false`. That the two cases still saw each other's writes suggests the verify run either overrides parallelism or shares one target between workers. If several instances write to one target, two separate files touching this organization could still collide. Forcing this file's order covers the case the ruling describes, but not that wider one. Whoever owns the runner configuration should check how the seven instances map to targets. That configuration is not this stage's to change.

No other spec file and no entry in `tests/acceptance/not-testable.yaml` was touched.