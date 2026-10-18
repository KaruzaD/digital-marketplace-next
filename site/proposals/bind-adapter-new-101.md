| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T06:19:35.105Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** The new target's adapter now finds elements by the contract's test IDs.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The new target's adapter now finds elements by the contract's test IDs. I couldn't compile it or run any tests: the workspace has no `node_modules` and running node isn't approved. I checked the moved members against the running application at http://localhost:4300 through the browser instead.

Only `tests/adapters/new/index.ts` and `tests/adapters/new/bindings.yaml` changed. `.playwright-mcp/`, the scratch folder the browser tool wrote into the workspace, has been removed, and the browser was signed out and closed.

**What the change is.** Wherever a running page carries the `test_id` that `spec/contract/surface.yaml` gives a member, the member now finds its element with `page.getByTestId` first. It falls back to role, label, visible text or address only where the page doesn't carry the ID or the contract names none. What each member hands back keeps the old form: the element's own words, the same items in the same order. Where an element sits inside a larger marked block, the extra words are dropped:
- a section's heading;
- the "Back to the proposal" and "Print" lines on exported documents;
- the button label inside the updated-terms warning.

**A conflict in my instructions.** The task text says never to use "a test id". The stage instructions and the stated reason for this run both say to use the contract's test IDs. I followed the test IDs.

**Members that now work where they reported unbound before.** Each was seen on the current build. Things I opened but didn't confirm were cancelled, so no seeded state changed.
- **Sprint With Us management screen:** finalize question consensuses, start team scenario, and the Code challenge and Team scenario sections.
- **Team With Us management screen:** finalize question consensuses and the Challenge section.
- **Code With Us proposal screen:** rank, now shown as "1 of 2".
- **User profile, as the administrator on another account:**
  - The administrator box works. For a vendor the service refuses it with "Vendors cannot be granted administrator permissions".
  - "Reactivate account" now appears on the deactivated vendor's profile and opens a confirmation dialog.
- **Notifications on both profile pages:** confirming or cancelling an unsubscribe. Unticking the box now opens a dialog.
- **Legal on both profile pages:** accepting updated terms and confirming it. The vendor whose terms were reset now sees a warning, a button and a dialog.

Several readers that used to return empty now read their element:
- the Sprint With Us budget, phases, assignment date and creator;
- the Team With Us resources and dates;
- the winning proponent's contact details and score;
- the names of the elements in a published page's body;
- the email reference page, which now loads.

**Still unbound.** I opened each page in the state the contract describes:
- **Team With Us proposal screen:** score resource questions, screen in and screen out. There are no such controls in any section.
- **Organization team tab:** the invalid membership type error. The invite dialog offers no membership type.
- **Mail delay proxy:** its three members. The sandbox doesn't run the proxy.

The Sprint With Us and Team With Us proposal forms don't carry `proposal-team-member-choice`, so `team_member_choices` still finds the chooser by its name.

**Absent.** `/proposals` still answers the application's "Page not found", so its placeholder reading stays absent and is decided when the method runs. Every other route in the contract resolves.

**Behaviour that differs from before:**
- `service_is_up` returns the status page's message.
- Sign-out and failed-sign-in notices are read from their marked elements.
- Documents leave out their control lines.
- An opportunity's deadline returns the "Closes …" line where the page shows one.
- Field errors marked `field-error` are read only when the form shows no other message, because their wording differs from the messages beside each field.

**Self-check.** A read-only pass checked the changed function signatures against their callers. It found one duplicate variable in `columnValues`, which I renamed.

Two kinds of lookup remain that a reviewer may want to look at:
- A few lookups use tag names such as `input` or `dt` inside page evaluation, or XPath to reach a parent element. These are not class or element-id selectors, and most were already there before this run; one that reads the input inside a marked date field is mine.
- The adapter has no `expect(` and no `test(`, and no password value is written anywhere. The password is read from the environment when `signIn` runs.

**Data touched while walking.** Probe content pages and a draft Sprint With Us opportunity were created and then deleted. One stored image file from that probe remains. Clicking the team-scenario start once was refused and changed nothing. A Sprint With Us proposal form was filled and then abandoned without saving.

`bindings.yaml` names every page and member once, spelled as in the contract. Its comments now say the test ID comes first.

## Ruling

**Verdict:** approve
**By:** runner:checks

Approved by the runner's checks, which policy.gates.G3.auto_approve lets settle bind-adapter proposals: the acceptance typecheck of ba98e381cb is clean; no condition is open against it; no escalation stands on it; nothing outside tests/adapters changed.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `ba98e381cbe0456ac425de68cc89bf524fb822e5`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
