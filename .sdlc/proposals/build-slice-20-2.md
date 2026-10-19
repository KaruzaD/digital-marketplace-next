---
gate: G3
question: "Does slice 20 (Staff can take away proposals and administrators can read an opportunity's full report) do what its criteria say?"
recommendation: "I restyled slice 20's screens to match the design catalogue approved at G-DESIGN."
opened: 2026-10-19T03:45:06.103Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 20 (Staff can take away proposals and administrators can read an opportunity's full report) do what its criteria say?

**Recommendation.** I restyled slice 20's screens to match the design catalogue approved at G-DESIGN.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I restyled slice 20's screens to match the design catalogue approved at G-DESIGN. The slice's behaviour was already built (decision record 0066), and none of it changed. `npm --prefix app run check` passes: typecheck plus 1,536 unit tests across the three packages.

**What the slice covers**
- **R-2.37, printable copy of one proposal:** at `/opportunities/<program>/:opportunityId/proposals/:proposalId/export`.
  - Staff reading a Sprint With Us or Team With Us copy see "Proponent 1" until the proposal reaches the code challenge (or, for Team With Us, the challenge). The vendor always sees their organization's name.
  - A visitor, or anyone the service won't show the proposal to, gets the shared missing page.
- **R-2.38, all proposals in one document:** at `/opportunities/<program>/:opportunityId/proposals/export`.
  - A vendor is refused without the service being asked.
  - Staff and administrators get every submitted proposal, never drafts. The "Name proponents anonymously" checkbox puts `?anonymous=true` in the address, so that version can be reopened or shared.
- **R-1.40, full report:** at `/opportunities/<program>/:opportunityId/complete`. Only administrators can open it; everyone else, the opportunity's own author included, gets the missing page and nothing is asked of the service.

**What the restyle changed**
- **Layout pieces:** all three kinds of page are now built from the existing shared opportunity and proposal components in `app/frontend/src/app/`. The pages use the shared page frame, so they get the same width and spacing as every other screen. Every test ID from the stories and from `surface.yaml` is kept.
- **Shared components:** I extended two, once, instead of adding pieces per screen:
  - Section headings and regions now go down to levels 4 and 5, because the report nests a proposal's parts and their phases or questions under each proposal.
  - The proposal header can show its status with no `proposal-status` test ID, which is how the printable-copy stories draw it.
- **Printable copy:** the Back link and Print come first. The status moved from the facts list into the header as a label.
- **All-proposals document:** each proposal is its own bordered panel.
  - A Team With Us proposal now states its hourly bid ("$220.00 an hour", worked out as on its manage page) instead of an estimated contract cost.
  - A Code With Us proposal's text comes first under the heading "Proposal".
- **Report:** scores now show two decimal places ("91.50%"), and the Opportunity ID fact is gone, both to match the stories.

**Where I kept the app's version over the story** (recorded in `docs/decisions/0089-…`):
- **Status wording:** I kept the shared wording ("Under review: questions" where a story says "Under review: team questions") so it matches every other proposal screen.
- **Team With Us contract dates:** the report still shows them, because it is meant to hold the whole record.
- **Opportunity description:** it is still shown as formatted text rather than one plain paragraph.

**Tests:** I updated `app/frontend/tests/exports.test.tsx` for the two-decimal score and added tests for:
- the copy's status label having no test ID, and its parts being named regions;
- the Code With Us document putting "Proposal" first and leaving out the Proponent section when anonymous;
- the Team With Us document stating the bid;
- the report's header and History region.

I had to run `npm ci` under `app/` first because dependencies weren't installed; `node_modules` is git-ignored there.

**Not done or left open**
- I couldn't view the pages in a browser, so the visual result is checked only through unit tests.
- Nothing outside `app/` and `docs/decisions/` needed changing.
- The next slice won't find anything missing from slice 20.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Question: does slice 20 do what R-2.37, R-2.38 and R-1.40 say? Approve. The verify result is pass, recorded against the current application tree (9dd3fe7): all three criteria were exercised and met. The diff changes only how the pages look. The printable copy, the all-proposals document and the full report now use the shared opportunity and proposal layout components (ProposalPage, ProposalHead, OpportunityPage, Region, Panel, Details, Actions). The access rules (mayExportAllProposals, mayReadOpportunityReport, copyIsAnonymous), the addresses and every test ID are unchanged, so who may read what and when a staff copy says 'Proponent 1' are untouched. The one new figure, a Team With Us proposal's hourly bid, reuses the existing hourlyBid function from the manage page (rate times target allocation, adding up to $220.00 for the test's team), so it shows no new business rule. Changing scores to two decimal places and removing the Opportunity ID fact match the approved design stories. Neither weakens R-1.40's 'whole record', since the opportunity, its addenda, its history and every proposal are still present. Decision record 0089 records where the app keeps its own version over a story (status wording from the shared rules, Team With Us contract dates, formatted description), and none of these contradicts a criterion. The kit extensions are small and made once: heading levels 4 and 5, and a status label that can be drawn without a test ID. Unit tests cover them and the new layout (the status label with no proposal-status test ID, named sections, Code With Us 'Proposal' first, the bid, the report's header and History). No secrets, personal data or work from another slice. A small structural note, with no condition attached: proposal-export.tsx imports hourlyBid from the proposal-team-edit screen module; a shared rules or kit module would be its better home. The ruling would change if the verify result went stale or failed, if a test ID or access check was found to have moved, or if the bid calculation differed from the manage page's.

**Conditions:**
none
