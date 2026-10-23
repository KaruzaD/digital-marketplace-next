| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T07:42:09.920Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 2 (A person can sign in, finish signing up and sign out) do what its criteria say?

**Recommendation.** I restyled slice 2's screens to the design catalogue approved at G-DESIGN.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 2's screens to the design catalogue approved at G-DESIGN. Every test ID is kept on the same element, and `npm --prefix app run check` passes: types check in every package, and 862 frontend tests, 584 backend tests and 16 migration tests pass.

**What this run was.** Slice 2's six criteria (R-4.1, R-4.2, R-4.3, R-4.17, R-4.24, R-6.1) were already built by an earlier run. That covers the sign-in with PKCE through the Keycloak realm, account creation on first sign-in, the welcome message, terms agreement, the new-opportunity notice choice and sign-out from both the service and the identity provider. The compose file already publishes the app at http://localhost:4300 and the realm at http://localhost:8080/realms/digital-marketplace. As the operator asked, this run changed only how the screens are drawn. Behaviour, routes, the service and compose are untouched, and how each criterion is reached is the same as before.

**What changed:**
- **One shared user kit.** `app/frontend/src/app/user-kit.tsx` holds the catalogue kit's page frame, the two-account-choices layout, the label group, the field grid and the error summary, built on the opportunity kit the shell already uses. I added only the pieces these screens need. The profile's own pieces belong to slices 3 and 4 and should be added there when those screens are restyled.
- **Sign In and Choose Account Type** (`screens/sign-in.tsx`) follow their stories. Each kind of account is a bordered panel with one secondary button, side by side where there is room and stacked on a phone, and there is no primary button. When a page sends someone to sign in, the screen shows the sign-in-required story instead: an info alert in place of the introduction and shorter panel text.
- **Complete Your Profile** (`screens/sign-up-complete.tsx`) follows its four stories:
  - Above the form it shows the save refusal, or else the error summary, or else the introduction. The summary's title now actually renders and takes focus.
  - Username, name and email sit in the field grid, the terms links and agreement box form one group, and Complete profile is the one primary action.
- **Signed Out** (`screens/sign-out.tsx`) follows its three stories, with the wait drawn as the kit's status row.
- **The notices** (`screens/notice.tsx`) are restyled too, because a refused sign-in lands on the sign-in-failed notice. The deactivation notice's behaviour is still slice 3's; only its layout changed.

**Three places I didn't follow a story exactly.** All are recorded in `docs/decisions/0074-…`:
- The sign-in-required state keeps the "Don't have an account? Sign up" link, though its story leaves it out, because the contract offers that action on the sign-in page without naming a state.
- The terms links stay on the completion form in every state, though the `invalid` and `save-failed` stories leave them out, because the agreement box still refers to what they link to.
- The shared picture picker (used by the profile and the organization form too) is unchanged; its wording already matches the story, and restyling it belongs to slice 3.

**Tests.** A new `tests/slice-two-screens.test.tsx` checks the layout:
- **Sign-in and sign-up:** the H1 and panel heading sizes, the two panels side by side, and no primary button.
- **The sign-in-required state:** the alert replaces the introduction.
- **The completion form:** the field grid, the terms group, and the error summary focused with its title.
- **Signed Out and the notices:** the wait row while signing out, and each notice's region with its actions after it.

The existing behaviour and axe accessibility tests for these screens still pass unchanged. I couldn't look at the pages in a browser here, so widths and reflow are covered only through the class structure these tests check. Installing dependencies created `app/node_modules`, which `app/.gitignore` already excludes.

**What I didn't do and what's left.** I changed nothing under `spec/`, `design/` or `plan/`. DESIGN.md gaps 41 and 42 are still open, because the spec doesn't answer them:
- **Gap 41:** whether the header should offer its navigation to someone who hasn't yet agreed to the terms.
- **Gap 42:** which header to show when sign-out fails.

The screens keep today's behaviour on both. The next restyle (slice 3's profile screens) will find the user kit has no profile pieces yet, and the picture picker still in its older layout.

_Ruled: approve by tech-lead_
