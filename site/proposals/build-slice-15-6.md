| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T15:30:21.140Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 15 (A vendor can propose on Sprint With Us and Team With Us opportunities) do what its criteria say?

**Recommendation.** I restyled Slice 15's proposal screens to the approved design catalogue, following the operator's reason for this run.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled Slice 15's proposal screens to the approved design catalogue, following the operator's reason for this run. The slice's behaviour was already built in an earlier pass (decision records 0058 and 0059). It is unchanged, and so is every test ID. `npm --prefix app run check` passes: typecheck, then 16 migration, 862 backend and 617 frontend tests.

**What changed on screen**

- **Both create pages** (Sprint With Us and Team With Us) are now the catalogue's long form beside a summary of the opportunity.
  - The form comes in numbered parts. Sprint With Us has seven: Organization, Team, Capabilities, Cost, Team questions, References, Attachments. Team With Us has five: Organization, Team, Cost, Resource questions, Attachments.
  - The summary shows the program, title, closing date and maximum budget. It holds Submit proposal, Save draft and Cancel; on a phone it becomes a small card and the buttons follow the form.
- **Sprint With Us phases** now show:
  - one bordered row per team member, with a "Membership pending" label on a pending member;
  - the scrum master as one required choice among the phase's members;
  - the team-member picker, with the new test ID `proposal-team-member-choice`;
  - the requirements line in the catalogue's words;
  - each phase cost, and the total, in its own `proposal-cost` wrapper.
- **Team With Us resources** use the same rows, with the hourly rate inside each row.
- **Messages.** The error summary, the "already has a proposal" refusal and the unqualified-organization notice sit above the form and take focus when they appear.
- **Manage pages** now follow the restyled Code With Us manage page: head with status label, identifiers, links, the action bar (always present), any refusal, tabs, then the tab's sections. The organization is shown as "Legal name".
  - The Sprint With Us team table adds Membership and Capabilities columns, read from the organization's team when the vendor may read it. Otherwise it keeps just Team member and Scrum master.
  - The Team With Us table lists rates to two decimals and adds the story's "Bid: $N an hour" line.
- **Editing** shows the whole form under the manage head and tabs.
- **The Proposals tab** on all three programs' manage pages now uses the shared table component. No story draws that tab.

The shared kit (`app/frontend/src/app/proposal-kit.tsx`) gained the team rows, the picker-and-button layout, the dialog field width, and an optional `id` on the focused-message box. Each was added once there, not per screen.

**Decisions** (recorded in `docs/decisions/0078`):
- **A submitted proposal's edit form offers only Save changes and Cancel**, as the catalogue's `organization-locked` story draws it; drafts and withdrawn proposals still get Save changes and submit. This is the one change most likely to trip an acceptance test that presses `proposal-save-and-submit` on an already-submitted proposal, for example the Team With Us budget check (R-2.10) on edit. If that happens, the fix is the single `offerSubmit` line in `proposal-team-edit.tsx`.
- **Kept although the stories differ:** the references keep their Company field, because the service stores and checks it. The error summary keeps the service's own messages rather than the stories' sample sentences, as the Code With Us restyle did.
- **New wording:** a pending invitee is now offered as "Name (membership pending)", as the stories word it.
- **The empty-phase sentence is mine.** The requirements line uses the catalogue's two sentences, but "Name at least one team member." for a phase with nobody in it is mine, because no story draws that case.

**Tests.** I updated the existing frontend tests to the new wording, labels and two-decimal rates. I added tests for:
- the requirements sentence;
- the hourly-bid sum;
- the numbered parts and summary on both create pages;
- the three `proposal-cost` wrappers and the new picker test ID;
- the edit buttons offered to a submitted proposal versus a draft;
- the membership and capabilities columns in the read-only team table.

The accessibility (axe) check on the create page still passes.

**Not done, or not mine to do:**
- Nothing outside `app/` and `docs/decisions/` was touched.
- I could not look at the pages, since there is no browser here; the layout at phone widths is unchecked beyond what the shared kit already handles.
- The read-only evaluation proposal page shares the restyled team details. Its own frame still waits for the evaluation slices' restyle.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Verify reports fail on R-2.7, R-2.9, R-2.11, R-2.16, R-2.18, R-2.19 and R-2.22, so the build cannot be approved. Every failure traces to the adapter, not the application. The scrum master step (tickScrumMaster and onPhase, tests/adapters/new/index.ts:13448-13461) only matches a radio named 'Scrum master: <Name>, <phase> phase'. The restyled page draws the choice the way the approved catalogue story does (design/catalogue/proposal-swu-create.default.stories.tsx:99): a radio group named 'Scrum master for the <phase> phase (required)' holding one radio per member, named by the member alone and carrying the contract's proposal-scrum-master test ID. The evidence outlines (e.g. .sdlc/evidence/slice-15/R-2.7.txt lines 48-51) show exactly that. R-2.18's pending-member read was empty because pickListed (index.ts:13342) accepts only 'Name (pending)', while the page offers 'Quinn Placeholder (membership pending)', the catalogue's and DESIGN.md:4314's wording; the pending person was never added, so no proposal-pending-team-member mark could appear. DESIGN.md:3017-3020 still prescribes the 'Scrum master: Name, phase' aria-label the catalogue does not draw, which is the likely source of the adapter's stale name. Nothing in the evidence points at the application, so the builder is handed no change. The ruling changes to approval when a re-bound adapter lets verify pass on this tree; a failure that persists after re-binding is the build's.

