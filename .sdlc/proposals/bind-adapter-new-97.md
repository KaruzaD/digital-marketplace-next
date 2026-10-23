---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I checked them by walking the running target at http://localhost:4300, but I couldn't run any test or even the type checker: the command that runs `tsc` needs an approval this session can't give."
opened: 2026-10-18T02:59:20.177Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I checked them by walking the running target at http://localhost:4300, but I couldn't run any test or even the type checker: the command that runs `tsc` needs an approval this session can't give.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've updated both members the three conditions name, in `tests/adapters/new/index.ts`. I checked them by walking the running target at http://localhost:4300, but I couldn't run any test or even the type checker: the command that runs `tsc` needs an approval this session can't give. `bindings.yaml` needed no change, because all the members involved were already listed as `bound`.

**Conditions 1 and 2 (the manage page's status).** I signed in through the identity provider as the vendor `test-vendor-2` and opened the create page for the seeded published Code With Us opportunity. I saved a draft there, which landed on that proposal's manage page. The page no longer has a "Status" term. Its head reads "Manage a Code With Us proposal", then "Code With Us" and "Draft" on separate lines, then the opportunity's title as the main heading. The only terms left are Proposal ID, Opportunity ID and Proposal deadline. `proposalCwuEdit.status()` still reads a "Status" term first, so the old page keeps working. When there is no such term, it now reads the head: the first line above the main heading that is a proposal status, on its own or after "Code With Us". It returns just the status ("Draft"), the same form the term used to give. A head with no status reads as empty. Only the draft state was seen live. The other status words it accepts (Submitted, Withdrawn, Under review, Evaluated, Awarded, Not awarded, Disqualified) were not.

**Condition 3 (choosing individual or organization on the create page).** The create page now asks "Will you be submitting a proposal for this opportunity as an Individual or Organization? (required)", with radios labelled "Individual" and "Organization" and neither ticked to start with. Pressing "Edit" on the manage page still shows "Who is submitting this proposal?" with "An individual" / "An organization". `chooseProponent` now finds the radio, and clicks its label, by a pattern that takes either wording; the label is what takes the click on this page. I checked both choices live. "Individual" shows the address fields. "Organization" shows the organization chooser, whose name still matches what the adapter looks for.

The conditions suggested locating these by their test IDs. I didn't, because the adapter may only find things by role, label, visible text or URL, and the separation check refuses test IDs. The label pattern is the other route the condition itself allows.

**Changes on the create page the conditions don't name, which I left alone:**
- **Buttons:** the form's buttons now read "Submit", "Save Draft" and "Add Attachment", not "Submit proposal", "Save draft" and "Add attachment". The R-2.13 failure that quotes `accept_program_terms` not finding "Submit proposal" comes from this.
- **Field labels:**
  - "Province / State(required)" and "Postal / ZIP Code(required)" will no longer match the adapter's patterns for "province or state" and "postal code".
  - The optional second address line is now labelled just "Street Address".
  - "Additional Comments" no longer says "(optional)".
- **Organization chooser:** it starts out reading "Organization", not "Select an item", so the step that picks a default organization when a test names none won't fire.

These will probably come up as the next failures for the same criteria.

One side effect: walking the page left a saved draft proposal on the target, made by `test-vendor-2` on the seeded published Code With Us opportunity (id `153ab0da-9880-4ba6-8bb7-e844ecb19d34`). A later run that expects that vendor to have no proposal there will be sent to this draft's manage page instead.

Every route I opened answered on the target. I touched nothing outside `tests/adapters/new/`, and nothing asked me to.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does the new-target adapter bind every surface action and observation on new, and nothing else? It does not yet, and the proposal says so itself. The three conditions from build-slice-14-4 are carried out. proposalCwuEdit.status() falls back to the manage page's head when there is no Status term, and chooseProponent accepts both 'Individual'/'Organization' and 'An individual'/'An organization'. Both changes only locate and read; the runner typecheck passed on adapters/new; nothing under tests/acceptance changed. Using the visible label instead of the suggested test IDs is the route the separation check requires and the one condition 3 offered. But the proposal names create-page changes it left unbound, and the adapter code confirms three of them. submit_proposal's button pattern (index.ts:10353, /^\s*(submit proposal|save changes and submit)\s*$/i) cannot match the button now labelled 'Submit', which is the R-2.13 failure the proposal cites, so the one criterion this proposal touches stays unexercisable. The address-field patterns (index.ts:6728-6738, /^\s*province or state/i and /^\s*postal code/i) cannot match 'Province / State(required)' or 'Postal / ZIP Code(required)'. The default-organization step keys on the chooser reading 'Select an item', which it no longer does. 'Save Draft' and 'Add Attachment' still match, since those patterns are case-insensitive. Returning now fixes these in one binding round rather than after another verify cycle. Separately, the walk left a saved draft by test-vendor-2 on the seeded published Code With Us opportunity, which can send later runs to that draft's manage page; the target's seed should be reset before the next verify. What would change the ruling: these bindings updated to the create page as walked, or each given a real unbound reason.

**Conditions:**
- R-2.13: the proposal-cwu-create submit binding (tests/adapters/new/index.ts:10353) only matches 'Submit proposal' or 'Save changes and submit', but the create page's form button now reads 'Submit'. Make the pattern also accept the bare 'Submit' on the create form, without loosening it so far that it matches unrelated buttons. Check the terms-dialog confirm (around line 10403) and the actions-row check at line 10703 against the page as walked too, and update them if they changed.
- The create-page address field patterns (tests/adapters/new/index.ts:6728-6738, /^\s*province or state/i and /^\s*postal code/i) do not match the labels now drawn, 'Province / State(required)' and 'Postal / ZIP Code(required)'. Accept those labels, as well as the old ones, for every alias mapped there.
- The default-organization step in the proponent flow waits for the organization chooser to read 'Select an item', but on the create page it starts out reading 'Organization'. Detect an empty chooser by its current form, so that a test naming no organization still gets one picked.
- The optional second address line is now labelled just 'Street Address', the same label as the first line. Make sure the street-address bindings choose the first and second fields by position, not by label alone, so neither fills the other.

### Runner-owned typecheck evidence

Proposal revision: `8b70e110cded2531c326eed6903de8db8e44b6bb`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
