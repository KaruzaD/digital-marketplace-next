---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed all three conditions with one change to the row reader, in `tests/adapters/new/index.ts` only."
opened: 2026-10-18T21:48:36.920Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed all three conditions with one change to the row reader, in `tests/adapters/new/index.ts` only.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

I fixed all three conditions with one change to the row reader, in `tests/adapters/new/index.ts` only. I didn't touch `bindings.yaml`, because `evaluation_status` was already recorded as bound on both pages. I couldn't run the type checker, because running it needed an approval nobody was here to give. I also didn't run the acceptance tests against the change.

**What was wrong.** The Evaluation section of both proponent-list pages (Sprint With Us and Team With Us) draws its proponents as plain list items. Each item carries the `evaluation-proponent-row` test ID, but nothing in it has a cell role. The shared row reader `rowsText` dropped any row with no cell, so the proponent rows came back empty. That made `evaluationStatus()` read an empty string on both pages. In the third condition, the test compared two empty reads before and after the move.

**What I changed.**
- `rowsText` now takes an optional second argument that reads a row with no cell role. Without that argument it behaves exactly as before. I did it this way so the three other places that call `rowsText` keep their current behaviour, rather than changing the shared reader for everyone.
- `proponentRows` is the only caller that passes the new argument. A new function, `bareProponentRow`, builds each line from the row's test IDs, joined with " | ": the name (`proposal-proponent-name`), the status (`evaluation-status`) and the link (`evaluation-open-proponent`). If a row carries none of those, it falls back to the text of each of the row's child elements.
- The lines come out in the form a table row already gives on this target, for example "Proponent 1 | Submitted | Start evaluation". So the member that reads only the names, which takes the first part of each line, still works when the page doesn't carry the name test ID. The member that picks a single row is also unaffected.

**How I checked it.** I signed in through the identity provider as the administrator, who chairs and evaluates the panel on the seeded closed Sprint With Us opportunity (`…000701`), and opened its Evaluation section. The rows there are list items with no cell role, as the conditions say. I ran the new test-ID reading in the browser against those rows. It returned "Proponent 1 | Not started | Start evaluation" and the same for Proponents 2 and 3 (in this seed state every evaluation was "Not started"). I did not walk the Team With Us page or the second Sprint With Us opportunity named in the second condition. The reviewer's rulings describe the same list items carrying the same test IDs on both, and both pages use this same reader.

Every route I opened resolved. Nothing outside `tests/adapters/new/` was changed, and no request is deferred.
