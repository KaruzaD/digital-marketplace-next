---
stage: "derive-tests"
title: "derive tests"
at: "2026-10-18T09:55:15.625Z"
cost: 0.5055516000000001
turns: 13
session: "4490c0e2-1fda-4dc8-9126-7d1eef06a5e1"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I took up request 1 and rewrote `tests/acceptance/organizations/R-3.28.spec.ts`. I could not type-check or run it: the workspace has no installed dependencies, and there is no application here to run it against.

**What the ruling asked for.** The old test set its scenario up on `seed.organizations.qualified`. Other tests read and change that organization while verify runs the suite in parallel, so this test passed or failed depending on timing. The rewrite stops using any seeded organization.

**What the test does now.** Each of the two tests creates its own organization. The organization owner registers it through `surface.organizationCreate.createOrganization` under a legal name nothing else uses: the test's purpose, a timestamp and a random suffix. The test reads the new organization's id from `surface.organizationEdit.organizationIdentifier()`, the same way R-3.15 does. The administrator then approves it for FULL_STACK_DEVELOPER and AGILE_COACH through `editServiceAreas` and `saveServiceAreas`, and the test polls until the page shows exactly those two.

From there the steps are the same as before:
- **First test:** the administrator keeps FULL_STACK_DEVELOPER, swaps AGILE_COACH for DATA_PROFESSIONAL, and the test checks the approvals are now exactly the two that were ticked.
- **Second test:** the owner tries to edit and save, and the administrator's view must still show the original two.

Each test reads and changes only the organization it created.

**Other changes in the file:**
- Because the two tests no longer share an organization, I removed the line that forced them to run one after the other (`test.describe.configure({ mode: "default" })`).
- If registering the organization yields no usable id, the test now fails with that reason. It does not skip itself, so a broken setup cannot pass quietly.
- I updated the header's derived date to 2026-10-18 because the content changed. The criterion is unchanged at v1, so the spec sha stays as it was.

**Left alone.** No other file in `tests/acceptance/organizations/`, no entry in `tests/acceptance/not-testable.yaml`, and nothing under `tests/generated` was touched. The ruling did not ask for anything outside this stage's paths.

**For the contract.** I did not need any surface action or observation that was missing. Two things are worth noting:
- No seed handle lists the service areas the installation offers, so the test still writes those codes as literals.
- The persona file says the organization owner can "choose the service areas of an organization they own". R-3.28 says the opposite. The test follows the criterion, but the persona text may need reconciling.