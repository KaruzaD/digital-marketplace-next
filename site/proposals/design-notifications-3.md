| Field | Value |
| --- | --- |
| gate | G-DESIGN |
| opened | 2026-10-17T22:47:12.493Z |
| holder | agent:ux-reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Do these screens serve the notifications criteria, and are they built out of the design system?

**Recommendation.** Every page keeps its states, every filled test ID and this domain's own words.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've redrawn all eight notification pages in the chosen direction, using the shared site shell and kits. Every page keeps its states, every filled test ID and this domain's own words. Nothing was compiled or scanned during my turn. The pipeline builds the catalogue and runs the accessibility scan afterwards, and writes `design/report.json`.

**What each page now looks like**
- **Unsubscribe landing** (`default`, `loading`, `unsubscribed`, `sign-in-required`). Three states are seen by a signed-in vendor, Test Vendor One. They show the users domain's notifications page with its section links, plus this domain's sentence saying what the setting covers. In `default` the unsubscribe question is open over the whole page. `sign-in-required` is the users domain's sign-in screen, seen by a visitor, with this domain's alert.
- **New-opportunity email control** (`default`, `subscribed`, `signed-out`). It is now drawn inside the real, redesigned opportunity list, for a signed-in vendor. It is a bordered panel at the head of the results, just before the first group. On a phone it sits under the filters with its button at full width. For a visitor (`signed-out`) the page is the opportunity list with nothing in the control's place.
- **Terms broadcast** (`default`, `notify-confirm`, `notified`, `notify-failed`), seen by an administrator. The placeholder that stood in for the content domain's part of the page is gone. The stories now draw the content domain's real managing screen for a page the service needs: facts, warning, Edit page and current wording. The notify section follows it. Edit page stays the one primary button, so Notify vendors is secondary.
- **Email reference** (`default`, `loading`, `not-found`). Same structure as before, restyled:
  - contents links, then each event, then each message's subject and summary, then the email preview frame;
  - the refusal is the shared missing page, drawn for a vendor.
- **Mail-catcher addresses** (`caught-message`, `caught-message-list`, `mail-delivery-fault`, `mail-delivery-delay`). Each is a single `default` response reference, drawn in a visitor's shell. Their test IDs stay `null`, because the mail catcher serves them, not the application.

**Components used most.** Most of the screens are built from the opportunity kit's page frame, panel, region, details, actions, loading row and missing page. The users kit supplies the profile section links and the sign-in choices, and the content kit the managing screen. From the design system they use `Button`, `Checkbox`, `Link`, `InlineAlert`, and `Modal` with `AlertDialog`. The new `notification-kit.tsx` only puts these together; it adds no component of its own beside the design system's. No screen of this domain colours anything, because none of them shows a status.

**One change outside this domain's own files.** The opportunity list page (`opportunity-list-page.tsx`) needed somewhere to put the control, so I gave it one optional `notice` slot at the top of the results. The opportunities domain's stories don't use it and render exactly as before.

**Test IDs.** All of them were already filled in `spec/contract/surface.yaml`, and none changed. Each is still in the stories' markup on an element that does what the surface says.

**Gaps I recorded** (gaps 57–61 in `design/DESIGN.md`, new section "Notification screens in the chosen direction"):
- **57:** the opportunities domain's own list stories, which I kept as they are, don't show the control. The build has to take it from this domain's stories. Nothing says what it shows while the list is loading.
- **58:** the criterion puts the control "at the top of the first group". I placed it just before the group, as its own panel, so the group's test ID holds only opportunities.
- **59:** the terms page's title and its dates are test data. On a fresh installation the criterion says it would be titled with its own address.
- **60:** I chose viewers where no criterion names one. That includes a signed-in header while the account is still loading, and a shell around the mail-catcher addresses, which have none.
- **61:** the users domain's drawing of the same settings page still lacks the scope sentence and the signed-in name in the dialog. Those stories aren't this stage's to change.

The earlier gaps still stand. One worth repeating is that `notification_control_hidden_on_narrow_screen` is named after a superseded rule; the contract stage should rename it.

**One risk the scan may raise.** On the terms page, the content domain's warning and this domain's outcome alert now appear together. If the design system gives every alert title the same id, the scan will report a duplicate id on the `notified` and `notify-failed` stories. Without the package installed here I couldn't check this.

`design/screens.yaml` is unchanged, and I changed nothing under `spec/` (apart from reading it), `constitution.md` or `.claude/skills`.

## Ruling

**Verdict:** approve
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Do these screens serve the notifications criteria, and are they built out of the design system? Approved. The accessibility scan in design/report.json reports zero violations across the whole catalogue, all 18 notification stories included, and the typecheck and build pass. The duplicate-id risk the proposal flagged on the terms page did not appear. In the screenshots, every screen's content lines up with the banner edge in the shared page container. Spacing is even, and each screen has at most one primary button: Edit page stays primary on the terms page and Notify vendors is secondary. The opt-in control sits once between the search box and the first group, inside the redesigned opportunity list (R-6.21, R-6.27). The unsubscribe landing carries the scope sentence (R-6.16) and acts on the signed-in account (R-6.7). The terms broadcast shows the content domain's real managing screen with the immediate-success outcome (R-6.23, R-6.24). notification-kit.tsx only arranges design-system Button, Checkbox and Link with the project's own kits, and styles with design tokens, with no hard-coded colour or spacing. Nothing under spec/ changed, so no filled test ID moved. The only change outside the domain is an optional notice slot on OpportunityListPage, and without it the opportunities domain's stories render as before. The dialog screenshots appear half-faded with a partial overlay, which comes from how the screenshot runner captures them, not from the stories. Tier is STANDARD, so no escalation. The ruling would change on any scan violation, a hard-coded colour or spacing value, a changed filled test ID, or a screen outside the shared page container.

**Conditions:**
none
