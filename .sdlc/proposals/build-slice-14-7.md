---
gate: G3
question: "Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?"
recommendation: "I removed the change the ruling called unjustified, and the application is back to its earlier behaviour on proposal forms."
opened: 2026-10-18T03:39:21.299Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** I removed the change the ruling called unjustified, and the application is back to its earlier behaviour on proposal forms.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I removed the change the ruling called unjustified, and the application is back to its earlier behaviour on proposal forms. `npm --prefix app run check` passes on every package: 566 frontend tests, 862 backend tests, and the migrations typecheck. R-8.31's proposal case will still fail until the adapter is fixed, and that fix belongs to another stage.

**What changed**
- **`app/frontend/src/app/attachments.tsx`:** I removed `StoredNewRow`, the `host === "proposal"` branch in `NewAttachmentRow`, and the header comment's mention of decision record 0073.
- **What a proposal form now shows:** a file chosen on a proposal form is shown as a new attachment, just as on the opportunity forms. Once stored, its row has its "Download …" link and its Remove button, and it can still be renamed until the proposal is saved (R-8.27).
- **Decision record 0073:** I deleted it rather than writing a record to replace it. Its argument rested on the cause the ruling found unsupported, and I found no proposal criterion or catalogue story asking for a stored row on proposal forms that would justify keeping it.

**Unit test**
I rewrote the first case in `app/frontend/tests/proposal-attachments.test.tsx`. On the Code With Us proposal create page, with an organization as proponent, it now checks that a stored file:
- appears as a new-attachment list item, with its download link at `/api/files/<id>?type=blob`;
- still has its rename field and the line saying it is attached when the proposal is saved;
- sits inside the region named "3. Attachments".

The rest of the case is unchanged: the file is sent with the draft, and after saving, removing it on the edit form sends an empty attachments list. The second case, a refused file staying a new row with its reason and no link, still passes. The workspace had no dependencies installed, so I ran `npm ci` under `app/` before the check.

**Not mine to do**
The test adapter (`tests/adapters/new/index.ts`, around line 9442) only looks for a section titled exactly "Attachments". The approved design titles this part "3. Attachments" on the Code With Us proposal create and edit forms, so the adapter never finds the attachment row. That fix was filed for the stage that owns the adapter, and I did not touch it.

The other slice 14 criteria were outside this ruling and I left them as built. The next slice will find the Sprint With Us and Team With Us proposal screens, and the criteria for them that the plan answers for in Slice 15, still to come.

## Ruling

**Verdict:** return
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

The question is whether slice 14 (a vendor can propose on a Code With Us opportunity) does what its criteria say. It is returned. All 18 criteria the slice claims passed against tree 30edc73. The fail verdict comes only from R-3.28 regressing, and the evidence puts that on the test, not the application. This branch touches no organization screen and no backend file. In both failure snapshots (.sdlc/evidence/slice-14/R-3.28.txt and R-3.28-2.txt) the page shows exactly the service areas that case was polling for: Data professional + Full stack developer, and Agile coach + Full stack developer. Both cases in tests/acceptance/organizations/R-3.28.spec.ts rewrite the approvals of the same seeded organization (00000000-0000-4000-8000-000000000301). Verify runs seven parallel instances, so each case's poll sees the other's write and the outcome depends on timing, which is how it passed under slice 13. Another build cannot fix this, so the test is sent to derive-tests. The owed instruction build-slice-14-6#2 is satisfied: StoredNewRow and the proposal branch are gone from app/, decision record 0073 no longer exists, and the rename field is restored and asserted. This becomes an approval once a regenerated R-3.28 binds, passes alongside this slice's 18 criteria, and verify records a current pass. If R-3.28 still fails with its two cases isolated, the regression is the application's and the work goes back to build.

**Conditions:**
- condition-met build-slice-14-6#2: StoredNewRow and the host === "proposal" branch are removed from app/frontend/src/app/attachments.tsx, docs/decisions/0073 no longer exists on the branch, and app/frontend/tests/proposal-attachments.test.tsx asserts that a stored file on the proposal create form keeps its rename field (attachment-name-field) and its download link.
- addressed-to derive-tests: Rewrite tests/acceptance/organizations/R-3.28.spec.ts so its two cases cannot change each other's state. Both cases change the approved service areas of the same seeded organization (seed.organizations.qualified, 00000000-0000-4000-8000-000000000301), and verify runs seven instances in parallel. In slice 14's run, case 1 failed at line 74 while the page showed exactly Data professional + Full stack developer, which is what it was waiting for. Case 2 failed at line 51 while the page showed exactly Agile coach + Full stack developer, which is what it was waiting for. Each poll saw the other case's write. Run the two cases serially, or give each case an organization the other does not change. Do not let either rely on another case leaving the seed's approvals in place.
