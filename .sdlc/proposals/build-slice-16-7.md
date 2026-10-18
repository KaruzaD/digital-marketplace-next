---
gate: G3
question: "Does slice 16 (Opportunities close at their deadline, and a Code With Us one is scored and awarded) do what its criteria say?"
recommendation: "Slice 16's two screens that still had the old look now match the design catalogue: the Code With Us proposal page where staff score, disqualify and award a proposal, and the `/status` page."
opened: 2026-10-18T20:52:41.381Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 16 (Opportunities close at their deadline, and a Code With Us one is scored and awarded) do what its criteria say?

**Recommendation.** Slice 16's two screens that still had the old look now match the design catalogue: the Code With Us proposal page where staff score, disqualify and award a proposal, and the `/status` page.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Slice 16's two screens that still had the old look now match the design catalogue: the Code With Us proposal page where staff score, disqualify and award a proposal, and the `/status` page. `npm --prefix app run check` passes in every workspace (frontend 634 tests, backend 862). I could not open either page in a browser here, so the look is checked by unit tests, not by sight.

**Behaviour was already in place.** An earlier run of this slice built everything its 12 criteria need, as decision record 0060 describes:
- the deadline hook in front of `/api` and `/status`, which closes lapsed opportunities in all three programs and sends the notices to the opportunity's author or evaluation panel;
- scoring, disqualifying with a reason, the automatic move to processing, and the award;
- the winner on the public opportunity page, and the vendor's own score and rank once the decision is made;
- proposal history, and the submit, award, decision and withdrawal notices.

I changed none of that.

**What I restyled:**
- **The proposal page staff evaluate from** (`app/frontend/src/screens/proposal-cwu-view.tsx`) now uses the shared proposal and opportunity components from slices 7 and 14, in the order the catalogue shows: the heading with the proponent's name and a coloured status label, the details, the Score section, the "Printable copy" link, the action buttons, the tabs, then the tab's content. The loading state follows the catalogue too.
- **The action buttons and the three dialogs** (`proposal-evaluation-actions.tsx`) now use the catalogue's markup. When nothing can be done, the button area is empty; the sentence "There is nothing to do with this proposal now." is gone. When a score or disqualification reason is refused, focus moves to that field and what was typed stays, as the "invalid" catalogue states require. A refusal from the service now takes focus as it appears, as on the vendor's proposal page.
- **The `/status` page** is now the catalogue's page: a "Service status" heading and one sentence, with its existing test IDs.

The remaining states of this slice already matched their catalogue entries from earlier restyles: the awarded opportunity page (decision 0071) and the vendor's awarded proposal page (decision 0072). `proposal-evaluation-request` is a description of an API answer and has no screen. Every test ID is kept.

**Effect on the other two programs.** The Sprint With Us and Team With Us proposal pages use the same buttons and score dialog. So they have also lost the "nothing to do" sentence, and their dialogs now look like the catalogue's even though those pages themselves have not been restyled yet. Because those pages don't load the proposal components' styles, the score dialog loads them itself. I chose not to load those styles on every page instead: one of their rules would change spacing on screens this slice doesn't own.

**Tests.** I added unit tests for:
- the page's frame and the order of its sections;
- the empty button area when nothing can be done;
- focus moving to a refused score (with "104" still in the field) and to a missing disqualification reason;
- the loading state;
- the `/status` page's layout.

The reasons for these choices are in `docs/decisions/0082-the-code-with-us-evaluate-page-and-service-status-follow-the-chosen-direction.md`.

**Nothing left out.** No criterion in this slice needed a change outside `app/` or `docs/decisions/`, and none went unbuilt. For the next slice: the Sprint With Us and Team With Us proposal pages that staff evaluate from (`proposal-team-view.tsx`) still use the old layout. They will be restyled with those programs' scoring stages, and once they use the shared page component, the score dialog's own copy of the styles becomes redundant.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Question: does slice 16 do what its 12 criteria say, with nothing beyond them? The verify result was recorded against this proposal's application tree (27e810c), and every claimed criterion passes: R-1.1, R-1.19, R-1.26, R-1.27, R-2.26, R-2.27, R-2.32, R-2.33, R-2.34, R-2.36, R-5.20 and R-6.25. So the only question left is the rest of what a merge answers for, and the diff answers it. It touches three screens and changes only how they look. proposal-cwu-view.tsx moves onto the shared proposal and opportunity components in the catalogue's order. proposal-evaluation-actions.tsx gets the catalogue's button bar and dialog markup, and a refused field now takes focus. service-status.tsx becomes the shared opportunity page. No rule, service call, state change or notice is altered, and every test ID is kept, which is why the acceptance suite still passes unchanged. The components it imports (ProposalActions, ProposalStyles, Focused) already exist in app/frontend/src/app/proposal-kit.tsx. No secret, credential or personal data appears in the code. Unit tests cover the new seams: the order of the page's sections, the empty button bar when nothing can be done, focus moving to a refused score and to a missing disqualification reason, the loading state, and the /status layout. One change reaches outside this slice's screens: the Sprint With Us and Team With Us evaluate pages share the button bar and score dialog, so they also lose the sentence 'There is nothing to do with this proposal now.' Decision record 0082 states this. It matches the earlier removal of the same sentence from the manage page (decision record 0072). No acceptance test or adapter reads that sentence. The score dialog loading its own copy of the proposal styles is a stopgap until those two pages are restyled, and 0082 explains why the alternative was rejected. I would return this if verify were re-run on a changed tree and anything failed, or if a criterion turned out to depend on the removed sentence or on the old layout.

**Conditions:**
none
