| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T18:45:29.241Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 12 (An organization can build its team) do what its criteria say?

**Recommendation.** I restyled slice 12's screens to the catalogue approved at G-DESIGN.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 12's screens to the catalogue approved at G-DESIGN. Nothing changed in behaviour, wording or test IDs, except two additions described below. `npm --prefix app run check` passes in all three workspaces (backend 862 tests, migrations 627, frontend all green), including seven new tests in `app/frontend/tests/team.test.tsx`.

## What I found

Slice 12 had already been built and revised (decision records 0050–0052). The backend, the invitation messages, the accept and decline links from the invitation email (R-3.35), and the notification-settings footer with no unsubscribe offer (R-6.16) were all there and tested. R-3.6, R-3.15 and R-3.23 are built in slice 11 and unchanged. So every criterion on the list was already reached. What was out of date was the look: these screens still used `Stack`, full-size headings, inline-styled tables, a round outlined badge and `Text`, while slice 11's own screens had been redrawn on the shared organization kit.

## What I did

- **Shared pieces, written once.** I added the catalogue's team pieces to `app/frontend/src/app/organization-kit.tsx`: the membership labels (Owner, Administrator and Member grey, Pending yellow, keeping the owner and pending badge test IDs), the row commands, the team rows, the changelog rows, a titled page alert, the small dialogs' body and a status region. A new `app/frontend/src/app/organization-memberships.tsx` holds the owned and affiliated lists. Every list is a table on a wide screen and stacked cards on a phone. The switch uses the header's existing narrow-screen check, so each row and its test IDs appear once.
- **Team members tab** (`organization-team.tsx`):
  - The tab is a section under a smaller heading.
  - Any invitation alert comes first, then the team size, then Add team members as the one primary button. It is grouped with Change owner where a service administrator is offered that.
  - The rows follow, then Team capabilities as a sub-section.
  - All four dialogs now follow the stories' layout.
- **Changelog tab.** It uses the new changelog rows; the empty sentence is unchanged.
- **Organizations section of the profile** (`user-profile.tsx`). The two lists are sections built from the new rows, with the stories' empty states and confirmation dialogs. It keeps the profile's own heading and section links, which match the story's "My Organizations" head. The loading state now says "Loading organizations", as the story does.

## Where I kept the existing build over the stories

Each of these was an earlier fix for a failed check, so I kept it and recorded the reason in a new decision record, `docs/decisions/0080`:

- **Capability summary.** It still lists only the capabilities the team holds, with a separate "Capabilities the team does not have" section (0052, R-3.34). The story's single held/not-held list would name a capability that only a pending invitee holds inside the summary.
- **Remove on the owner's row** stays (0052, R-3.11).
- **Change owner** keeps its second confirming step (0052).
- **Invitation outcomes.** Refusals and unregistered-address warnings stay wrapped in one `field-error` element (0052).

## Two additions

Withdrawing administrator rights and approving an invitation now announce "Administrator rights removed from <name>." and "<name> has joined the team." in the status region the team stories place after the tab. Before, nothing announced these immediate changes.

## Tests added

- membership words and label colours
- the tab drawn as a section, with the coloured labels
- the status announcement after withdrawing rights
- phone cards for the team, the changelog and both membership lists, each keeping its test ID

## What I could not do

I could not look at any page: there is no browser here, so the phone and desktop layouts are proven only by unit tests reading the markup. I changed nothing outside `app/` and `docs/decisions/`.

## For the next slice

Slice 13's qualification tabs still use their old look. The catalogue's requirement list (the Met / Not met labels) is not yet in the app's organization kit; it should be added there when those tabs are restyled.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Does slice 12 do what its criteria say? Verify recorded a fail against tree febd809, and an approval is refused while it stands. All 19 criteria the slice claims passed. The diff is the restyle the proposal describes: test IDs and wording unchanged, the two status announcements added, the four kept differences recorded with reasons in decision record 0080, and nothing outside app/ and docs/decisions touched. Both failures are in other slices' criteria, and the evidence points at the adapter in each case, not at this build. R-3.28: the page as it failed shows 'Approved service areas' listing exactly Agile coach and Full stack developer and not Data professional, which is the state the setup poll expected. Because an 'Edit service areas' button was present, the serviceAreaCheckbox read skipped that list and read ticked boxes in the edit form instead, and that read did not match. R-8.31: the outline at failure is still the CWU management page with Edit, Submit and Delete all disabled, meaning the deletion was in flight. The screenshot taken later is the dashboard, so the deletion did complete. deleteOpportunity returned before the delete finished, and the file read that followed ran ahead of it. This returns to build with nothing for build to change. The ruling would become an approval once bind-adapter has fixed both bindings and a current verify for this proposal is green.

**Conditions:**
- addressed-to bind-adapter: R-3.28: organizationEdit.serviceAreaCheckbox, read as the administrator on /organizations/<id>/edit with the Team With Us qualification section closed, did not report the approvals the page shows. .sdlc/evidence/slice-12/R-3.28.png shows the region 'Approved service areas' listing exactly 'Agile coach' and 'Full stack developer', with an 'Edit service areas' button beneath it. Because that button is present, the member skips the listed approvals and opens the edit form to read ticked checkboxes, and that read did not yield both areas. Read the approvals from the 'Approved service areas' list whenever the form is not already open, whether or not an 'Edit service areas' button is offered.
- addressed-to bind-adapter: R-8.31: opportunityCwuEdit.deleteOpportunity returned before the deletion had finished. The outline captured at failure (.sdlc/evidence/slice-12/R-8.31.txt) is still /opportunities/code-with-us/<id>/edit, with the Edit, Submit for review and Delete actions all disabled, meaning the delete was still in flight. The screenshot taken afterwards (.sdlc/evidence/slice-12/R-8.31.png) is the Dashboard, so the deletion did complete. The fileDownload read that followed ran before the delete finished and was let through. After confirming the delete, wait until the management page has been left (the URL is no longer the opportunity's edit page) before returning.
