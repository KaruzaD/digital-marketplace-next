---
stage: "build"
title: "build slice 6"
at: "2026-10-19T03:01:34.624Z"
cost: 1.3414104000000002
turns: 36
session: "374af4af-2c36-427e-b21b-6bb76ff90ef2"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

Slice 6 was already working, so this run only restyled its screens to the approved catalogue. One section needed changing: the "Notify vendors of updated terms" section on the terms page's managing screen. No behaviour, wording or test ID changed. `npm --prefix app run check` passes for all three packages. I couldn't look at the pages in a browser here, so the new look is proven by unit tests only.

**Where the slice's criteria are reached in the app**
- **R-7.13:** the announcement is offered only on the managing screen for the page at `terms-and-conditions` (`/content/terms-and-conditions/edit`). That screen is for administrators only.
- **R-6.23:** the administrator is asked to confirm first. Confirming sends `POST /api/emailNotifications` with the tag `updateTerms`.
- **R-6.24:** the service withdraws every vendor's acceptance and answers before any email goes out. The success message claims no more than that.
- **R-6.18 and R-6.28:** each active vendor gets their own email naming all three programs. A vendor with no address is skipped, and one the mail server can't reach is logged and passed over while the rest still go. All of this is backend work from the original build.
- **R-4.16 and R-4.33:** the vendor's legal section sets out the privacy policy, the terms with the date and time they agreed, and the three programs' terms. Only the vendor sees it. When their acceptance has been withdrawn, it shows the "terms have changed" warning and lets them agree again.

The rules and reasons for all of this are in decision record 0027.

**What changed:** `app/frontend/src/screens/terms-broadcast.tsx` is now drawn the way the catalogue's `TermsBroadcastPage` draws it:
- It is a region under the heading "Notify vendors of updated terms", placed after the "Current wording" region.
- The success or failure message comes first, then the two explanatory sentences.
- The button is secondary and sits in the shared actions row, so it goes full width on a phone. Edit page stays the screen's only primary button.
- It reuses the shared kits already in `app/frontend/src/app` (`Region`, `Actions`, the notification style sheet), so nothing new was added there.

The rest of that screen and the legal section had already been restyled in slices 5 and 3 (records 0087 and 0077). I compared the legal section with its stories and it matches region for region, so I left it alone.

**One place I didn't follow a story:** the `terms-updated` story draws the legal section without the profile section links. DESIGN.md gives no reason and no criterion asks for it. Taking them away would leave the vendor no way to reach their other profile sections from that page, so I kept them. Record 0088 says so.

**Tests:** I added one to `app/frontend/tests/changed-terms.test.tsx`. It checks that the broadcast is a region with that heading, that it comes after "Current wording", and that its button is a secondary button inside the actions row. The existing tests for this slice (which page offers it, who may use it, confirm/cancel, success and failure, re-agreeing) still pass.

**Records:** I added decision record 0088. `app/compose/compose.yaml` already publishes the app at port 4300 and the identity provider's realm at port 8080, so I didn't touch it. Nothing outside `app/` and `docs/decisions/` needed changing, and the next slice should find nothing missing from this one.