**Conditions:**
- addressed-to bind-adapter: R-2.7: proposalSwuCreate.setScrumMaster threw 'Charlie Placeholder is not on the implementation phase's team' because tickScrumMaster (tests/adapters/new/index.ts:13451-13461) only matches a radio named /^scrum master: <name>,/; the page (.sdlc/evidence/slice-15/R-2.7.txt lines 44-51) shows Charlie Placeholder in the phase's team list and a radiogroup named 'Scrum master for the implementation phase (required)' holding a radio named 'Charlie Placeholder', with test ID proposal-scrum-master. Find the radio by the member's name inside the phase's 'Scrum master for the <phase> phase' radiogroup (or by proposal-scrum-master within the phase group), and change onPhase (index.ts:13448) to match the same way.
- addressed-to bind-adapter: R-2.9: same failure as R-2.7. proposalSwuCreate.setScrumMaster looks for a radio named 'Scrum master: Charlie Placeholder, implementation phase', but the page (.sdlc/evidence/slice-15/R-2.9.txt) names the radio 'Charlie Placeholder' inside the radiogroup 'Scrum master for the implementation phase (required)'.
- addressed-to bind-adapter: R-2.11: same failure as R-2.7. proposalSwuCreate.setScrumMaster looks for 'Scrum master: Charlie Placeholder, implementation phase', but the page (.sdlc/evidence/slice-15/R-2.11.txt) names the radio 'Charlie Placeholder' inside the radiogroup 'Scrum master for the implementation phase (required)'.
- addressed-to bind-adapter: R-2.16: same failure as R-2.7 for 'Blake Placeholder'. proposalSwuCreate.setScrumMaster looks for 'Scrum master: Blake Placeholder, implementation phase', but the page (.sdlc/evidence/slice-15/R-2.16.txt) names the radio 'Blake Placeholder' inside the radiogroup 'Scrum master for the implementation phase (required)'.
- addressed-to bind-adapter: R-2.18: proposalSwuCreate.pendingTeamMember read '' because addPhaseTeamMember never added the pending person. pickListed (tests/adapters/new/index.ts:13342) accepts an option only as '<Name>' or '<Name> (pending)', but the phase's chooser offers 'Quinn Placeholder (membership pending)', the catalogue's wording (design/catalogue/proposal-swu-create.default.stories.tsx:21, DESIGN.md:4314). Accept '<Name> (membership pending)'. The second R-2.18 case failed on the same scrum master name as R-2.7 (.sdlc/evidence/slice-15/R-2.18-2.txt: radio 'Blake Placeholder' in radiogroup 'Scrum master for the implementation phase (required)').
- addressed-to bind-adapter: R-2.19: same failure as R-2.7. setScrumMaster looks for 'Scrum master: <Name>, <phase> phase', but the page names each radio by the member alone inside 'Scrum master for the <phase> phase (required)' (.sdlc/evidence/slice-15/R-2.19.txt, R-2.19-2.txt, R-2.19-3.txt). The three cases verify did not describe (missing phase capability, phase cost over budget, total cost over budget) run through the same step; re-check them once it binds.
- addressed-to bind-adapter: R-2.22: same failure as R-2.7, on both proposalSwuEdit.setScrumMaster and proposalSwuCreate.setScrumMaster. The adapter looks for 'Scrum master: Blake Placeholder, implementation phase', but the create and edit forms (.sdlc/evidence/slice-15/R-2.22.txt, R-2.22-2.txt, R-2.22-3.txt) name the radio 'Blake Placeholder' inside the radiogroup 'Scrum master for the implementation phase (required)'.
- addressed-to design: DESIGN.md lines 3017-3020 say each scrum master radio carries an aria-label 'Scrum master: Test Designer, implementation phase', but the approved catalogue story design/catalogue/proposal-swu-create.default.stories.tsx (line 99 onward) draws a RadioGroup labelled 'Scrum master for the <phase> phase' whose radios are named by the person alone. The built screen followed the catalogue, and the test adapter was bound to the prose, which failed seven slice-15 criteria. Make DESIGN.md and the catalogue say the same thing.
