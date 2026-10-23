| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T01:50:19.090Z |
| holder | agent:reviewer |

# Does slice 7 (Staff can draft, submit and publish a Code With Us opportunity) do what its criteria say?

**Recommendation.** The application build-slice-7-11 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-7-11 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to bind-adapter: opportunityCwuView.status() and opportunityCwuView.proposalDeadline() in tests/adapters/new/index.ts look up definition-list terms labelled 'Status' and 'Proposal deadline'. The Code With Us view, restyled to the catalogue approved at G-DESIGN, no longer has either label. Status is now an unlabelled label in the page head (data-testid opportunity-status), and the deadline is a head fact reading 'Closes <date> at 4:00 p.m. Pacific time', or 'Closed' once passed (data-testid opportunity-proposal-deadline). Rebind both reads to those test IDs, and check reward(), which still finds its 'Reward' label but now carries data-testid opportunity-reward. Shown by verify on build-slice-7-11 (application tree 7e29391): R-1.14, R-1.21 and R-1.22 all read '' from these members, while the page snapshot .sdlc/evidence/slice-7/R-1.21.txt shows 'Draft' and the 4:00 p.m. deadline on the page.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** return
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 7 do what its criteria say, given runner:verify escalated after three failed verifies? Ruling: return. The account's point that the fault might not be the application's is what decided it, and the evidence settles which part is at fault. Both failing reads come from the adapter, not the app: .sdlc/evidence/slice-7/R-1.14.txt and R-1.22.txt show the head's status ('Code With Us Published') and 'Closes October 31, 2026 at 4:00 p.m. Pacific time' on the page, but opportunityCwuView.status() and proposalDeadline() return ''. The rebind that answered build-slice-7-11's condition ignored the test IDs it was told to use. It reads the head as text instead, and cwuHeadLines() (tests/adapters/new/index.ts:8308) ends the head at the first line that equals any definition-list label. 'Published' is both a label and the status of a published opportunity, so the head is cut off before the deadline line and cwuHeadStatus() skips the status as a label. A draft has no such collision, which is why R-1.21 passed. The build has nothing to change, so this proposal comes back unchanged once bind-adapter's revision is approved and re-verified. R-1.51 is accepted as not observable on the running service (a migration property) and would not on its own block approval. What would change the ruling: R-1.14 and R-1.22 passing against tree 7e29391 or a successor, with status and deadline read by test ID.

**Conditions:**
- addressed-to bind-adapter: opportunityCwuView.status() and opportunityCwuView.proposalDeadline() in tests/adapters/new/index.ts still read '' on a published Code With Us opportunity. Their fallbacks go through cwuHeadLines(), which ends the head at the first line equal to any definition-list label. 'Published' is both the status in the head's label and the term of the 'Published' date detail, so the head is cut off at the status line: the 'Closes ... at 4:00 p.m. Pacific time' line is dropped, and cwuHeadStatus() skips 'Published' as a label. Read status from data-testid opportunity-status and the deadline from data-testid opportunity-proposal-deadline, as the earlier request asked, rather than by matching head text. Check reward() against data-testid opportunity-reward too. Shown by verify on build-slice-7-12 (application tree 7e29391): R-1.14 (tests/acceptance/opportunities/R-1.14.spec.ts:109) and R-1.22 (R-1.22.spec.ts:50) read '' while .sdlc/evidence/slice-7/R-1.14.txt and R-1.22.txt show 'Code With Us Published' and the 4:00 p.m. deadline on the page. R-1.21 passes only because 'Draft' is not a label on that page. Before proposing, run the rebound reads against a published opportunity as well as a draft.
