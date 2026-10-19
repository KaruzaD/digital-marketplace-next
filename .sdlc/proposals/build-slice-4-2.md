---
gate: G3
question: "Does slice 4 (An administrator can manage people's accounts) do what its criteria say?"
recommendation: "I restyled the user list at `/users` and its contact-list export to match the approved design catalogue."
opened: 2026-10-19T01:32:19.578Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 4 (An administrator can manage people's accounts) do what its criteria say?

**Recommendation.** I restyled the user list at `/users` and its contact-list export to match the approved design catalogue.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I restyled the user list at `/users` and its contact-list export to match the approved design catalogue. That was the one part of slice 4 still in the older layout. `npm --prefix app run check` passes: typecheck plus 16 + 862 + 649 unit tests across the three packages.

**State going in.** All ten criteria were already built in earlier passes, with the choices recorded in `docs/decisions/0024`:
- **R-4.14 and R-4.21:** the user list, with search, shown to administrators only; anyone else gets the missing page and the service refuses them with a 401.
- **R-4.32:** the contact-list export.
- **R-4.12, R-4.19, R-4.20, R-4.30 and R-4.31:** the administrator's view of someone else's profile, with administrator rights, deactivate and reactivate, and the messages each sends.
- **R-4.4:** the sign-in refusal and its notice.
- **R-4.13:** the first administrator, put in by the seed.

The administrator's profile view had already been restyled under decision 0077, and the notices under 0074. I changed no behaviour in this pass.

**What changed.**
- **Shared user kit** (`app/frontend/src/app/user-kit.tsx`): it now carries the catalogue's toolbar, phone-card and export-dialog styles, plus two small components, `Toolbar` and `DialogBody`. They are defined once there and not inside the screen.
- **Wide screens** (`app/frontend/src/screens/user-list.tsx`): the list uses the shared `DataTable` with its caption. Each account's status is the kit's coloured label: green for Active, grey for Inactive.
- **Phones:** each account becomes a card, with its name as a heading link and status, account type and "Administrator: Yes/No" on one line beneath. The switch is made in script, as the site header's is, so each row and its test IDs appear only once.
- **Loading:** the wait is the kit's waiting row under the page heading.
- **Export dialog:** it uses the kit's body and heading size, and works exactly as before.

**Two things kept that the stories don't show.** Both are recorded in the new `docs/decisions/0086`:
- The "N of M people shown" line stays as a status message. The design leaves an empty search undesigned (DESIGN.md's gap 1), and without the line a screen reader hears nothing as the list narrows.
- The export's failure alert stays, because the stories draw no failure state.

**Tests.** I added three tests to `app/frontend/tests/administering.test.tsx`:
- the wait under the heading;
- the wide table's column headings and the status label colours;
- the phone layout: no table, one card per account, each of the four row test IDs once per account, the name as a heading, and the administrator line.

The existing tests for the list, the export, the profile controls and the accessibility (axe) checks still pass. A script confirmed every test ID in the `user-list`, `user-profile` and `user-notice` stories is present in the app's markup.

**Left alone.** `user-list-request` is a reference page for an API address, not a screen, so it needed no markup. The compose file already publishes the application at http://localhost:4300 and the identity provider's realm at http://localhost:8080/realms/digital-marketplace; I did not change it. Nothing in this slice required changing the spec, plan or design, and I couldn't look at the page in a browser here, so the visual result is proven only by the unit tests.

**For the next slice.** Every slice-4 screen now follows the chosen direction. The profile's organizations section and the shared sign-in wait are still in the older layout, as 0077 notes; they belong to the organizations stories and slice 2's restyle.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Does slice 4 (an administrator can manage people's accounts) do what its criteria say? Approve. The verify result is current for this proposal: it was recorded against application tree cb90c9d, which matches app/ on the branch. 9 of the 10 criteria the slice claims passed and none failed. The one unasserted criterion, R-4.13 (no way to create the first administrator through the service), is recorded as not-testable for a real reason: it claims the absence of any route anywhere in the service, which no observation can establish. It is also a seed and data-level property this restyle does not touch, so I accept the slice on the strength of what was asserted. The diff changes presentation only: user-list.tsx moves to the shared DataTable on wide screens and to stacked cards below the header's switch point (each row test ID once per account); user-kit.tsx gains the Toolbar and DialogBody components and their styles; the export dialog is wrapped in DialogBody with its behaviour unchanged. The retained 'N of M people shown' status line and the export failure alert are justified in decision 0086 on accessibility grounds and go beyond no criterion. Nothing touches another slice or a protected path, no secret or personal data appears, and the new waiting, wide-table and phone-card paths each have unit tests in administering.test.tsx. The ruling would change if the verify result were stale against the tree, if any claimed criterion failed, or if evidence showed the service does offer a route to create an administrator.

**Conditions:**
none
