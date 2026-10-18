---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "Both had the same cause, so one change answers them together."
opened: 2026-10-18T00:45:30.496Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** Both had the same cause, so one change answers them together.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've fixed both conditions in this run, and neither is deferred. Both had the same cause, so one change answers them together.

**What was wrong.** For the list at `/opportunities`, the adapter found each group by matching its heading against patterns that had to match the whole heading, such as `/^open(?: opportunities)?$/i`. The reviewer's evidence shows that public sector staff and administrators see headings with the group's count on the end, like "Open Opportunities 3" (R-1.3) and "Open Opportunities 5" (R-1.38). Those headings never matched. So the adapter found no group section and no heading either, and `openGroup()` returned an empty string while the page was showing published opportunities.

**What I changed.** In `tests/adapters/new/index.ts`, the three group patterns in `OPPORTUNITY_GROUPS` now allow an optional count after the heading's words:
- `/^unpublished(?: opportunities)?(?:\s+\d+)?$/i`
- `/^open(?: opportunities)?(?:\s+\d+)?$/i`
- `/^closed(?: opportunities)?(?:\s+\d+)?$/i`

I applied it to all three groups, as the condition asked. The part that drops the heading from what a group returns already handled a count, whether it shares the heading's line or sits on its own line, so with the new patterns the heading and count are removed and the rows come back as before. `opportunityStatus`, which uses the same patterns to find where the first group starts, now also recognises a heading with a count. I also updated the comment describing the page to mention that a heading can carry its count.

**What I checked.** I opened `/opportunities` signed out on the running target. There the headings are just "Open" and "Closed", with no count, and the new patterns still match them. I did not sign in as staff or an administrator to see the counted headings myself; for that form I'm relying on the reviewer's evidence. I haven't run the tests against the change.

Nothing else changed. `bindings.yaml` stays as it was, since no member's status changed, and I touched no other binding and wrote nothing outside `tests/adapters/new/`.
