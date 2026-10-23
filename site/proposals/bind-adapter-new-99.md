| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T03:33:35.868Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I made the one change the ruling asked for, build-slice-14-6, and left the rest of the binding as it was.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I made the one change the ruling asked for, build-slice-14-6, and left the rest of the binding as it was.

**What changed.** `attachmentRegion()` in `tests/adapters/new/index.ts` used to find only a region or heading named exactly "Attachments". It now also accepts a numbered part title, using `/^\s*(\d+\.\s*)?attachments\s*$/i`, with a one-line comment saying why. The Code With Us proposal create and edit forms draw that part as "3. Attachments", so the old pattern found no region there. That is why `proposal-cwu-create.add_attachment` in R-8.31's removal case stopped with "no row naming it" even though the row and its download link were on the page.

**Where it applies.** This is the only definition of `attachmentRegion()`, so the change reaches every proposal form's `add_attachment` and remove step. The opportunity forms' "Attachments" part, which has no number, still matches as before.

**Not checked.**
- I didn't run the type checker: running it needed an approval this unattended session can't get. The change only replaces one regular expression literal with another, so it shouldn't introduce a type error.
- I didn't reopen the running target to watch the R-8.31 case pass. The ruling had already described what the page shows, and I was told not to start the walk over.

`bindings.yaml` is unchanged, because no member moved between bound, unbound and absent. Nothing outside `tests/adapters/new/` was touched, and no request is deferred.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether this adapter still binds every action and observation on the new target, and nothing more, now that it has taken up the revision request from build-slice-14-6. Approve. The diff swaps one locator pattern in attachmentRegion() (tests/adapters/new/index.ts:9443). The old /^attachments$/i becomes /^\s*(\d+\.\s*)?attachments\s*$/i, so the lookup now finds the Code With Us proposal forms' '3. Attachments' part as well as the opportunity forms' plain 'Attachments' part. That is the change the build-slice-14-6 ruling asked for, and it is the reason R-8.31's proposal-removal case stopped with 'no row naming it'. The change only finds where things are on the page: it adds no assertion and no logic that decides a pass, it touches nothing under tests/acceptance and no protected path, and bindings.yaml correctly stays the same because no member moved between bound and unbound. The runner checked the types itself on this revision, with no diagnostics under adapters/new/, so the type check the author left out is covered. Nobody has yet shown R-8.31 passing with the new lookup; that is verify's job on the next run, and an adapter gate cannot ask for it. Owed instruction build-slice-14-6#2 (the stored-row change in app/frontend/src/app/attachments.tsx and decision record 0073) is build's to do and this proposal does not settle it, so it stays open. The ruling would change to a return if the new pattern matched a part that is not an attachments part, or if verify showed the proposal forms' attachments still not being found.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `aad7edc69bb9505dfd557d6b0d358c45eb639840`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
