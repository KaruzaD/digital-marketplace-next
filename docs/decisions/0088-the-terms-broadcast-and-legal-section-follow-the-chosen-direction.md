# 0088 · The terms broadcast and the legal section follow the chosen direction

- Status: accepted for the build (slice 6, restyle)
- Date: 2026-10-18

## Context

The catalogue approved at G-DESIGN redraws slice 6's two screens: the terms broadcast on the terms
page's managing screen (`notification-terms-broadcast` · `default`, `notify-confirm`, `notified`,
`notify-failed`, drawn by `notification-kit.tsx`'s `TermsBroadcastPage`) and the vendor's legal
section (`user-profile-legal` and `user-profile-self-legal` · `default`, `terms-updated`,
`accept-terms-confirm`, `section-unavailable`, drawn by `user-profile-sections.tsx`'s `LegalPage`).
Decision record 0087 had already put the managing screen around the broadcast in the new layout,
and 0077 had already done the same for the legal section. The broadcast itself was still drawn with
`Stack`, the design system's `Heading` and `Text`. How changed terms are announced and agreed to
again is unchanged; decision record 0027 still says how.

## Decision

- **The broadcast is the catalogue's region.** `screens/terms-broadcast.tsx` is now a `Region`
  ("Notify vendors of updated terms", the H2 in the H4 size) after the current wording: the outcome
  alert first when there is one, the two sentences as `op-text`, and the secondary button in
  `Actions`, so it goes full width on a phone. Edit page stays the screen's one primary action. The
  dialog's two sentences are `op-text`, as `notify-confirm` draws them. It carries the notification
  kit's style sheet, as the catalogue's page does.
- **The legal section is not changed.** It already matches `LegalPage` region for region.
- **Kept where the story differs.** The `terms-updated` story draws the legal section without the
  profile section links. Nothing in DESIGN.md says why, and no criterion asks for the vendor's other
  sections to be hidden while the terms are unaccepted. Removing the links would leave a vendor
  with no way to reach their profile, notifications or organizations from this page. So the links
  stay in every state, as decision record 0077 kept them.

## Consequences

No test ID, wording or behaviour changes. The broadcast heading keeps its `id`
(`notify-vendors-heading`) and is now the label of a `section`, so it is found as a region named
"Notify vendors of updated terms".
