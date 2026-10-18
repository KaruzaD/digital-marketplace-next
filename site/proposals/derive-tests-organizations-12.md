| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T09:55:15.672Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Do the revised organizations tests now follow from their criteria and from nothing else?

**Recommendation.** I took up request 1 and rewrote `tests/acceptance/organizations/R-3.28.spec.ts`.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

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

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: do the revised organizations tests now follow from their criteria and from nothing else? Approve. The revision does what build-slice-10-8's request asked: each R-3.28 test now registers its own uniquely named organization through the surface, has the administrator approve it for the two areas of the given, and reads and changes only that organization. The test no longer depends on seed.organizations.qualified, so it no longer passes or fails by timing. Each assertion still follows from R-3.28. The first test asserts that after the save the organization is approved for exactly the two ticked areas and not the cleared one. The second asserts that the owner's attempts to edit and save leave the approvals unchanged. That is the observable meaning of the owner being offered no editing control, and it is the reading already approved for this test. Creating and approving the organization only sets up the criterion's given and asserts nothing the criterion does not say. organizationCreate and organizationIdentifier are already used by R-3.15 and other organizations tests. A failed setup now fails rather than skips, and the runner's typecheck passed with no diagnostics. What would change the ruling: evidence that the surface can observe whether an editing control is offered to the owner. The second test should then assert that directly rather than relying on the approvals staying unchanged.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `b925d3358e32639a71fe18ab584da1082ab5b710`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `acceptance/organizations/`, which this proposal answers for.

    No diagnostics.
