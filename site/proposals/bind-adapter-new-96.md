| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T01:59:57.719Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed the second-level adapter reads that came back empty on a published Code With Us opportunity, without using the test ids the ruling asked for.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed the second-level adapter reads that came back empty on a published Code With Us opportunity, without using the test ids the ruling asked for. I couldn't run the adapter itself, so the fix is checked only by running its logic in the browser. The only file I changed is `tests/adapters/new/index.ts`. `bindings.yaml` is unchanged, because status, proposal deadline and reward stay bound.

**The defect.** The ruling found it correctly. On the restyled page, `cwuHeadLines()` ended the head at the first line whose text matched any term label. A published opportunity shows its status as "Published", and that is also the label of the "Published" date. So the head was cut off at the status line, and `cwuHeadStatus()` then skipped "Published" as if it were a label. That made `opportunityCwuView.status()` and `opportunityCwuView.proposalDeadline()` both return '' on a published opportunity. A draft escaped only because "Draft" is not a label on the page.

**Why I didn't use the test ids.** The ruling asked me to read status, deadline and reward from the `opportunity-status`, `opportunity-proposal-deadline` and `opportunity-reward` test ids. Those ids are on the running target. But this stage's rules forbid binding to a `data-testid`, and the separation check refuses an adapter that uses one. So I fixed the cause instead.

**The fix.**
- **Head lines:** `cwuHeadLines()` now finds where the head ends from the page's structure: it takes the visible text that comes before the first definition-list term, grouped into one line per block. It no longer matches lines against label text. The other two cut-offs, "Opportunity ID:" and "Description", are kept.
- **Status:** `cwuHeadStatus()` no longer skips lines that equal a label, so "Published" or "Code With Us Published" now reads as "Published".
- **Deadline:** `cwuHeadDeadline()` now also falls back to the first line anywhere on the page that starts with "Closes" or "Closed". This matches how the old binding reads its own deadline, and covers a restyled page that draws that line below the terms.
- **Reward:** `reward()` still reads the "Reward" term first and the head's "Reward $5,000" line after that. It goes through the same corrected head, so it can no longer be cut off.
- **Cleanup:** I removed the `termLabels()` helper, which nothing uses any more.

**What I checked.** The target running here at `localhost:4300` still draws status, deadline and reward under their own terms, so the term reads answer before any of the fallbacks.
- **Seeded published opportunity (signed out):** Published / "June 1, 2030 at 4:00 p.m. Pacific time" / $5,000.
- **Seeded draft opportunity of another staff member (signed in as the administrator):** Draft / "August 1, 2030 at 4:00 p.m. Pacific time" / $12,000.
- **Restyled head:** I can't open the build the ruling looked at (application tree 7e29391), so I rebuilt its head inside the published page. I added "Code With Us" and "Published" as inline labels, a "Closes June 1, 2030 at 4:00 p.m. Pacific time" line and a "Reward $5,000" line, and removed the Status, Proposal deadline and Reward terms while keeping the "Published" date term. The new head logic, run in the browser, returned all three of those lines, which the existing patterns read as Published, the full Closes line and $5,000. A draft's "Code With Us Draft" goes through the same path and reads as Draft.

**What I couldn't do.** The workspace has no installed node packages, and type-checking needed an approval this session doesn't have. So the TypeScript wasn't compiled and the adapter wasn't run under Playwright here. The next verify run on the slice should confirm R-1.14, R-1.21 and R-1.22. Every page route that was resolving before still resolves; I opened no new routes.

## Ruling

**Verdict:** approve
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether this revision of tests/adapters/new/index.ts fixes the empty status and proposal-deadline reads on a published Code With Us opportunity, which build-slice-7's twelfth request reported. The escalation came from the request-loop limit, not from anything the pipeline cannot do, so I rule on the proposal itself. Approve. The twelfth request decided it. It named the cause correctly: cwuHeadLines() ended the head at the first line matching any term label, and 'Published' is both the head's status and the label of the 'Published' date term, so the head was cut at the status line and cwuHeadStatus() then skipped 'Published' as a label. The diff removes exactly that. The head now ends at the first <dt> by its position on the page rather than by text matching, the label skip in cwuHeadStatus() is gone, the deadline read falls back to the first 'Closes/Closed' line on the page, and the unused termLabels() helper is deleted. The request also asked for reads from data-testid opportunity-status, opportunity-proposal-deadline and opportunity-reward. The stage could not do that part, because it may not bind to a data-testid and the separation check refuses an adapter that does. Fixing the cause meets what the request needed inside the stage's rules. Nothing beyond those three functions changed, bindings.yaml is unchanged, the runner's typecheck passed with no diagnostics under adapters/new/, and the separation check passed. The author tried the new logic in a browser on a published opportunity, a draft and a rebuilt restyled head, but the adapter was not run under Playwright, so the next verify run on slice 7 settles R-1.14, R-1.21 and R-1.22. That run would change this ruling if it still reads '' from status, proposal deadline or reward on a published opportunity, or if the page-wide 'Closes/Closed' fallback matches text from outside the opportunity.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `a5d59f8ac49ea78ae65e18d0ff835a056a03e96e`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
