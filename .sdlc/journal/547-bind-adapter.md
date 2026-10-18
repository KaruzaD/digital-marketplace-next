---
stage: "bind-adapter"
title: "bind adapter"
at: "2026-10-18T03:05:41.526Z"
cost: 1.5208414000000003
turns: 58
session: "d00bfd77-0157-4b5e-ba2d-400e5c02dbd3"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I've made the four fixes the ruling asked for, plus two more the create page needed, all in `tests/adapters/new/index.ts`. Signed in as test-vendor-1, I checked every new pattern against the live create form for the seeded published Code With Us opportunity and each one matched. I could not run the TypeScript typecheck: the session refused permission for `tsc`. I checked the new code by reading it instead, but the runner's typecheck still needs to pass before this goes further.

**What the create form looks like now.** It sits under "Create a Code With Us Proposal". Section "1. Proponent" asks "Will you be submitting a proposal for this opportunity as an Individual or Organization? (required)", with the radios "Individual" and "Organization", neither ticked at first. Choosing "Individual" shows these fields:
- "Legal Name(required)", "Email Address(required)", "Phone Number"
- "Street Address(required)", then a second box labelled just "Street Address"
- "City(required)", "Province / State(required)", "Postal / ZIP Code(required)", "Country(required)"

Choosing "Organization" shows a chooser button that reads "Organization" until one is picked, then shows the organization's legal name. Its list offered "Cedar Hollow Systems Inc." for this vendor. The "Submit", "Save Draft" and "Cancel" buttons are no longer in a "Proposal actions" group; they sit in a side panel called "Opportunity and actions". With only the proposal text missing, "Submit" gave the alert "Unable to Submit Proposal". Once that text was filled it opened a dialog titled "Review Terms and Conditions". Its two boxes now read "I acknowledge that I have read, fully understand and agree to the Code With Us Terms & Conditions. (required)" and the same for the Digital Marketplace terms. Its "Submit Proposal" stays disabled until both are ticked. I pressed "Cancel" in that dialog and saved nothing, so this walk left no proposal behind.

**The four conditions:**
1. **Submit button (R-2.13).** The pattern now also accepts "Submit", but only as a button's entire name: on the create form only the real Submit button matches. The dialog's confirm button already accepted "Submit Proposal", so it needed no change. The check on the proposal's own screen around line 10703 now accepts "Submit" too, but only inside "Proposal actions".
2. **Address labels.** The labels "Province / State" and "Postal / ZIP Code" are on the proposal create form, not the organization create form the cited lines belong to. I opened `/organizations/create` and it still reads "Province or state(required)" and "Postal code or ZIP code(required)". So I put the patterns into two shared patterns that accept both the old and new wordings. Every alias in the organization field map uses them, and so does the proposal form's field list, which is where the real fix was needed.
3. **Default organization.** The chooser now counts as empty when it reads "Select an item", "Organization" or nothing. A test that names no organization gets the first one offered.
4. **Street lines.** Both address lines are now chosen by position among the boxes labelled for a street: the first box is line one, the second is line two. On the live form, line-one aliases filled "Street Address(required)" and line-two aliases filled the plain "Street Address" box, without either overwriting the other.

**Two extra fixes on the same page:**
- **Terms boxes.** The patterns for ticking the two terms boxes only knew "I accept the … terms", so they could no longer find the new boxes. That would have broken accepting the terms and submitting. They now accept the "I acknowledge … agree to the … Terms" wording as well as the old one. The field-error reader skips those lines the same way.
- **Cancel.** The create form's cancel looked for "Cancel" in "Proposal actions" or "Save choices", neither of which exists there any more. It now falls back to the "Opportunity and actions" panel, and then to the main area.

**The unbound reasons quoted from calibration** ("no 'An individual' choice under 'Who is submitting this proposal?'", "no 'Submit proposal'") come from an older adapter's wording. The current one already accepted "Individual" / "Organization", and I confirmed that its way of clicking the radio ticks "Individual" on the live page. With the submit pattern now accepting "Submit", nothing should stop those tests on these members any more. `bindings.yaml` already lists every `proposal-cwu-create` member as bound, so I left it unchanged.

I didn't change anything outside `tests/adapters/new/`, and every route I visited resolved. As the ruling says, the earlier walk left a saved draft by test-vendor-2 on the seeded published Code With Us opportunity. Resetting the target's seed isn't this stage's work, but it should be done before the next verify run.