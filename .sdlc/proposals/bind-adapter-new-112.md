---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "Against the running application it returns exactly what the old reader did."
opened: 2026-10-19T00:00:51.682Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** Against the running application it returns exactly what the old reader did.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I've changed the user-list reader in `tests/adapters/new/index.ts` so it reads every row and its four cells in a single call to the browser. Against the running application it returns exactly what the old reader did. I could not run the TypeScript compiler here, because the command needed an approval that nobody was present to give.

**What I changed.** One function, `userListMarked`, sits behind the user list's `user_row`, `status_badge`, `account_type` and `admin_check` readings. It used to loop over the visible `user-list-row` rows, looking up each row's four cells (status, account type, name, administrator) one after another. That cost several browser round trips per row. Now one `evaluateAll` over the visible rows reads the four cells by their test IDs inside the page and hands them all back in one answer.

**Keeping the output the same.** A cell still counts only where it is visible, which repeats the visibility rule the old lookup used. The first visible match is read, with whitespace collapsed and trimmed, and a row without a cell gives an empty string. The fallback reader still returns null when the page has no `user-list-row` or `user-list-status-badge` at all. Nothing that builds the four readings' text was touched, so what each one hands back is unchanged.

**Checked against the running application.** I signed in as the administrator persona, typing the password variable's name as instructed, and opened `/users`, which listed 147 accounts. I ran the old per-cell reads and the new single read side by side on that list:
- **Same output:** both produced the same rows in the same order (compared as JSON).
- **Faster:** the old reads took about 1.65 seconds and the new read about 19 milliseconds.

The 1.65 seconds is from a local browser session; in a full suite run each round trip costs more. That is consistent with the explanation given for R-4.14 failing: the old per-row read on a long list outran its 5-second poll. I could not see that test file here, so I did not confirm that link directly.

**Not verified.** No type check ran. I read the change against the surrounding code by eye:
- It returns the same declared type.
- It uses DOM types the same way the file already does elsewhere (`HTMLTableElement`, `innerText`).
- It passes the existing `as const` test-ID map into the page.

**Not touched.** No other member or page, and not `tests/adapters/new/bindings.yaml`. The four readings were already `bound` and still are, so that file needed no change. Nothing outside `tests/adapters/new/` was edited, and this run found no route that failed to resolve.

## Ruling

**Verdict:** approve
**By:** runner:checks

Approved by the runner's checks, which policy.gates.G3.auto_approve lets settle bind-adapter proposals: the acceptance typecheck of 6da7d7c90b is clean; no condition is open against it; no escalation stands on it; nothing outside tests/adapters changed.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `6da7d7c90b805c798f39b0ae337317d1c006c5f9`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
