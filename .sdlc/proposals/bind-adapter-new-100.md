---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "The application does offer this action."
opened: 2026-10-18T03:50:01.875Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** The application does offer this action.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've fixed the one gap from the last run, R-8.31 (`proposal-cwu-edit.save_changes`). The application does offer this action. The adapter wasn't finding it because it looked in the wrong place on the page. I couldn't run the type check (permission was refused), so the change compiles in principle but hasn't been checked.

**What I found.** I signed in through the sandbox identity provider as the first vendor persona (`test-vendor-1`), using the password variable's name as instructed. I then created a draft individual proposal on the seeded published Code With Us opportunity (…0601) and opened its edit screen. Pressing "Edit" under "Proposal actions" opens the fields. The save buttons ("Save changes and submit", "Save changes", "Cancel") now sit below the opportunity summary in the side panel labelled "Opportunity and actions". Earlier builds put them in a group named "Save choices". The adapter's `saveChanges` searched only inside that group. When the group wasn't there, the search came up empty and reported unbound, even though the button was on screen. I submitted the proposal and pressed "Edit" again: a submitted proposal shows the same panel and buttons.

**What I changed.** One helper in `tests/adapters/new/index.ts`, `saveChoices()`, now accepts either the old "Save choices" group or the "Opportunity and actions" panel. It counts the panel only while it shows a "Save changes" button. This matters because the Sprint With Us and Team With Us code uses the same helper to tell when a save has finished and the screen has closed again. The closed screen has no such panel, so that check still works. I didn't walk those two programs' edit screens on this pass, so it isn't confirmed that their edit screens use the same panel.

**Checked in the browser:** with the new lookup, entering a comment and pressing "Save changes" stays on the proposal's address, shows "Your changes have been saved.", and closes the form.

**Unchanged:**
- `bindings.yaml` already listed `proposal-cwu-edit.save_changes` as bound, which is now accurate, so I left the file alone.
- Every other binding is as it was.
- Every page route I used during this run loaded normally.
- I changed nothing outside `tests/adapters/new/`.

**Leftover data on the target:** my test left a submitted Code With Us proposal ("Binding Probe", id 1a58ddd1-6042-4e5e-8395-fe9e035915c1) by the first vendor persona on the seeded published opportunity. I cancelled out of editing it but didn't withdraw or remove it. A submitted proposal can only be withdrawn, and withdrawing still leaves the record. If the target isn't reseeded before the next run, any test that expects this vendor to have no proposal on that opportunity will see this one.
