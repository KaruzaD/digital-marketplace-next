| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T15:44:19.731Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** All seven conditions are answered, and nothing is deferred.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

All seven conditions are answered, and nothing is deferred. I couldn't run the TypeScript type check: the session needed approval for `npx tsc` and none was available. So the edited file has not been compiled. I checked the changed lines by reading them and by running the same locator on the live target.

**Conditions 1–4, 6 and 7 (the scrum master radio on R-2.7, R-2.9, R-2.11, R-2.16, R-2.19 and R-2.22).** The adapter found the radio only under the old name "Scrum master: <name>, <phase> phase". I opened the running target as the seeded vendor, went to the create form of the seeded open Sprint With Us opportunity (`…a025…`), chose the organization and added a member to the implementation phase. The page shows a radio group "Scrum master for the implementation phase (required)". Each member's radio is named by the member alone ("Alex Placeholder") and sits inside a label carrying the test ID `proposal-scrum-master`. The radio passes the adapter's visibility filter.

I added one shared locator, `scrumMasterRadio`, and both `onPhase` and `tickScrumMaster` now use it. It looks for the radio by test ID `proposal-scrum-master` first. It falls back to the "Scrum master for the <phase> phase" radio group and matches the member's name, optionally followed by "Membership pending" or "(pending)". The old "Scrum master: <name>, …" name is still accepted as a last resort. Run against the live form, this locator found the radio and checked it. When it fails, the error now lists the names the radio group does offer.

`proposalSwuEdit.setScrumMaster` goes through the same function, so this also covers the edit-form half of condition 7. `onPhase` now takes the phase word, and I updated its one caller in `addPhaseMembers`.

**Condition 5 (R-2.18, the pending member).** `pickListed` now also accepts an option worded "<Name> (membership pending)", alongside "<Name>" and "<Name> (pending)". The member-choices reader (`choicesOffered`) had the same wording problem: it stripped only " (pending)" when reading names. I widened it to strip " (membership pending)" too, so it still returns names alone, the way the old binding does. That goes slightly beyond the literal request, but it is the same wording fix applied where the adapter reads the chooser. The second R-2.18 case failed on the scrum master radio, which the fix above covers.

**What I did not check.** I did not see a pending member's option on the live target: the only person the seeded organization offered was a member who is not pending. That wording comes from the ruling and the design catalogue it cites. I also did not re-run the three R-2.19 cases the condition asks to re-check (missing phase capability, phase cost over budget, total cost over budget). They go through the same scrum master step and now reach it, but whether they pass is for the next calibration run.

The only file changed is `tests/adapters/new/index.ts`, plus some comments in it describing the new wording. `bindings.yaml` is unchanged: `set_scrum_master`, `add_phase_team_member` and `pending_team_member` were already listed as bound. Every route I opened resolved on the target.

## Ruling

**Verdict:** approve
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether this adapter revision binds the scrum master radio and the pending-member option on the Sprint With Us proposal forms as the running target draws them, and nothing beyond that. I approve. It reached me because bind-adapter was sent work back more times than policy.loops.request allows, not because the pipeline cannot do what the proposal needs, so it is ruled here rather than escalated. The diff matches the evidence it cites: .sdlc/evidence/slice-15/R-2.7.txt lines 44-51 show a radiogroup 'Scrum master for the implementation phase (required)' holding a radio named only 'Charlie Placeholder', and the new shared scrumMasterRadio locator finds the radio by the member's name inside that group or the proposal-scrum-master test ID, keeping the old name only as a fallback. onPhase, tickScrumMaster and so proposalSwuEdit.setScrumMaster all use it. The approved catalogue (design/catalogue/proposal-swu-create.default.stories.tsx:21) uses the wording '(membership pending)', and pickListed and choicesOffered now accept it, which is the same fix applied where the chooser is read. Only tests/adapters/new/index.ts changes, bindings.yaml is untouched, and the runner's typecheck on this revision passed with no diagnostics. The DESIGN.md mismatch that caused these failures stays with the design stage under its own open request, build-slice-15-6#8, and the three R-2.19 cases nobody has re-run are left to the next calibration run. I would return this if that run showed the scrum master radio still unfound, or a pending member still not added, on the create or edit form.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `6097916f25b459cbc88a00eec69ac3bb873de916`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
