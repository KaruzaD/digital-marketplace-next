---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed condition 1 (R-7.19): the footer is now read as the whole footer, not just the small block holding the ownership line."
opened: 2026-10-17T20:03:39.760Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed condition 1 (R-7.19): the footer is now read as the whole footer, not just the small block holding the ownership line.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed condition 1 (R-7.19): the footer is now read as the whole footer, not just the small block holding the ownership line. The type check did not run, so the change is checked only against the live page.

**What changed.** In `tests/adapters/new/index.ts`, `siteFooter()` (around line 181) used to pick the *last* match of "the contentinfo landmark, or the parent of the 'Owned and operated by the B.C. Government.' line". On the page the ruling saw, both of those match: the ownership line sits in its own small block inside the landmark. Taking the last match picked that inner block, so `presentWhenSignedOut` returned only the ownership line and `aboutLink` came back empty. It now takes the *first* match. An outer element always comes before the elements inside it on a page, so the first match is the whole footer: the landmark when there is one, and the block around the ownership line when there is not. I updated the comment above it. That was the only edit.

**Checked on the target.** On `http://localhost:4300/` the footer is now a single contentinfo landmark, and the page I opened did not show the ownership line at all. Its layout differs a little from the one in the ruling's evidence, but both layouts resolve to the same element under the new rule. Run against the live page, the new locator:
- matched exactly one element, the whole footer;
- had text ending "ABOUT THIS SERVICE / About / Disclaimer / Privacy / Accessibility / Copyright / © 2026 Government of British Columbia.";
- returned `/content/about` for the About link.

**Not done.** I could not run `tsc` or a standalone Playwright script, because the sandbox refused both commands. The change only swaps `.last()` for `.first()`, so it cannot alter any types, but the type check has not been run.

**Left alone.** Every other page footer reads, including `contentFooter`'s link reads, `openFromFooter` and the footer trim in `mainText`, already goes through `siteFooter()`, so they pick up the fix with no changes of their own. `bindings.yaml` is unchanged, because nothing moved between bound, unbound and absent. No other member was rebound, and nothing outside `tests/adapters/new/` was touched.

Nothing is deferred.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does this adapter bind every surface action and observation on new, and nothing else — specifically, does it answer the R-7.19 revision request from build-slice-1-8? Ruling: approve. The only change is siteFooter() in tests/adapters/new/index.ts taking .first() instead of .last() of `getByRole('contentinfo').or(<parent of the ownership line>)`. Playwright resolves an .or() union in document order, and an ancestor precedes its descendants, so when the ownership line sits in its own block inside the contentinfo landmark the first match is the landmark, the whole footer, which is what the reviewer asked for. Where there is no landmark it still falls back to the block around the ownership line. The change is navigation/locator only, carries no assertion or pass/fail logic, leaves bindings.yaml and everything under tests/acceptance untouched, and the runner-owned tsc check on bf291d383a passed with no diagnostics under adapters/new/, which covers the type check the author could not run. The author's live check reports one matched element containing all five R-7.19 link labels and /content/about for the About link. What would change the ruling: a verify run of slice 1 in which R-7.19 still reads only the ownership line or an empty About link, or the footer locator resolving to more than one element.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `bf291d383a7ee9584a5de1453ad4d7c4b75de66d`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
