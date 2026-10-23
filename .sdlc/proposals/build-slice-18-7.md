---
gate: G3
question: "Does slice 18 (The chair agrees a consensus and the questions stage is finalised) do what its criteria say?"
recommendation: "## Slice 18 restyle: consensus screens now match the design catalogue\n\nAll of slice 18's criteria were already built in an earlier run (decision record 0063); this run only changed how the consensus s…"
opened: 2026-10-18T22:34:13.740Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

# Does slice 18 (The chair agrees a consensus and the questions stage is finalised) do what its criteria say?

**Recommendation.** ## Slice 18 restyle: consensus screens now match the design catalogue

All of slice 18's criteria were already built in an earlier run (decision record 0063); this run only changed how the consensus s…

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

## Slice 18 restyle: consensus screens now match the design catalogue

All of slice 18's criteria were already built in an earlier run (decision record 0063); this run only changed how the consensus screens look. I restyled them to the approved design catalogue and kept every test ID, route, message and behaviour. `npm --prefix app run check` passes: 16 + 862 + 643 tests across the three workspaces, and the typecheck is clean.

**How each criterion is reached is unchanged:**
- **The Consensus tab** is on the Sprint and Team With Us manage pages at `?tab=consensus`.
- **The chair's per-proponent consensus pages** are under `…/proposals/:id/team-questions/consensus/create` and `…/:chairId/edit` (`resource-questions` for Team With Us).
- **Finalise consensus scores** is in the manage page's action bar, offered only to the owner and to administrators.
- **Behind the screens:** the finalise rules, screening in the top proponents, and the submitted and finalised notices sent as blind copies all work as decision 0063 describes. Who may read individual evaluations (R-5.28) and the one evaluation flow shared by both programs (R-5.36) are reached through the same consensus pages.

**What changed on screen:**
- **Shared component:** the evaluation kit in `app/frontend/src/app/evaluation-kit.tsx` gained one shared piece, `PanelScores`, which shows each question's evaluators' scores as rows. I added it there once rather than per screen.
- **Consensus tab** (`screens/evaluation-consensus-tab.tsx`):
  - The table is now the kit's rows, which become stacked cards on a phone. Each status is a coloured label: grey for not started, blue for a draft, green for submitted.
  - The owner who is not on the panel sees the explanation in the kit's notice box.
  - A refused submission takes focus again after each attempt.
  - The submit button sits in the standard actions area.
  - While loading, the tab shows a waiting indicator inside the page frame.
- **Finalise refusal:** it now has the catalogue's focus-taking wrapper. The manage page counts refused attempts, so a second refusal is drawn fresh and takes focus again.
- **Consensus forms** (`screens/evaluation-consensus-form.tsx`):
  - Both forms now use the same head as the individual scoring forms: what the page is, the program and status labels, the anonymous name as the main heading, then the opportunity title and the proponent's place.
  - Each question is the kit's question box, with the evaluators' scores as rows.
  - The read-only view (a panel member who is not the chair, or after finalising) is one panel per question.
- **Removed:** two old helpers that only this form still used, `Heading1` and `OpportunityLine` in the individual evaluation form.

**One visible difference to know about:** I followed the stories exactly, so the proponent's response now appears only on the create page. The edit page and the read-only view no longer repeat it. A later reader who wants it back can re-add one component.

**Tests added:** six unit tests in `app/frontend/tests/consensus.test.tsx`. They cover:
- rows drawn as list items under a labelled list;
- the colour of each status label;
- the submit button's placement;
- the notice wrapper for the owner off the panel;
- focus moving to the finalise refusal on the first and the second attempt;
- the head, question boxes, response and panel-score rows on the create page;
- the status in the head and no response on the edit page;
- one panel per question in the chair-only view.

The earlier tests for this slice still pass unchanged.

**Things to watch:**
- Rows are now `<li>` items instead of `<tr>`, under the same test IDs. A row's text now includes a column name that is hidden on screen, for example "Consensus: Submitted".
- On the edit page the status moved from a "Status:" line into the head and kept its test ID.

These are recorded in `docs/decisions/0084-the-consensus-tab-and-forms-follow-the-chosen-direction.md`.

I had nothing to build outside this slice and touched nothing outside `app/` and `docs/decisions/`. I could not check the screens in a browser here, so the layout has been checked only through these unit tests. The next slice (19, the challenge stages) can reuse `PanelScores` and the rows from the kit.
