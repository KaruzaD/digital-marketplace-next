| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T11:03:39.980Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 3 (A person can keep their own profile, picture and notification choice) do what its criteria say?

**Recommendation.** No test ID, wording or behaviour changed.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

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

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 3 (own profile, picture and notification choice) still do what its criteria say after this restyle? Approve. Verify is pass-unasserted against the current tree c02d0d9: 23 of the 24 claimed criteria passed and none failed. The only criterion never put to the application is R-8.16, which says an upload's working copy is written on the server and then removed. Its not-testable reason is real: nothing the service sends back shows that working directory, and only reading the server's filesystem could check it. This change does not touch upload handling, so accepting the slice with R-8.16 unasserted adds no risk. The diff is limited to app/ and docs/decisions/ (plus the verify-written results file). It changes only how slice 3's screens look and keeps the test IDs, wording and behaviour that decision record 0023 depends on: the status label stays on the person's own profile (R-4.1) and the scope sentence stays on the notifications section (R-6.16). Restyling the administrator's view is justified because it is the same page, and its controls do not change. No protected path is touched, and there are no secrets or real personal data (fixtures use placeholder names and example.test addresses). Thirteen new unit tests cover the new shared user-kit pieces, focus handling and layouts. Returning focus to the checkbox after unsubscribing uses a setTimeout and a lookup by test ID, which is fragile but tested and correct. The ruling would change if the verify result became stale against a newer tree or any slice-3 criterion failed.

**Conditions:**
none
