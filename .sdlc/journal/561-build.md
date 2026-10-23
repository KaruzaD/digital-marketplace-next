---
stage: "build"
title: "build slice 3"
at: "2026-10-18T11:03:39.811Z"
cost: 4.0172752
turns: 88
session: "f8fa2836-25df-42f3-9d99-b92e7ee54d27"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I've restyled slice 3's screens to match the design catalogue approved at G-DESIGN. No test ID, wording or behaviour changed. `npm --prefix app run check` passes: 862 backend tests, 611 frontend tests and every package's typecheck. I couldn't look at any page in a browser, so the layouts are checked by unit tests, not by eye.

Slice 3's criteria were already built and recorded in decision records 0021 and 0023. This pass changed only how the screens look, so each criterion is still reached the way 0023 describes.

**What changed**
- **Shared profile pieces.** I added them once to `app/frontend/src/app/user-kit.tsx`, following the catalogue's user kit:
  - the account's status as a coloured label, green for Active and grey for Inactive;
  - the section links, drawn as the manage page's tabs;
  - the account facts as labelled values ("Account type", "Status", "Account ID"), with their test IDs on the values;
  - the Details section;
  - the capability rows;
  - an empty status message area that announces the result of a save.
- **The profile page** (`app/frontend/src/screens/user-profile.tsx`):
  - **Profile view and editing:**
    - The H1 now uses the smaller H3 size.
    - Below the tabs and the facts comes the Details section, with Edit profile as the page's only primary button.
    - While editing, "Edit your details" holds the picture picker and the fields in a grid. The error summary is the kit's, with its title now visible, and it takes focus.
    - Permissions and "Deactivate your account" are sections of their own.
  - **Capabilities, legal, notifications and the unsubscribe landing:**
    - Capabilities are bordered rows, each with its checkbox and description toggle on one line.
    - The legal page is three sections.
    - The notifications section and the unsubscribe landing follow their stories. When opened from an unsubscribe link, the page waits under "Notifications" and says "Loading your notification settings…".
    - After Unsubscribe is pressed, focus goes back to the cleared checkbox.
- **The picture picker** (`app/frontend/src/app/image-picker.tsx`) now matches the catalogue's picture group:
  - the refusal's title is now visible, and the refusal takes focus with a visible outline;
  - the stated rule carries `image-file-rule` on the paragraph itself.

  It carries its own small style sheet because the organization form uses the same picker for a logo. It is also the picker on the sign-up completion page.

**Where I departed from the stories, and why** (recorded in `docs/decisions/0077-…`):
- **Status on your own profile.** The status label stays there, although the story shows status only to administrators. The contract lists `profile-status-badge` on `/users/me`, and decision 0023 keeps it there for R-4.1.
- **The line naming whose profile it is** stays above the facts, as 0023 has it.
- **The sentence saying what the email setting covers** (R-6.16) appears on the notifications section however it is reached. The profile's own notifications story leaves it out; the unsubscribe landing's story has it.
- **The administrator's view of someone else's profile** is restyled too. What its controls do belongs to slice 4, but it is the same page and uses the same pieces.

**Tested.** `app/frontend/tests/slice-three-screens.test.tsx` adds 13 tests. They cover:
- the user kit pieces;
- the picker's layout, and focus on its refusal;
- the own profile in view and edit, and a public sector employee's Permissions section;
- the capabilities and legal layouts;
- the unsubscribe landing's wait and the focus after unsubscribing;
- the administrator's view.

All earlier tests pass unchanged.

**Left for other slices.**
- **Organizations section:** the profile's organizations section keeps its older layout. Its stories belong to the organizations domain.
- **Sign-in wait:** the wait screen shown while the sign-in check runs is unchanged; it is slice 2's.
- **User list:** the user list's phone cards and export dialog layout are still to be added to the user kit when the user list (slice 4) is restyled.

I changed nothing outside `app/` and `docs/decisions/`.