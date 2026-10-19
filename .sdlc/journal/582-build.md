---
stage: "build"
title: "build slice 20"
at: "2026-10-19T03:45:05.974Z"
cost: 2.0283071999999995
turns: 36
session: "e542b653-d17f-41fd-a2d6-b9d17ec39f56"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

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