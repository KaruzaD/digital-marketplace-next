---
gate: G-DESIGN
question: "Do these screens serve the content criteria, and are they built out of the design system?"
recommendation: "I restyled all seven content pages and their 31 stories in the chosen direction."
opened: 2026-10-17T22:12:17.693Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do these screens serve the content criteria, and are they built out of the design system?

**Recommendation.** I restyled all seven content pages and their 31 stories in the chosen direction.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I restyled all seven content pages and their 31 stories in the chosen direction. I couldn't compile or scan them myself: this workspace has no `node_modules` to run `tsc`. That check runs after my turn and writes `design/report.json`. The earlier report was clean for every content story.

**What changed.** Every story now renders inside `SitePage`, with a viewer and current section per state:
- **Admin screens:** the list, create and managing screens are seen by an administrator, with Content as the current section.
- **Their not-found states:** seen by a vendor, whose header offers no Content section.
- **Public page:** all three states are seen by a visitor.
- **Footer story:** a visitor on Home.
- **Service level agreement link:** a visitor, with no current section.
- **Request references:** the requester each criterion names (an administrator, a vendor or a visitor).

The screens are built from a new `design/catalogue/content-kit.tsx`, which sits on the existing kits. From `opportunity-kit.tsx` it uses `OpportunityPage`, `PageTitle`, `Region`, `Panel`, `Details`, `Waiting` and `MissingPage`. From `marketplace.tsx` it uses `Label` and `look`, and from `proposal-kit.tsx` it uses `AlertTitle`. Everything else is design-system components: `Button`, `ButtonGroup`, `TextField`, `TextArea`, `InlineAlert`, `Modal` with `AlertDialog`, `Link` and `Text`. The body editor still uses `react-aria-components`' `Toolbar` and `FileTrigger`. The kit adds no new widget; it replaces the content stories' hand-styled table, badge and facts row, which were growing beside the design system.

**How the seven rules land:**
- Nothing on these screens is coloured by this domain. "Needed by the service" reads "Yes" as a grey label and "No" as plain text.
- Headings use the direction's denser sizes.
- Each screen has at most one primary button: Create page, Publish page, Edit page or Publish changes.
- On phones the list of pages becomes stacked cards. The switch is made in script, so each test ID appears once.

The home page, opportunity list, Code With Us proposal form and the opportunities domain's screens are untouched. `design/screens.yaml` is unchanged, and every story keeps the words it had. Every test ID filled before this pass stays on an element that does what the surface says.

**A fix that adds visible text.** The old content stories gave each `InlineAlert` both a title and content, and the design system drops the title in that case. So these titles never rendered:
- "The service needs this page"
- "Page published"
- "Changes published"
- "Page removed"
- "This address is already in use"
- "Fix 2 fields to publish …"

They are now written in the alert's own title markup and do appear. The footer story now shows the shared footer, with the original site's eight links. The five links R-7.19 names keep their test IDs. The older section's "About this service" link heading is gone, and its accessibility note about that heading no longer holds.

**Test IDs.** The only `null` left on this domain's pages was `content-list.page_count`. I filled it with `content-list-count`: the number alone, in a `span` inside the list's caption ("Every page, in order of title (5 pages)").

**New gaps**, added to `design/DESIGN.md` under a new section, "Content screens in the chosen direction":
- **45 – Page count:** no criterion says the list states its count, so "(N pages)" is wording I chose. The figure on a fresh installation still depends on the older open question: 22 pages (R-7.12) or 16 (the later rulings).
- **46 – Not-found viewer:** one not-found state can show only one header, and three kinds of viewer reach it. The stories show a vendor's.
- **47 – Wide public page:** the page body runs the full 1100-pixel column, because no token gives a narrower reading width.

I changed nothing under `spec/` except that one `test_id`.
