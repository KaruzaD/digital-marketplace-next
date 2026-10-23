---
gate: G-DESIGN
question: "Do these screens serve the files criteria, and are they built out of the design system?"
recommendation: "I had no shell, so I couldn't compile or scan anything; the pipeline does both when my turn ends."
opened: 2026-10-17T22:59:26.863Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Do these screens serve the files criteria, and are they built out of the design system?

**Recommendation.** I had no shell, so I couldn't compile or scan anything; the pipeline does both when my turn ends.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I've moved all seven files-domain pages into the new site design. I had no shell, so I couldn't compile or scan anything; the pipeline does both when my turn ends. The last scan found no accessibility violations in the files stories, but that was before this rewrite.

**What I did.** Every page keeps the states it had, so `design/screens.yaml` is unchanged. Each of the 29 stories now renders inside `SitePage`, with a viewer and a current section chosen for each state. The shared parts are in a new `design/catalogue/file-kit.tsx`. It is built from the existing kits:
- **`opportunity-kit.tsx`:** the opportunity head, manage tabs, regions, details and action rows.
- **`content-kit.tsx`:** the page frame, the "Manage a page" head, and the published article and body.
- **`user-kit.tsx`:** the profile's section links and its test viewer.
- **`proposal-kit.tsx`:** the alert title.

The design-system components used most are `TextField`, `Button`, `Link`, `InlineAlert`, `TextArea` and `ProgressCircle`, plus `FileTrigger` and `Toolbar` from `react-aria-components`. Nothing new was built beside the design system: the kit only arranges those components and the other domains' kits, styled with tokens, and the new section of `DESIGN.md` lists each piece.

**The pages and their states:**
- **`file-attachment-control`:** `default`, `empty`, `new-attachment`, `invalid`, `too-large` and `public-view`. It sits in a bordered panel on the Code With Us manage page, seen by an administrator. `public-view` is the opportunity's own page as a vendor sees it.
- **`file-image-picker`:** `default`, `empty`, `chosen` and `rejected`. It sits in the profile's "Edit your details" form, seen by the vendor whose profile it is.
- **`file-embedded-image`:** `default`, `uploading`, `inserted` and `failed` are in the content editor, seen by an administrator. `published` is the public page, seen by a visitor.
- **`file-upload`, `file-description`, `file-download` and `file-attach-by-identifier`:** these addresses answer with data or the file, not a page. They keep their separate states because each is a different answer from the service. Each is drawn as a request-and-answer list in the same layout the users, content and organizations domains use.

**Test IDs.** All of them on these seven pages were already filled in `spec/contract/surface.yaml`. I changed none and added none, and the new stories still render every one, on an element that does what the contract says. So `surface.yaml` is unchanged.

**Two fixes beyond the restyle.**
- **Missing alert titles:** three refusal messages ("site-survey.pdf is too large to attach", "portrait.gif cannot be used as a profile picture" and "harbour-survey.png could not be inserted") had never been visible. The design system's alert drops its title when the alert has other content, so they now use the alert's own title markup.
- **Focus:** the rejected-picture alert and the over-long attachment name now actually take keyboard focus, as the earlier write-up said they would.

**One decision.** I kept the forms around the three controls trimmed, with a line saying whose design the missing part is, rather than drawing each form whole. Drawing them whole would copy the opportunities and users domains' forms into this domain, giving two drawings of one form that could drift apart.

**Gaps, recorded as 62–66 in `DESIGN.md`:**
- **62:** two other domains' stories still show the older controls: `opportunity-cwu-edit · editing` and `user-profile-self · editing`. The first says file limits appear only after a file is chosen, which contradicts R-8.17. The second accepts any image type. I was told to keep those stories as they are, and they aren't mine to change, so they need to adopt this domain's controls in their own pass.
- **63:** "a vendor" has two different test email addresses, one in `opportunity-kit.tsx` and one in `user-kit.tsx`.
- **64:** the same opportunity shows as "Published" to the administrator and "Open" to the vendor.
- **65:** no criterion says who sends the upload and description requests, so I drew them for a vendor.
- **66:** no criterion says whether a row's Remove button should go full width on a phone; it keeps its own width.

I changed nothing under `spec`, `constitution.md` or `.claude/skills`.

## Ruling

**Verdict:** return
**By:** agent:ux-reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Do these screens serve the files criteria, and are they built out of the design system? Returned. The accessibility scan is clean (report.json ok, zero violations across all 29 files stories), every story sits in SitePage's shared container aligned with the banner, file-kit.tsx uses tokens only, and no test ID was changed. But the spacing is doubled where a paragraph is wrapped in a div that carries the id and test ID: file-kit.tsx lines 142-144 (attachment-size-limit), 243-245 (image-file-rule in PictureGroup) and 309-314 (embedded-image-rule in ImageEditor), and the 'Will be saved as' wrapper in file-attachment-control.new-attachment. The kits remove margins only from direct children (.op-panel > *, .fl-group > *, .fl-editor > *), and .op-note sets only font and colour, so the nested <p> keeps the browser's default margin on top of the stack gap. The screenshots show it: in file-attachment-control.default and too-large, the last row, the stated rule and Add attachment sit about twice the panel's medium gap apart; in file-image-picker.default and rejected, the rule's gaps are much wider than the group's small gap; in file-embedded-image.default, the toolbar, rule and Body field are 30-40px apart, where DESIGN.md says small. I would approve once the nested paragraphs carry no margin of their own and the screenshots show even spacing.

**Conditions:**
- In design/catalogue/file-kit.tsx, remove the doubled spacing around the stated rules: the <p className="op-note"> inside the wrapper divs for attachment-size-limit (AttachmentControl), image-file-rule (PictureGroup) and embedded-image-rule (ImageEditor) keeps the browser's paragraph margin on top of the stack gap, because the kits zero only direct children. Either put the id and data-testid on the <p> itself and drop the wrapper, or zero the nested paragraph's margin with var(--layout-margin-none). Keep every test ID on an element that does what surface.yaml says.
- Apply the same fix to the attachment-resulting-name wrapper (<div id="attachment-new-1-result"><p className="op-note">) in design/catalogue/file-attachment-control.new-attachment.stories.tsx, and to any other story in this domain that wraps a paragraph this way inside .op-panel, .fl-row, .fl-group or .fl-editor.
- Re-render and check that, in file-attachment-control default/too-large, file-image-picker default/rejected and file-embedded-image default, the gaps around each stated rule equal the container's own token gap (medium in the panel, small in the row, group and editor).
