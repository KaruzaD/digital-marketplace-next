# 0081 · The qualification tabs and the program terms pages follow the chosen direction

- Status: accepted for the build (slice 13, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 13's screens. These are the management page's
two qualification tabs (`organization-edit`: `swu-qualification`, `swu-qualified`,
`twu-qualification`, `twu-administrator`, `service-areas-editing`) and the two program terms pages
(`organization-swu-terms` and `organization-twu-terms`: `default`, `accepted`, `administrator`).
DESIGN.md's "Organization screens in the chosen direction" says how, building on
`organization-kit.tsx`. Until now these screens used `Stack`, full-size headings, the circular
outlined badge for Met and Not met, and an inline-styled card round the terms. The qualified
marks on the organization list and a vendor's own organizations were already restyled with those
screens (0079, 0080). The management page's head, with the green qualified labels, was restyled
too.

## Decision

- **The kit grows the last two pieces once.** `frontend/src/app/organization-kit.tsx` now also
  holds `Requirements` (the requirement list, each item starting with a `Label`: "Met" green, "Not
  met" yellow, always in words) and `TermsPage` (the organization's name in small secondary text
  over the H1, the acceptance line, any refusal, the terms in a `Panel` carrying
  `organization-terms-body`, then what the viewer may do).
- **The tabs take the stories' layout.** Each tab is a `Region` under its H2 in the H4 size. The
  not-qualified notice comes first, then the requirements. Approved service areas and Terms and
  conditions are H3 regions, with body copy as the direction's `op-text` and the areas as `op-list`.
  Edit service areas sits in `Actions`. The editing state shows only the tab's heading and the
  areas region: the sentence, the checkbox group, Save and Cancel, and a `SaveStatus`.
- **The terms pages take the stories' layout.** Accept and Cancel follow the sentence about what
  accepting means, `medium` apart. Where Accept is not offered, "Back to the organization" is a
  single secondary action. Loading is the direction's `Waiting`, "Loading terms and conditions".
- **Kept where the stories differ, for a stated reason.**
  - The terms text is the service's own page body, rendered by the one formatted-text renderer
    (0053), where the story shows a placeholder.
  - An organization administrator who is not the owner still reads "Only the organization’s owner
    can accept them." and is not offered Accept (0053). The design's gap 12 offers Accept to both,
    but the service refuses anyone except the owner.
  - The refused-acceptance alert and the refused-save alert are `PageAlert`s with their title in
    the alert's title markup, as the other organization screens' alerts are.
  - Saving service areas reports "Service areas saved." in a status region that stays on the tab
    after the form closes. DESIGN.md asks that this immediate change be announced in a
    `role="status"` region, and the story's own region goes away when the form closes.

## Consequences

No test ID, wording or behaviour changes, beyond two additions: the status line after saving
service areas, and the loading line, which now reads "Loading terms and conditions" through
`Waiting`. Headings are smaller: tab headings are in the H4 size, H3s in bold body text, and the
H1 is in the H3 size.
