---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed the race: `organizationUserMemberships.leaveOrganization` now returns only after the organization's row has changed in the table."
opened: 2026-10-18T23:17:30.455Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed the race: `organizationUserMemberships.leaveOrganization` now returns only after the organization's row has changed in the table.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I fixed the race: `organizationUserMemberships.leaveOrganization` now returns only after the organization's row has changed in the table. The same fix covers the other membership actions that had the same gap. I tested the new waiting logic in the browser against the running target, but I couldn't type-check or run the adapter file itself. Installing the TypeScript toolchain and running `node --check` both needed permission I didn't have.

**What I saw on the running target.** I didn't want to change the seeded memberships, so I made a throwaway organization, "Binding Walk Leave Check Ltd.", as the organization owner. I invited the organization member and the vendor to it, then walked each answer:

- **Accept:** the dialog has the test ID `membership-accept-dialog`. About 100 ms after "Join organization", the status reads "You have joined <org>." and the row turns from "Pending" to "Member | Leave".
- **Leave:** the dialog has the test ID `membership-leave-dialog`. After "Leave organization", the status reads "You have left <org>." and the row disappears from the table.
- **Decline:** after "Decline invitation", the status reads "You have declined the invitation from <org>." The row disappears, or the table gives way to the "You do not belong to any other organizations…" message.
- **Owner removing a pending member** on the organization's team tab: "Remove from team" takes the row away with no status line. A refusal is drawn as an alert instead.

These records stay on the target after my walk: the organization I made and its owner membership, plus one ended membership of the member persona and one declined invitation of the vendor persona, both on that organization. Nothing in the seed was changed.

**What changed in `tests/adapters/new/index.ts`.**

- **The organizations tab** (`organizationUserMemberships` and `organizationUserMembershipsSelf`): accept, decline and leave now wait after confirming. Before pressing, the adapter records how the organization's rows read. Afterwards it waits, for up to ten seconds, until those rows have changed: gone, or reading differently.
  - It doesn't count anything while the confirmation dialog is still open.
  - When the answer came from an invitation email with the dialog already open and no row to watch, the status line naming the organization is the signal instead.
  - If neither happens, the method returns anyway and leaves the screen for the test to read. It doesn't throw.
  - I didn't use "the status says you have left" alone as the signal. The failure the operator described matches a status line appearing before the table is redrawn, and waiting on the row itself avoids that.
- **The leave dialog** is now recognised by its test ID, `membership-leave-dialog`, rather than by its wording, matching how the accept and decline dialogs were already found.
- **The owner's team tab** (`organizationEdit.removeTeamMember` and `approvePendingMember`): these already waited for the server's answer but not for the table to be redrawn. They now also wait until the person's row is gone or has changed, or a refusal alert shows, for up to five seconds. This replaces a flat two-second wait for an alert that only a refusal ever shows.

What each method hands back is unchanged: the actions still return nothing, and no observation was touched.

**Checking it.** I ran the new waiting steps in the browser as the member persona: accept, then leave, reading the affiliated table immediately after each. Both returned about 105 ms after confirming. The read after leaving showed only "Northern Pines Digital Ltd. | Member | Leave", without the row that had been left.

**`bindings.yaml`** needed no change: all five members were already `bound`, and every route I visited resolved.

**Other.** Once, while inviting as the owner, an email typed into the "Add team members" dialog was lost before "Send invitations", and the dialog said "Enter an email address". It worked when retried with the box clicked first. That points to a possible timing weakness in `organizationEdit.addTeamMembers`, which I left alone because it is outside this run's scope. Nothing outside `tests/adapters/new/` was changed.

## Ruling

**Verdict:** approve
**By:** runner:checks

Approved by the runner's checks, which policy.gates.G3.auto_approve lets settle bind-adapter proposals: the acceptance typecheck of 549b46bf9f is clean; no condition is open against it; no escalation stands on it; nothing outside tests/adapters changed.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `549b46bf9f8ce7008ae5863e696bb102e1ba82fc`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
