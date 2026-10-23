# 0069 · The site shell and the home page follow the chosen direction

- Status: accepted for the build (slice 1, restyle)
- Date: 2026-10-17

## Context

The design catalogue approved at G-DESIGN redraws the shell every screen carries
(`design/catalogue/site.tsx`) and the home page (`home-page.tsx`, `marketplace.tsx`; stories
`home.default` and `home.loading`). The shell gains a skip link of its own, a navigation row,
an account menu, a phone menu and an eight-link footer. The home page leads with a search and
the open opportunities. The home page's contract (`spec/contract/surface.yaml`, `home`) names
sign-in and sign-up actions, and the catalogue puts them on the header's Sign In and Sign Up.

## Decision

- **One header, chosen in script.** `frontend/src/app/site-header.tsx` reads the 767.98-pixel
  switch point with `matchMedia`, as the catalogue does, so only one header is ever in the
  document. Without `matchMedia` (jsdom) it draws the wide header.
- **The home page's test IDs are the header's.** The root layout passes `home-sign-in` and
  `home-sign-up` to the header's Sign In and Sign Up when the screen is `/`, and on no other
  screen. On a narrow screen they are inside the phone menu, so a test at phone width opens Menu
  first.
- **The account actions are in a menu.** On a wide screen, My Profile, My Organizations (vendors
  only) and Sign Out are items of the design system's Menu, behind a button that names the
  person's email address (or their name, if there is no email address). They are not in the
  document until the menu is open. On a narrow screen they are links in the phone menu.
- **The marked section.** `sectionOf` maps an address to the section it belongs to. A
  person's own profile (`/users/me`) and a page read at `/content/:slug` belong to no section.
  Creating and editing pages belongs to Content.
- **Until the session is known, no account action is shown,** so a signed-in person does not see
  Sign In for a moment. The visitor's three sections are shown while the session starts.
- **The page container is not doubled.** The catalogue's `HomePage` wraps itself in
  `PageContainer`. In the app the root layout already wraps every screen in it, so the home
  screen draws only what is inside.
- **The open opportunities are the list's open group.** The home page reads the three programs'
  lists (`listAllOpportunities`) and keeps what `groupedForList` puts in the open group, nearest
  deadline first, as the opportunity list does (R-1.38). Each row shows the opportunity's teaser,
  which is why `ListedOpportunity` now carries `teaser`. Deadlines and values use the same
  wording as the opportunity screens (`deadlineLabel`, `rewardLabel`), not the catalogue's
  sample strings.
- **The search hands over to the list.** The home page's search is a plain `GET` form to
  `/opportunities` with `q`. The opportunity list starts with its search filter set to `q`. That
  is the only change to the opportunity list. Its own restyle belongs to its own stories.
- **The program illustrations** are copied from `design/catalogue/images` to
  `frontend/public/images` and served from there.
- **The marketplace components** (`frontend/src/app/marketplace.tsx`) are the catalogue's label,
  rows and panels, with the row reading a `RowOpportunity` whose facts are already in words, so
  another screen can map its own data onto it.

## Consequences

Tests that found "Sign in", "Sign out" or "My profile" as links in the banner now find "Sign In"
and "Sign Up" as links, and "My Profile" and "Sign Out" as menu items once the account button is
pressed. The signed-in person's email address now appears in the banner. A test looking for that
text anywhere on the page must look inside `main`.
