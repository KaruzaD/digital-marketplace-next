# 0077 · The profile, the unsubscribe landing and the picture picker follow the chosen direction

- Status: accepted for the build (slice 3, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 3's screens: the profile at `/users/me` and
`/users/:userId` in every state (`user-profile`, `user-profile-self` and their capabilities,
notifications and legal sections), the unsubscribe landing (`notification-unsubscribe-landing`),
and the picture picker (`file-image-picker`). DESIGN.md's "User screens", "Notification screens"
and "File screens in the chosen direction" say how, building on `user-kit.tsx`,
`user-profile-sections.tsx`, `notification-kit.tsx` and `file-kit.tsx`. Until now the profile was
drawn with `Stack`, the design system's `Heading` and `Text`, "Account type:" and "Status:" lines,
a circular status badge and a plain row of section links.

## Decision

- **The user kit grows the profile's pieces once.** `frontend/src/app/user-kit.tsx` now also holds
  `AccountStatus` (the status label, green for Active and grey for Inactive), `ProfileTabs` (the
  section links drawn as the manage page's tabs), `AccountFacts` (type, status and Account ID as
  terms and values, keeping their test IDs on the values and the label), `DetailsRegion` (the
  Details region with its picture line, the read-only fields in the field grid and its action), the
  capability rows' classes, and `SaveStatus`, the status region an immediate save reports into.
  The user list's cards and the export dialog body stay to be added when that screen is restyled.
- **Every profile state is the stories' layout.** The H1 in the H3 size, the tabs, the facts, then
  Details with Edit profile as the one primary in `Actions`; while editing, the error summary
  (now the kit's, focused, its title rendered) or the save refusal, then the region "Edit your
  details" with the picker, the field grid and Save changes / Cancel; Permissions and "Deactivate
  your account" (or, to an administrator, Permissions with its hint grouped and Account status) as
  regions. The capabilities are bordered rows with the box and its toggle on one line; the legal
  section is three regions, the program terms an `op-list`; dialog text is `op-text`.
- **The administrator's view is restyled too,** although what its controls do is slice 4's: it is
  the same page and uses the same pieces, so drawing it in the older layout would have left two
  layouts on one screen.
- **Kept where the stories differ, for a stated reason.** The status label stays on a person's own
  profile: `spec/contract/surface.yaml` lists `profile-status-badge` among `user-profile-self`'s
  observations and decision record 0023 keeps it there for R-4.1, while the story shows status to an
  administrator only. The line naming whose profile it is (0023) stays above the facts. The scope
  sentence (R-6.16) is on the notifications section whichever way it is reached, as the landing's
  story draws it; DESIGN.md's notifications gap 61 says the two drawings should match.
- **The unsubscribe landing** waits under the H1 "Notifications" with "Loading your notification
  settings…" when it is opened with `unsubscribe`, and once Unsubscribe is pressed focus returns to
  the cleared box, as `unsubscribed` says; on arrival nothing on the page opened the dialog, so the
  dialog had nowhere to return focus to.
- **The picture picker is the catalogue's `PictureGroup`** in place: a labelled `fl-group`, the
  stored picture or the sentence, the "ready" line as a `<p role="status">`, the refusal with its
  title rendered and a focus ring, and the rule as the paragraph itself carrying `image-file-rule`
  (the files section's spacing correction). It carries its own small style sheet, because the
  organization form, which uses the same picker for a logo, is not drawn with the file kit. It
  keeps its own hidden file input rather than `FileTrigger`, for the reason its comment gives.
- **Not restyled here:** the organizations section of the profile (the organizations domain's
  stories, `organization-user-memberships-self`) and the shared sign-in wait (`RequireSignIn`,
  slice 2's), whose look is unchanged.

## Consequences

No test ID, wording or behaviour changes. The account facts are a description list, so a test
reading "Account type: Vendor" as one line reads the term and the value separately; the status
label's text is unchanged. Headings are smaller (H1 in the H3 size, regions in the H4 size).
