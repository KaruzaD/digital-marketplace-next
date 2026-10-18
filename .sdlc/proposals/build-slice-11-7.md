---
gate: G3
question: "Does slice 11 (A vendor can register and look after an organization) do what its criteria say?"
recommendation: "I restyled slice 11's screens to the approved design catalogue: the organization list, the registration form, and the management page's head and Organization tab."
opened: 2026-10-18T16:56:56.406Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 11 (A vendor can register and look after an organization) do what its criteria say?

**Recommendation.** I restyled slice 11's screens to the approved design catalogue: the organization list, the registration form, and the management page's head and Organization tab.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled slice 11's screens to the approved design catalogue: the organization list, the registration form, and the management page's head and Organization tab. The criteria themselves (R-3.1, R-3.2, R-3.3, R-3.18 to R-3.22, R-3.24 and the four image rules) were built in earlier rounds and work the same as before. No test ID, wording or behaviour changed. `npm --prefix app run check` passes: typechecking plus all unit tests in the three packages, including 621 frontend tests.

**What changed**
- **One shared organization kit.** I added `app/frontend/src/app/organization-kit.tsx`, written once and used by every screen here. It reuses the page frame, headings, tables and labels that earlier restyles already put in `app/frontend/src/app`. It holds:
  - the page frame with its own style sheet;
  - the management page's head: the small "Edit Organization" line above the title, green "qualified" labels, the legal name as the main heading, the Organization ID shown as a labelled detail, and the tabs as a navigation landmark called "Organization sections";
  - a grid that lays out form fields in as many columns as fit;
  - the read-only profile fields, the stored logo, the archive section and the dialog text;
  - the list's rows and page links.
- **Organization list.** On a wide screen it is a table. On a phone each organization becomes a card with its name as a heading and the owner, team size and both qualification marks on one line beneath. The page decides which to draw in script, as the site header does, so each test ID appears once. Logos still show above the name (R-8.28). The loading, refused and failed states use the new page frame.
- **Registration form.** It is now three bordered panels (Organization details, Address, Contact), with the fields in columns. The problem list's title sits in the alert's own title markup. The reason the Create button is waiting sits directly before the buttons, and the button is described by it.
- **Organization tab.** The read-only view has Address and Contact as level-3 sections in the same columns. The edit form lies under an "Edit organization" heading with the same two sections. The logo chooser is still the shared picture picker from slice 3. Loading uses the design's own loading indicator.

**Where I kept the earlier rulings instead of the catalogue**
Four things were settled by decision records 0048 and 0049 in earlier rounds, and I left them as ruled:
- The read-only profile stays as plain text in a description list rather than read-only text boxes, because a box's value is not part of what the tab reads as. It now sits in the form's columns.
- "Archive this organization" stays inside the Organization tab's section. It has a level-3 heading drawn at the size the stories give section headings.
- The submit buttons stay available while the form is invalid.
- On a vendor's list, a row they don't own or administer stays a single cell across the table, with no blank cells.

The new decision record `docs/decisions/0079-…` explains each of these.

**Tests added**
Four new unit tests in `app/frontend/tests/organizations.test.tsx` cover:
- the phone layout of the list: cards, the name heading, which rows carry details, and no table;
- the management head: the small line, both labels, the identifier as a labelled value, and the five tabs in order;
- Address, Contact and Archive as level-3 sections inside the Organization tab, with "Not entered" for an empty field;
- the three registration panels and the reason the Create button points to.

**Not done here, and what the next slice will find**
- `organization-acting-for-list` is a reference page for `GET /api/ownedOrganizations`, not a screen, so there was nothing to restyle.
- The bodies of the Team members, qualification and Changelog tabs belong to slices 12 and 13. They now sit under the restyled head but keep their old layout.
- The catalogue's team rows, changelog rows, requirement list and membership labels are not in the app's organization kit yet. The restyles of slices 12 and 13 should add them there.
- The profile's Organizations section has not been restyled either.

I changed nothing outside `app/` and `docs/decisions/`.
