| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T02:48:19.251Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** I restyled slice 14's screens (the Code With Us proposal create page, its manage page and the vendor dashboard) to the design catalogue approved at G-DESIGN.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 14's screens (the Code With Us proposal create page, its manage page and the vendor dashboard) to the design catalogue approved at G-DESIGN. Every test ID is kept. `npm --prefix app run check` passes: 16 migrations tests, 862 backend and 564 frontend, including the axe accessibility checks on all three screens. I could not open a page in a browser here, so what is proven is what the unit tests check.

**What was built.** This was a restyle: the slice's criteria (R-1.35, R-1.36, R-2.1–2.4, R-2.12–2.15, R-2.23, R-4.23, R-6.2–6.5, R-8.22, R-8.31) were already built by earlier runs, and their behaviour is unchanged. Starting a proposal is still refused to anyone but a vendor who has accepted the terms, and a second proposal still sends the vendor to the first. Terms are still recorded on submit, and the deadline is still enforced by the service. Withdraw, resubmit, delete of drafts, history, and the dashboard's own and organization lists all work as before. No backend, mail or redirect code was touched, and the compose file was left alone.

**Shared pieces.**
- I added the catalogue's proposal kit once, as `app/frontend/src/app/proposal-kit.tsx`. It holds the status label and its colours, the head, the action bar, the tabs, the message that takes focus, the numbered form part, and the long form beside an opportunity summary that holds the actions. It reuses the existing site shell and opportunity kit, as the operator asked.
- The status badge already used by other screens is now the kit's coloured label.
- The shared attachment control can now be drawn as "3. Attachments" in the create page's own words.

**The create page** follows its story, in the original site's words:
- The heading "Create a Code With Us Proposal", then the three numbered parts.
- A summary in the fixed order (program, title, closing date, then reward, location and Remote OK) holding Submit, Save Draft and Cancel.
- An error summary, "Unable to Submit Proposal", which takes focus. Its list carries the new `proposal-field-errors` test ID.
- A "Review Terms and Conditions" dialog whose Submit Proposal button stays disabled until both boxes are ticked.

**The manage page** follows its stories: the head with the status label, the details, the links, an action bar that is always present (empty when nothing is offered), any message, the tabs, then the tab's sections. Edit turns the Proposal tab into the create page's layout, in the wording the editing story uses. **The dashboard** uses the kit's tables, with a grey program label and a coloured status label.

**Where I departed from the stories** (recorded in `docs/decisions/0072`):
- **Proponent choice:** it still starts unchosen, as an earlier record (0056) settled, though the stories draw Individual ticked.
- **Error messages:** they are still the shared validation messages, each naming its field ("Legal name: enter your legal name"), because the contract asks for the field and its message together.
- **Saving a draft:** it still lands on the manage page, because a second save from the create page would be refused as a second proposal. The manage page shows the story's "Draft Proposal Saved" alert. Focus goes to the new page's heading as on every page change, so the alert is announced rather than focused.
- **Evaluation criteria box:** left out, because the contract gives a Code With Us opportunity no evaluation criteria to put in it.
- **"You can format your proposal with Markdown":** left out, because the proposal is shown as plain text.

**Unit tests.** I updated one existing test whose check on the summary text no longer matched. New tests cover:
- the summary's facts, their order and its action order;
- the three numbered parts and the attachment wording;
- the focused error summary and its links to each field;
- the terms dialog's wording, button order and disabled state;
- the draft-saved alert after arriving on the manage page;
- the editing layout and its actions;
- the dashboard's grey and coloured labels;
- the status-to-colour mapping.

**What the next stages will find:**
- **Shared pieces restyled ahead of their own stories:** the history table and status label now look restyled on the Code With Us read-only page (slice 16), on the Sprint With Us and Team With Us manage and view pages, and on the opportunity's proposals tab. Those pages' own layouts are still the old ones.
- **Sprint With Us and Team With Us forms (slice 15):** the kit is ready for them. They still use the shared terms dialog in its "Submit your proposal" wording, which their stories also use.
- **`/proposals` page:** the catalogue redraws it, but I did not build it, because this slice's plan entry does not name it.

I changed nothing outside `app/` and `docs/decisions/`.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Does slice 14 do what its criteria say? Verify reports fail (7 pass, 11 not), so an approval is refused, but every failure traces to the adapter rather than the application. R-2.12 and R-2.15 read an empty status on the manage page. The saved outlines show the page rendering 'Code With Us Draft' in its head as the coloured status label, which carries the proposal-status test ID the contract binds status to. The adapter's proposalCwuEdit.status() reads a 'Status' entry in the details list instead, and the restyle moved the status out of that list into the head label. The nine unbound criteria (R-8.22, R-8.31, R-1.35, R-1.36, R-2.2, R-2.3, R-2.4, R-2.13, R-2.23) all stop in chooseProponent, which looks for a radio labelled exactly 'An individual' or 'An organization'. The create page now labels those radios 'Individual' and 'Organization' in the original site's wording, and they still carry the contract's test IDs proposal-proponent-individual and proposal-proponent-organization. The build itself stays inside the slice: behaviour unchanged, test IDs kept, departures from the design recorded in decision record 0072, unit tests covering the new kit. So the only conditions go to bind-adapter. The ruling becomes an approval when verify, rerun on this tree after rebinding, reports pass. If verify then fails on what the page actually shows, the build is returned.

**Conditions:**
- addressed-to bind-adapter: R-2.12: proposalCwuEdit.status() read "" from a 'Status' term in the details list on /opportunities/code-with-us/:opportunityId/proposals/:proposalId/edit; the page no longer has a Status term and shows the status as the label beside the program in the page head ('Code With Us Draft' in the outline), the element carrying test ID proposal-status, which is what the contract surface binds proposal-cwu-edit status to; read it from there.
- addressed-to bind-adapter: R-2.15: in the case 'a draft submitted after the deadline', proposalCwuEdit.status() read "" for the same reason: the manage page shows 'Draft' as the head's status label carrying test ID proposal-status, not as a 'Status' term in the details list; bind status to proposal-status as the contract surface says.
- addressed-to bind-adapter: R-8.22, R-8.31, R-1.35, R-1.36, R-2.2, R-2.3, R-2.4, R-2.13, R-2.23: proposal-cwu-create.choose_proponent_individual and choose_proponent_organization were reported unbound because chooseProponent looks for a radio named exactly 'An individual' / 'An organization' under 'Who is submitting this proposal?'; the create page now offers the radios labelled 'Individual' and 'Organization' under 'Will you be submitting a proposal for this opportunity as an Individual or Organization?' (the manage page's edit form keeps 'An individual' / 'An organization'), and both carry the test IDs proposal-proponent-individual and proposal-proponent-organization that the contract surface binds these members to; locate them by those test IDs, or by a label that accepts both wordings.
