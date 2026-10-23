---
stage: "bind-adapter"
title: "bind adapter"
at: "2026-10-18T01:59:57.673Z"
cost: 0.8728895999999999
turns: 31
session: "37b4342c-98fb-4bf0-a285-141ffa053cef"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

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