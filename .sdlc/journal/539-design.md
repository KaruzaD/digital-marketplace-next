---
stage: "design"
title: "design files"
at: "2026-10-17T23:05:38.633Z"
cost: 0.5809597999999999
turns: 19
session: "b4cc8ade-b3c7-4e67-8fb2-e2789564ad5e"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

I fixed the doubled spacing around the stated rules on the files screens. I didn't redraw anything else, and no test ID was added, removed or given a different meaning.

**The cause.** The kits' stacks (`.op-panel`, `.fl-row`, `.fl-group`, `.fl-editor`) set the margin to none only on their direct children. The id and test ID for each rule were on a `<div>`, so the `<p className="op-note">` inside it kept the browser's paragraph margin on top of the stack's gap.

**The fix.** I dropped each wrapper and put its id, test ID and the target of the button's `aria-describedby` on the paragraph itself. That way no CSS rule is needed for nested elements, and the gap around each line is just the container's own token. The places I changed:

- **`design/catalogue/file-kit.tsx`, attachment control:** `attachment-size-limit` is now the paragraph, so its gaps are the panel's medium gap. This covers `file-attachment-control` default, too-large and new-attachment.
- **`design/catalogue/file-kit.tsx`, picture group:** `image-file-rule` (id `image-file-rule`) is now the paragraph, so its gaps are the group's small gap. This covers `file-image-picker` default, rejected, chosen and empty.
- **`design/catalogue/file-kit.tsx`, image editor:** `image-file-rule` (id `embedded-image-rule`) is now the paragraph, so its gaps are the editor's small gap. This covers every `file-embedded-image` editing state.
- **`design/catalogue/file-attachment-control.new-attachment.stories.tsx`:** the "Will be saved as" line now carries `attachment-resulting-name` and id `attachment-new-1-result` on the paragraph itself.

**Two more wrappers fixed.** The condition asked for any other story in this domain built the same way, and I found two. Each wrapped a status line in `<div role="status">`: one in `file-image-picker.chosen.stories.tsx` (inside the picture group) and one in `file-embedded-image.inserted.stories.tsx` (inside the editor). Both are now `<p role="status" className="op-note">`. A search of the remaining files stories found no other `<div>` wrapping a paragraph inside these containers. The Refusal wrapper holds an `InlineAlert`, not a bare paragraph, and the uploading status uses a `<span>`, so I left both alone.

**`design/DESIGN.md`.** I appended a "Spacing correction" subsection to the end of the files section. It explains the cause and sets the rule for a build: an element that carries an id, a test ID or a role for a single paragraph is that paragraph, not a `<div>` around it. Nothing other domains wrote was touched. `design/screens.yaml` and `spec/contract/surface.yaml` are unchanged: the test IDs are the same and so is what each one shows.

**What the pipeline still has to confirm.** The fix comes from reading the CSS. I didn't compile, render or scan anything in this turn. The third condition asks for a re-render and a check that the gaps around each rule equal the container's own token (medium in the panel, small in a row, the group and the editor). The pipeline renders and scans the catalogue when this turn ends, so whoever reviews the new screenshots and `design/report.json` should check this in `file-attachment-control` default and too-large, `file-image-picker` default and rejected, and `file-embedded-image` default. None of the conditions was addressed to a person, and I didn't touch any path outside this stage's own.

**Components.** I added none. The screens are still built from the design system's `Button`, `TextField`, `TextArea`, `Link`, `InlineAlert` and `ProgressCircle`, plus `FileTrigger` and `Toolbar` from react-aria-components. The kit's own stacks and rows are the same ones `DESIGN.md` already lists as the project's own components.

**Gaps.** I found no new gaps in the spec. The ones recorded earlier in the files section (62–66) still stand.