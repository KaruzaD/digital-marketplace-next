---
gate: G3
question: "Does slice 21 (An administrator can preview every message the service sends) do what its criteria say?"
recommendation: "I restyled slice 21's one screen, the email notification reference at `/admin/email-notification-reference`, to match its catalogue stories (`default`, `loading`, `not-found`)."
opened: 2026-10-19T04:26:28.015Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 21 (An administrator can preview every message the service sends) do what its criteria say?

**Recommendation.** I restyled slice 21's one screen, the email notification reference at `/admin/email-notification-reference`, to match its catalogue stories (`default`, `loading`, `not-found`).

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I restyled slice 21's one screen, the email notification reference at `/admin/email-notification-reference`, to match its catalogue stories (`default`, `loading`, `not-found`). Nothing it shows or who may see it has changed. `npm --prefix app run check` passes: the migrations, backend and frontend packages ran 16, 862 and 659 tests, none failing. The error lines in its output come from tests that exercise failure paths on purpose.

**What was already there.** The slice had been built before, as decision records 0067 and 0068 describe. The service builds every message from invented sample data using the same functions that build it for sending: 62 messages under 45 events (R-6.13). A backend test fails if any message builder is missing from the reference, so a message added later without a sample breaks `check` (R-6.19). Anyone who is not an administrator gets the shared missing page. The only thing out of step with the approved catalogue was how the screen looked: it was still drawn with plain stacks, the design system's headings and text, and inline styles.

**What I changed.**
- **Shared pieces, added once in `app/frontend/src/app/notification-kit.tsx`:**
  - a page frame for this domain's screens, built on the opportunity kit's page;
  - the "Events that send email" list of in-page links;
  - one section per event, holding one article per message. Each article has the recipient as its H3, the Subject (and "Who receives it and why" only where a summary is written) as a list of terms, and the bordered email preview.

  Its style sheet now includes the catalogue's rules for the contents list, the message rule and the preview frame. The terms broadcast and the opportunity list already used that style sheet and still do.
- **The screen**, `app/frontend/src/screens/email-notification-reference.tsx`, is now built from those pieces. Its width and spacing come from the shell's page container, like every other restyled screen. The loading state is the heading plus the kit's spinner ("Loading sample emails…"). The failure alert has no story, so I kept it and placed it in the same page frame.
- **One difference from the catalogue.** The catalogue's sample type is a simple list of paragraphs, a link and a footer. The kit instead draws the shape the service actually returns (blocks of text and links), so the preview stays exactly the message as sent. Decision record 0090 explains this.

Every test ID from `surface.yaml` and the stories is still on the same element:
- `email-reference-page` on the page;
- `email-reference-group-title` on the event's words;
- `email-reference-subject` and `email-reference-summary` on the fact values;
- `email-reference-body` on the preview frame;
- `not-found-page` on the refusal.

**Tests.** The existing frontend tests for this page still pass. They cover the grouping, the subjects, a summary row left out where none is written, the endings of each message, the refusal for vendors, public sector staff and visitors, and the request that skips the browser's cache. I added one test of the catalogue's structure: a section per event with its H2, an article per message, the fact terms, and the preview frame's accessible name.

**R-6.6 is not built as literally written.** R-6.6 says every message ends with an Unsubscribe offer. R-6.16 says a message the notification preference does not govern must not offer to unsubscribe. The plan reads R-6.16 as narrowing R-6.6, and the catalogue story draws that split. So Unsubscribe ends only the three new-opportunity announcements, opening `/users/me?tab=notifications&unsubscribe` with the question already asked. Every other sample ends with "Manage your notification settings". The page starts with the Code With Us announcement, so the first sample does end with Unsubscribe. If R-6.6's acceptance test expects the offer on every sample, it will fail on those other messages. The plan says to raise that rather than satisfy it, so I've raised it here. Settling it would take a ruling on the spec, which is not this stage's to change. If R-6.6 were ruled to stand as written, one change to the shared message footer would end every message with Unsubscribe, and the reference would follow on its own.

**For the next slice.** Nothing is missing from this one. Every message built in slices 2 to 19 is on the page, and the completeness test will catch any new message added without a sample.
