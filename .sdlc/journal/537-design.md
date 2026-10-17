---
stage: "design"
title: "design organizations"
at: "2026-10-17T22:35:37.341Z"
cost: 8.231425999999997
turns: 148
session: "27d95e4d-e29b-4cac-951a-f948896c705f"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I brought the organizations domain into the chosen direction and drew the two pages in the brief that had no screens yet. The catalogue was not compiled or scanned during my turn: there are no installed packages here, so the typecheck could not run. The pipeline's scan after this turn is the first check of this work. The last report in the workspace was clean for every organization story, but that was the old version of them.

**What I built.** All 65 organization stories now render inside `SitePage`, each with the person who sees that state and the current section. They are laid out with the opportunities domain's kit (`OpportunityPage`, `PageTitle`, `Region`, `Panel`, `Details`, `DataTable`, `Actions`, `Waiting`, `MissingPage`), `marketplace.tsx`'s `Label` and `look`, `proposal-kit.tsx`'s `AlertTitle`, and the users domain's `ProfileTabs` and shared profile sections. I did not use `statusOf` or `StatusLabel`, because no organization screen shows an opportunity. Two new files hold this project's own compositions, and both are listed in `DESIGN.md`:
- `organization-kit.tsx`: the management page's head and tabs, the profile fields read-only and as a form, the team, list and changelog rows, the requirement list, the pagination, the terms page and the response reference.
- `organization-memberships.tsx`: one memberships page used by both the `/users/me` address and the by-identifier address.

The stories keep no inline styles, no `PageContainer` and no colour values.

**The seven rules:**
- **Colour only for status.** The circular badge is now a `Label`. Pending and Not met are yellow, Met and the "qualified" labels are green, and Owner, Administrator and Member are grey.
- **Dense spacing.** The tighter spacing tokens and smaller type follow the opportunity screens.
- **One primary action per screen.** No screen has more than one.
- **Rows become cards on phones.** The organization list, team, memberships and changelog are tables on a wide screen and stacked cards on a phone. The switch is read in script, as the header's is, so each test ID appears once.

**Changes beyond restyling:**
- The dialog stories now draw the whole page behind the dialog instead of the single control that opened it.
- The three invitation alerts sit inside the full Team members tab.
- Four alerts had titles the design system silently dropped (gap 4 in the site shell section). Those titles now render: the two forms' problem lists, "2 invitations were not sent", and the refused-logo alert.

Every page keeps its states and words, and every test ID that was already filled stays on an element that does the same job.

**New pages.** `affiliation-removal-request` has two states: `default`, an accepted removal (R-3.10), and `sole-owner`, refused with the surface's own message (R-3.11). Its four test IDs were already filled in the surface; these are the first stories to emit them. `organization-request` has three states: `default` (registration accepted), `invalid` (R-3.22's "not-an-email") and `refused` (an organization administrator changing the profile, R-3.18). I filled its ten `null` test IDs (`organization-request-register`, `-change-profile`, `-archive`, `-accepted`, `-refusal-status`, `-refusal-reason`, `-refusal-messages`, `-organization-id`, `-stored-active`, `-stored-legal-name`), and each appears in a story. Both pages are added to `screens.yaml`, keeping every existing entry. `DESIGN.md` has a new section, "Organization screens in the chosen direction", appended after the existing ones.

**Gaps recorded (48–56 in `DESIGN.md`):**
- **Request methods.** The surface names operations, not HTTP methods; the methods in the stories are my reading.
- **Refusal status codes.** No criterion gives the numbers. Only the accepted 201 comes from the surface.
- **Unworded messages.** The invalid-field and permission messages on `organization-request` are placeholders.
- **Undrawn cases.** The `notFound` refusal and a request sent with no session have no state, because no criterion turns on them.
- **Misplaced observations.** The five `legal-*` observations listed on the by-identifier memberships page are bound in the users domain's Legal section, not on this page. That looks like a slip in the contract.
- **Colours.** The status colours are the design's own choice; no criterion sets them.
- **Clashing test data.** `invite-open` invites an address belonging to someone already on the team behind the dialog. I kept the words as they were.
- **Viewers I chose.** Where a story named no viewer, I picked one and said so.
- **Phones.** No criterion says how the lists behave on a narrow screen.

I changed nothing outside `design/` and the `test_id` fields of `spec/contract/surface.yaml`.