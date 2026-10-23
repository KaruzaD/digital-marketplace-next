| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T03:05:41.571Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** Signed in as test-vendor-1, I checked every new pattern against the live create form for the seeded published Code With Us opportunity and each one matched.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

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

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does this adapter bind every surface action and observation on new, and nothing else? Ruling: approve. All four owed instructions from bind-adapter-new-97 are carried out in tests/adapters/new/index.ts. (1) The submit pattern accepts a bare 'Submit' only as a button's whole name, and the proposal screen's actions check accepts it too. (2) Shared PROVINCE_LABEL and POSTAL_LABEL patterns take both the old and new wordings for every alias in the organization field map and in the proposal field list. (3) CHOOSER_EMPTY treats 'Select an item', 'Organization' or an empty chooser as nothing picked. (4) Both street lines are picked by position among the boxes matching STREET_ANY. The two extra fixes, for the terms checkbox wording and the Cancel fallback to the 'Opportunity and actions' panel, are locators only. Nothing decides whether a test passes, nothing under tests/acceptance or bindings.yaml changed, and the runner's typecheck passed on f7b26f4 with no diagnostics. One change is missing from the proposal page: a proposalHeadStatus fallback for the status observation on the restyled manage page. It only reads text and runs only when no 'Status' term is shown, so it is within an adapter's remit, but the next revision's page should list it. Tier is STANDARD and no residual risk is unaccepted, so nothing escalates. What would change this ruling: a verify run showing that bare 'Submit' matches a button other than the form's own submit, or that the header status fallback reads a status the page does not show.

**Conditions:**
- condition-met bind-adapter-new-97#1: the proposal-cwu-create submit pattern now accepts a button named exactly 'Submit' as well as 'Submit proposal' and 'Save changes and submit', in tests/adapters/new/index.ts (ask() in the submit flow); the proposal-cwu-edit submit_proposal check accepts '^submit( proposal)?$' inside 'Proposal actions'; the terms-dialog confirm already accepted 'Submit Proposal'
- condition-met bind-adapter-new-97#2: PROVINCE_LABEL (/^\s*province\s*(or|\/)\s*state/i) and POSTAL_LABEL (/^\s*postal\s*(code|\/\s*zip)/i) replace the old patterns for every alias in ORG_FIELDS and in PROPOSAL_FIELDS, in tests/adapters/new/index.ts
- condition-met bind-adapter-new-97#3: completeProposal treats the organization chooser as empty when it reads 'Select an item', 'Organization' or nothing (CHOOSER_EMPTY), so a test naming no organization gets the first one offered, in tests/adapters/new/index.ts
- condition-met bind-adapter-new-97#4: street line one and line two are filled by position (nth 0 and nth 1) among the textboxes matching STREET_ANY, through streetLine() in the proposal field fill loop, in tests/adapters/new/index.ts

### Runner-owned typecheck evidence

Proposal revision: `f7b26f495755c0208a54bcbb7906149ca92e11ca`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
