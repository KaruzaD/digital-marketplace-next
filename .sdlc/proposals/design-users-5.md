---
gate: G-DESIGN
question: "Do these screens serve the users criteria, and are they built out of the design system?"
recommendation: "No states, words or test IDs changed."
opened: 2026-10-17T21:59:30.062Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do these screens serve the users criteria, and are they built out of the design system?

**Recommendation.** No states, words or test IDs changed.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've restyled all 60 users-domain stories (17 pages) into the chosen direction. No states, words or test IDs changed. Nothing was compiled or scanned: there are no installed dependencies here and I couldn't run scripts. The pipeline's catalogue build and accessibility scan, which write `design/report.json`, are the real check.

**What I did.** Every story now sits inside `SitePage` with a stated viewer and current section. The one viewer rule worth knowing: an administrator reading someone else's profile, or using the user list, is shown with Users as the current section; a person on their own profile has no current section, because they reach it from the account menu. In place of `PageContainer` and the outer `Stack`, the stories now use the opportunity kit's pieces: `PageTitle`, `Region`, `Panel`, `Details`, `DataTable`, `Actions`, `Waiting` and `MissingPage`, plus `marketplace.tsx`'s `Label` and `look`. `statusOf` didn't fit, because no users screen shows an opportunity. Every story also offers the three widths (desktop 1440, phone 390, narrow phone 320).

I added two files of our own components and listed them in `DESIGN.md` as not design-system components:
- **`user-kit.tsx`** has:
  - the page frame;
  - an account status label (green for Active, grey for Inactive), replacing the old circular badge;
  - the account facts as a term-and-value list, replacing the "Account type: …" style lines;
  - the profile section links, drawn like the opportunity manage page's tabs;
  - read-only details laid out in a field grid;
  - the two side-by-side account choices on the sign-in and sign-up screens;
  - capability rows;
  - a status region for immediate saves that adds no gap while empty;
  - a focus-taking error summary.
- **`user-profile-sections.tsx`** holds the capabilities, notifications and legal sections, and the two "section not offered" profiles. Each is written once and shared by the by-identifier and `/users/me` stories.

The design-system components used most are `TextField`, `Checkbox`, `Button`, `InlineAlert`, `Modal` with `AlertDialog`, `Dialog`, `CheckboxGroup`, `ButtonGroup`, `Link` and `FileTrigger`.

**Three changes beyond restyling:**
- **Error summary titles now show.** The old invalid-form stories gave the alert both a title and content, which makes the design system drop the title. "Your profile has 2 problems" and "Your changes have 2 problems" were never rendered; they now are, and the summary takes focus when it appears.
- **The user list becomes cards on phones.** Wide screens keep the table with its caption and columns. Below the header's switch point each account becomes a stacked card. The switch is made in script, so each row's test IDs appear once. This settles, for this domain, the earlier note that tables only scrolled sideways on phones.
- **One primary button per screen.** Deactivate stays a secondary danger button, and the two sign-in choices are equal secondary buttons.

**Test IDs.** All of these pages' test IDs in `spec/contract/surface.yaml` were already filled, so I left the contract unchanged. I checked with a search that every one still appears in the markup on an element that does what the surface says. `design/screens.yaml` is unchanged because no state was added or removed.

**Gaps**, recorded as 41–44 in a new `DESIGN.md` section, "User screens in the chosen direction":
- **41:** The completion page shows the newly signed-in vendor the full signed-in header (Dashboard first) before they have agreed to the terms. No criterion says whether they should get it.
- **42:** When sign-out fails, the criterion says the person "may still be signed in", so which header to show isn't defined. I drew them signed in.
- **43:** The Active/Inactive colours are my own choice; no criterion covers them.
- **44:** No criterion says what the user list looks like on a narrow screen. The cards put the name first.

The earlier users gaps 1–11 still stand.

I touched nothing outside `design/`.

## Ruling

**Verdict:** approve
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: do the 60 restyled users-domain stories serve the users criteria and come from the design system? Ruling: approve. design/report.json on the branch scans all 60 users stories with zero axe violations, and typecheck and build pass. spec/contract/surface.yaml and design/screens.yaml are unchanged, so no filled-in test_id moved and no state was lost. A search of the users files finds no inline styles or hex colours; spacing and colour come only from tokens, and the only pixel values are grid minimum widths, one breakpoint and the standard 1px visually-hidden clip. Eight screenshots (user-profile and user-profile-self default, user-list, sign-in, sign-up-complete, the invalid profile form, capabilities, legal, and the deactivated notice) show content in the shared page container lined up with the header, an even large/medium/small rhythm, at most one primary button, consistent H1s, and the error summary title now rendered. user-kit.tsx and user-profile-sections.tsx are built from design-system components and tokens, and DESIGN.md names them as the project's own, which the brief accepts. Gaps 41-44 are open spec questions, not design defects. The tier is STANDARD, so this is not escalated. The ruling would change on any accessibility violation, a moved or missing test_id, content out of line with the header, or doubled spacing in a screen not inspected here.

**Conditions:**
none
