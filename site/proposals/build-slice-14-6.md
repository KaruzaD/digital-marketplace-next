| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T03:25:01.686Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.300 (Claude Code)) |

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** I changed how a stored attachment's row is drawn on the proposal forms, which I believe is the cause of the one R-8.31 failure.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I changed how a stored attachment's row is drawn on the proposal forms, which I believe is the cause of the one R-8.31 failure. I can't be certain: no browser runs here, and the evidence doesn't show the cause directly. `npm --prefix app run check` passes.

**What the evidence showed.** The test added "R-8.31 removed from a proposal.pdf" on the Code With Us proposal create page, with an organization chosen. It found no row naming the file. Yet the screenshot and page outline show that row with its "Download R-8.31 removed from a proposal.pdf" link. So the upload worked and the link was there.

**The cause I settled on.** The catalogue (`design/catalogue/file-kit.tsx`) has two kinds of row:
- **Stored row** (`attachment-existing-row`): the name read-only, the download link, and Remove.
- **New row** (`attachment-new-row`): a file not yet uploaded, with no link. A refusal appears here.

Since decision record 0033, a file is stored as soon as it is chosen. On the proposal page that left a row that had a download link but was still marked as a new row. A test that looks for the link in a stored row, as the catalogue draws it, finds nothing. That fits everything in the evidence.

I first tried other causes. A slow upload or token renewal, a hidden duplicate file input, a page reload resetting the form, and an Attachments section named differently from the opportunity forms all failed to explain it.

**The change.** On a proposal form, a file that has been stored is now drawn as a stored row:
- It carries `attachment-existing-row`, the read-only "Attachment name" field (`attachment-existing-name`), the download link and Remove.
- Its status line still says the file is attached to the proposal when the proposal is saved.
- A file still uploading, or one that can't be stored (too large, a name no file may have, or refused by the service), stays a new row with its reason as an alert.
- The opportunity forms are untouched, so renaming before saving (R-8.27) works there as before.
- On proposals, a file can no longer be renamed once it is stored. R-8.27 is an opportunity rule and no proposal criterion asks for renaming.
- The change is in `app/frontend/src/app/attachments.tsx`. The Sprint With Us and Team With Us proposal forms use the same control, so they get the same rows.

The reasoning, and what would reverse it, is in `docs/decisions/0073-a-file-stored-on-a-proposal-form-is-a-stored-row.md`.

**Unit tests.** The new file `app/frontend/tests/proposal-attachments.test.tsx` walks the failing case on the real routes, with the service stood in for:
- A vendor opens the create page, chooses an organization and adds the file.
- The file appears as a stored row with its name, a link to `/api/files/<id>?type=blob`, and the "attached when you save" line.
- Saving the draft sends the file with the organization as proponent. On the manage page, Edit, Remove and Save changes sends an empty attachment list.

A second test covers a refused file: it stays a new row with an alert naming it, and has no link. The existing proposal, team proposal, draft and opportunity tests still pass.

**What I couldn't do.** I couldn't confirm the fix against the real acceptance step. If R-8.31's proposal case still fails, the next thing to check is whether that step looks for rows in some other way. I installed the dependencies under `app/` to run the tests and changed nothing outside `app/` and `docs/decisions/`. The other criteria on this slice were not named in the ruling, and I left them as they were.

## Ruling

**Verdict:** return
**By:** agent:tech-lead
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Does slice 14 do what its criteria say? Not yet: R-8.31's proposal case fails, and the evidence shows the fault is in the adapter rather than in the application. I return the proposal, with the adapter fix addressed to bind-adapter. The adapter's add-attachment step (tests/adapters/new/index.ts:5567, addAttachmentFile) looks for the row as a list item inside attachmentRegion(), which is regionNamed(page, /^attachments$/i) at line 9442. That needs a region, or a region's heading, named exactly 'Attachments'. The Code With Us proposal form names that part '3. Attachments' (proposal-cwu-form.tsx:690), as the approved catalogue draws it (design/catalogue/proposal-cwu-create-page.tsx:418, proposal-cwu-edit.editing.stories.tsx:114). The region therefore resolves to nothing and the step reports 'no row naming it', even though the screenshot shows the row and its download link. This also explains why the opportunity case of R-8.31, whose part is plain 'Attachments', passes. This is the case runner:verify raised (spec 7.1): the adapter is wrong, so another build cannot fix it. The build's own diagnosis was that the row's test ID was the problem, but the adapter never reads test IDs. So the stored-row change and decision record 0073 rest on a cause the evidence does not show, and they also take away renaming on proposal forms. The ruling changes to approve once bind-adapter matches the numbered part heading, R-8.31's proposal case passes on a current verify result, and the build carries no change the evidence does not justify.

**Conditions:**
- addressed-to bind-adapter: attachmentRegion() in tests/adapters/new/index.ts (line 9442, regionNamed(page, /^attachments$/i)) only finds a region or heading named exactly 'Attachments'. The Code With Us proposal create and edit forms draw that part as a section named '3. Attachments', which is the approved design (design/catalogue/proposal-cwu-create-page.tsx:418 and proposal-cwu-edit.editing.stories.tsx:114). As a result, proposal-cwu-create.add_attachment in R-8.31's case 'removing an attachment from a proposal withdraws the read path the file held through that proposal' finds no row and fails with 'no row naming it', although the page shows the row with its 'Download R-8.31 removed from a proposal.pdf' link. Make the region lookup accept the numbered part title (for example /^(\d+\.\s*)?attachments$/i) for every proposal form's add_attachment and remove step.
- Withdraw the stored-row change to app/frontend/src/app/attachments.tsx (StoredNewRow and the host === 'proposal' branch in NewAttachmentRow) and decision record 0073, or supersede 0073 with a record saying why. The adapter finds a row by list item and file name, not by attachment-existing-row or attachment-new-row, so the change does not address the R-8.31 failure. It also stops a stored file being renamed on proposal forms. Keep it only if a proposal criterion or a catalogue story for the proposal forms asks for it, and cite that criterion or story in the record.
