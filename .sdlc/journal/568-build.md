---
stage: "build"
title: "build slice 11"
at: "2026-10-18T18:27:05.311Z"
cost: 2.7868304000000004
turns: 63
session: "e2f1e28c-30f2-455f-882f-11c267d233ad"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I changed no code in this revision. I couldn't find a defect in the application that the R-4.14 evidence points to, and I didn't want to make a change I couldn't tie to the failure.

**What the evidence shows.** The test read "Zinnia Quillfeather" as a vendor's name on `/users/me`. It then signed in as the administrator, opened `/users`, and waited 5 seconds for something that never became true. When it failed, the page was fully loaded: the screenshot and outline show all 160 or so accounts, every row carrying its status badge, account type, name link and administrator Yes/No. The order is right: active before inactive, public sector employees before vendors, then by name. "Active · Vendor · Zinnia Quillfeather · No" is there, and the seeded deactivated vendor, Ellis Placeholder, is last as "Inactive". All the `user-list-*` test IDs from the contract are on the right elements.

**What doesn't fit.** Comparing the list with the seed shows two vendors renamed during the run:
- Account …0201 (the `vendor` persona, seeded as Alex Placeholder) now reads "Aldous Quillfeather". The outline's link confirms the id.
- Finley Placeholder (…0206, the `file-uploader` persona) is missing, so it must be the account now called "Zinnia Quillfeather".

So the account the test read as Zinnia is not account 0201. The test would naturally sign in as the `vendor` persona, which is 0201. If it then looked up that account's row expecting "Zinnia", it got "Aldous" and timed out. That fits either of two explanations, and I couldn't settle on one:
- **Concurrent renames.** Other acceptance tests give shared personas made-up "… Quillfeather" names and ran alongside this one, possibly including slice 11's new ones. A test renaming 0201 while this one ran would break it, and the application can't prevent that.
- **The sign-in landed on the wrong person.** The vendor sign-in could have reused an earlier sandbox identity-provider session for test-vendor-6. I found no sign of that in the code:
  - Accounts are looked up by exact `idpId` (`backend/src/users/prisma-account.store.ts:73`).
  - `/users/me` shows the account from a freshly fetched session.
  - Saving the profile writes to the signed-in person's own id.
  - Sign-out and refused sign-ins both end the identity provider's session.
  - The list query is a single `findMany` with nothing slow behind it.

I didn't add `prompt=login` to the sign-in request to force a fresh identity-provider login every time. It would change sign-in for every criterion, and nothing shows it's the cause.

**Checks.** `npm --prefix app run check` passes: typechecks plus every unit-test package (16, 862 and 621 tests). The error lines in its output come from tests that deliberately exercise failure paths. Installing dependencies to run it only added `node_modules` under `app/`.

**Not mine to change.** If the cause is tests renaming shared personas at the same time, the fix belongs to the acceptance suite or the seed, not `app/`: give R-4.14 a vendor nobody else renames, or run tests that rename shared personas one at a time. If a re-run shows R-4.14 failing again with the vendor's own row reading a different name than its `/users/me` page did, the sign-in path is worth checking next.

**Slice 11.** I left everything else from slice 11 as it was. That covers the public organization list, registering an organization with its logo, the organization tab at `/organizations/:orgId/edit` with edit and archive for owners and administrators, the archive notice, the list of organizations a vendor may act for, and the image rules R-8.13, R-8.21, R-8.28 and R-8.30.