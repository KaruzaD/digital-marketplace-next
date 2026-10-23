---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed `organizationEdit.serviceAreaCheckbox` in `tests/adapters/new/index.ts:7757`."
opened: 2026-10-18T17:37:43.627Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed `organizationEdit.serviceAreaCheckbox` in `tests/adapters/new/index.ts:7757`.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed `organizationEdit.serviceAreaCheckbox` in `tests/adapters/new/index.ts:7757`. I couldn't confirm the fix on the restyled tab, because the target running at http://localhost:4300 doesn't draw that tab. I also couldn't type-check the file or run the suite, because shell commands weren't permitted in this session.

**What was wrong.** The member decided whether the service areas were being edited before it opened the Team With Us qualification tab. It was still on the Organization tab at that point, which has no checkboxes, so the answer was always no. On the restyled tab, an administrator sees the checkboxes straight away, with no "Edit service areas" button to press. The member therefore took its read-only branch, looked for list items under "Approved service areas", found none, and returned "". That matches the R-3.28 failure verify reported on build-slice-11-7.

**The fix.**
- If checkboxes are already showing, the member reads them where they are without reopening the tab, so ticks an earlier step left unsaved are kept.
- Otherwise it opens the tab, and only then decides whether it is being edited.
- If checkboxes are showing on the open tab, it reads them as they stand and does not press Cancel, since it opened no editor.
- The result is unchanged: the names of the ticked areas, one per line, in the order the page draws them.
- The test ID `organization-service-area-checkbox` is still tried first, then the group named for service areas. That group falls back to any checkbox in the main region, and the restyled heading "Service areas this organization is approved for" also fits it.
- For a tab that has an "Edit service areas" button, or a read-only list, the member behaves as before.

**Checked against the running application** (seeded qualified organization, Northern Pines Digital Ltd.):
- **Administrator:** the tab still draws the earlier style: "Approved service areas" listing Agile coach and Full stack developer, with an "Edit service areas" button. I replayed the member's new steps in the browser, which can't stand in for type-checking or running the suite. It found no checkboxes on the open tab and opened the editor with the button. Five boxes appeared, all carrying their test ID, with only Full stack developer and Agile coach ticked. It read "Full stack developer\nAgile coach" and pressed Cancel, which closed the editor.
- **Owner:** the tab shows the same two areas as read-only items with their test ID, "Only an administrator can change which service areas an organization is approved for.", and no checkboxes or buttons. The member's read-only branch returns those two names.

The new branch should therefore make R-3.28 pass on the restyled build. This read is unconfirmed until verify runs against that build.

**Other notes.**
- The old binding returns the ticked areas as stored codes ("FULL_STACK_DEVELOPER"). The new binding returns display names ("Full stack developer"), and I kept that because changing the form is outside this fix.
- `tests/adapters/new/bindings.yaml` still lists `service_area_checkbox` as bound, and nothing else in it changed.
- No other member or file was edited, and every route I visited loaded.

## Ruling

**Verdict:** approve
**By:** runner:checks

Approved by the runner's checks, which policy.gates.G3.auto_approve lets settle bind-adapter proposals: the acceptance typecheck of b3f26dbda5 is clean; no condition is open against it; no escalation stands on it; nothing outside tests/adapters changed.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `b3f26dbda55af043ea0b16d71c9bdc810c92d366`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
