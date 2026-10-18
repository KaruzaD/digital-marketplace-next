# 0074 · The sign-in, sign-up, profile-completion, sign-out and notice screens follow the chosen direction

- Status: accepted for the build (slice 2, restyle)
- Date: 2026-10-18

## Context

Decision records 0069 and 0073 brought the site shell and slice 1's screens into the direction
approved at G-DESIGN. Slice 2's screens were still drawn in the older layout (`Stack`, the
design-system `Heading` and `Text`, and the inline `card` style): Sign In (`user-sign-in.default`),
Choose Account Type (`user-sign-up-choose-account.default`), Complete Your Profile
(`user-sign-up-complete` · `default`, `terms-accepted`, `invalid`, `save-failed`) and Signed Out
(`user-sign-out` · `default`, `loading`, `failed`). DESIGN.md's "User screens in the chosen
direction" says how they look, and draws them from `design/catalogue/user-kit.tsx`.

## Decision

- **A user kit in the app, started small.** `frontend/src/app/user-kit.tsx` holds the catalogue
  kit's `UserPage` (the opportunity frame with the kit's style sheet), `Choices`, `Group`, the field
  grid (`Fields`, the catalogue's `us-fields`) and `ErrorSummary`. The profile's pieces (section
  links, account facts, read-only details, capability rows, the list's cards, the save status) belong
  to slices 3 and 4's screens and are added there when those are restyled, as 0073 did for the
  content kit.
- **Sign In and Choose Account Type** are the stories: the H1 in the H3 size, the introduction, the
  two kinds of account as `Panel`s inside `Choices`, each button secondary in `Actions`, and the
  line linking to the other screen. Neither has a primary button.
- **Sent to sign in by a page,** the Sign In screen is `user-profile-self · sign-in-required` (and
  `notification-unsubscribe-landing · sign-in-required`): the info alert takes the introduction's
  place and the panels say only how each way in signs in. The "Don’t have an account? Sign up" line
  stays on this state too, although that story leaves it out: the contract offers `go_to_sign_up` on
  the sign-in page without naming a state, and the line costs the state nothing.
- **Complete Your Profile** is the stories: the refusal (`save-failed`), else the error summary
  (`invalid`, with its title now rendered and focused), else the introduction; then the picture, the
  username, name and email in the field grid, the notice choice, the terms links with the agreement
  box as one `Group`, the hint while the box is unticked, and Complete profile as the one primary in
  `Actions`. The `invalid` and `save-failed` stories leave out the terms links; the screen keeps them
  in every state, because the box is still asking the person to agree to what they link to.
- **The picture picker is unchanged.** `ImagePicker` is shared with the profile and the organization
  form and its words already match the story's group; its restyle is the profile's (slice 3).
- **Signed Out** is the stories, with the wait as the kit's `Waiting` row ("Signing you out…").
- **The notices** (`user-notice` · `default`, `sign-in-failed`) are restyled here as well, because a
  refused sign-in lands on `authFailure`: each notice's test ID is on an `op-region` holding its H1
  and sentences, and the actions follow in `Actions`. The deactivation notice's behaviour stays
  slice 3's; only its layout changed.

## Consequences

Every test ID is unchanged and on the same element. Headings are smaller than before (H1 in the H3
size, panel headings in the H4 size), and on a phone the two account panels stack and their buttons
run the column's full width.
