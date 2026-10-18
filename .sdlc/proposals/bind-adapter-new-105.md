---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "All seven conditions are answered, and nothing is deferred."
opened: 2026-10-18T15:44:19.731Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

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
