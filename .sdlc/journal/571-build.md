---
stage: "build"
title: "build slice 13"
at: "2026-10-18T20:09:50.092Z"
cost: 2.3286305999999994
turns: 44
session: "df2ae336-c8fa-4902-9717-5028214d8f33"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I restyled slice 13's screens to match the approved design catalogue. Behaviour, wording and test IDs are unchanged apart from two small additions, and `npm --prefix app run check` passes for every workspace.

**What this run was.** Slice 13 had already been built (decision record 0053), so this pass only changes how its screens look. The service side of R-3.25 to R-3.28 is untouched: the requirement checks, accepting the program terms once, refusing a second acceptance, and service-area approvals that only an administrator may set and that replace the earlier ones when saved. The qualified marks on the organization list and on a vendor's own organizations section were already restyled with slices 11 and 12 (records 0079 and 0080), and they still use the same test IDs.

**Shared pieces.** I added the two pieces the slice still needed to the shared organization kit (`app/frontend/src/app/organization-kit.tsx`), once, so the screens don't each draw their own:
- **Requirement list:** each item starts with a "Met" label in green or "Not met" in yellow, always in words.
- **Terms page frame:** the organization's name in small grey text above the page heading, the acceptance line, any refusal, the terms text in a bordered panel (`organization-terms-body`), then the buttons.

Both screens now use the shared page frame, regions and button rows, so they no longer set their own spacing or use the old circular badge and inline-styled card.

**Qualification tabs** (`/organizations/<id>/edit?tab=swu-qualification` and `twu-qualification`), in `screens/organization-qualification.tsx`:
- Each tab is a region under its heading, in the stories' order: the not-qualified notice, the requirements, then the approved service areas and the terms as sub-regions.
- "Edit service areas" is offered to a service administrator only. While editing, the tab shows only the checkboxes with Save and Cancel, as the `service-areas-editing` story does.

**Terms pages** (`/organizations/<id>/sprint-with-us-terms-and-conditions` and `…/team-with-us-terms-and-conditions`), in `screens/organization-terms.tsx`:
- The owner sees the sentence about what accepting means, then Accept and Cancel.
- Anyone else, or anyone once the terms are accepted, sees a single "Back to the organization" button.
- The loading state uses the design's shared waiting indicator.

**The two additions:**
- After saving service areas, a status line says "Service areas saved." The design asks for this change to be announced, but the story's status line disappears when the form closes. Mine stays on the tab, so the message survives.
- The loading line now reads "Loading terms and conditions".

**Where I kept the earlier behaviour over the stories** (recorded in the new decision record 0081, `docs/decisions/0081-the-qualification-tabs-and-terms-pages-follow-the-chosen-direction.md`):
- The terms text is the service's own page, not the story's placeholder.
- Accept is still offered to the owner only. The design's gap 12 would offer it to organization administrators too, but the service refuses them (record 0053).
- The refusal messages use the alert style the other organization screens use.

**Tests.** The existing qualification tests in `app/frontend/tests/qualification.test.tsx` still pass. I added tests that check:
- the Met and Not met labels and their colours;
- the tab's region and its Terms and conditions sub-region;
- the terms page's name line, heading and panel, with a single Accept button;
- the "Service areas saved." status line.

Before checking I had to install the app's dependencies with `npm ci`. I couldn't start the app or look at a page here, so nothing has been checked visually. The compose file is unchanged and still publishes the app at :4300 and the identity provider's realm at :8080.

**Not done.** Nothing in the slice was outside what I'm allowed to change. I also updated `app/README.md` to describe where the qualification tabs and terms pages live. Every organizations-domain screen through slice 13 is now restyled, so the next slice inherits a complete organization kit.