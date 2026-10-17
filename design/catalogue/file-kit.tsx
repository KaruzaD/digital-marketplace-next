import { useEffect, useRef, type ReactNode } from "react";
import { FileTrigger, Toolbar } from "react-aria-components";
import { Button, InlineAlert, Link, ProgressCircle, Text, TextArea, TextField } from "@bcgov/design-system-react-components";
import { ContentPage, ManageHead } from "./content-kit";
import { Actions, Details, ManageTabs, OpportunityHead, PageTitle, Region, SectionTitle, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";
import { ProfileTabs, VENDOR_TABS } from "./user-kit";

// The pieces the files domain's controls and response references are put together from in the chosen direction
// (design/DESIGN.md, "File screens in the chosen direction"): the page frame, the attachment control and its rows, the
// picture group, the body editor with Insert image, the host pages trimmed around each control, and the response
// reference. Built on opportunity-kit.tsx, content-kit.tsx, user-kit.tsx and proposal-kit.tsx; this project's own
// compositions of design-system components and tokens, none of them a design-system component.

// Rows are `small` apart and carry their parts `small` apart; a stored row's link and Remove share a line where they
// fit. A picture is shown at its stored size and never wider than its column (older section's gap 11).
const css = `
.fl-rows, .fl-links {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.fl-row, .fl-group, .fl-editor, .fl-sub { display: flex; flex-direction: column; }
.fl-row > *, .fl-group > *, .fl-editor > *, .fl-sub > *, .fl-line > * { margin: var(--layout-margin-none); }
.fl-row, .fl-group, .fl-editor, .fl-sub { gap: var(--layout-margin-small); }
.fl-row {
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.fl-line { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-small) var(--layout-margin-medium); }
.fl-chosen { font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.fl-group { align-items: flex-start; }
.fl-group-label { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.fl-image { max-width: 100%; height: auto; }
.fl-editor .bcds-react-aria-TextArea { width: 100%; }
.fl-toolbar { display: flex; flex-wrap: wrap; gap: var(--layout-margin-small); }
.fl-guide { font: var(--typography-regular-small-body); }
.fl-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
.ct-body > .fl-image { align-self: flex-start; }
`;

// A whole page of this domain: the content domain's frame (the opportunity page frame, the regions `large` apart and
// `medium` on a phone, and the content kit's styles, which the body editor needs) with this kit's style sheet.
export function FilePage({ children }: { children: ReactNode }) {
  return (
    <ContentPage>
      <style>{css}</style>
      {children}
    </ContentPage>
  );
}

// A line in the catalogue saying whose design a trimmed part of the host page is. A build does not render it.
export function Trimmed({ children }: { children: ReactNode }) {
  return <p className="op-note">{children}</p>;
}

// A refusal that takes keyboard focus when it appears, so it is read out and a keyboard user starts from it. Its title
// is in the alert's own title markup: the design system's InlineAlert drops `title` when it has content of its own.
export function Refusal({ testId, title, focus = false, children }: { testId: string; title: string; focus?: boolean; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focus) box.current?.focus();
  }, [focus]);
  return (
    <div ref={box} tabIndex={focus ? -1 : undefined} className={focus ? "fl-focus" : undefined} data-testid={testId}>
      <InlineAlert variant="danger" role="alert">
        <AlertTitle>{title}</AlertTitle>
        <Text elementType="p">{children}</Text>
      </InlineAlert>
    </div>
  );
}

// ——— The attachment control, on the Code With Us manage page's Opportunity tab ———

const OPPORTUNITY = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit";

// The manage page around the control: its head, its tabs with Opportunity current, and the tab's region, in which the
// form's earlier parts are trimmed (opportunity-cwu-edit · editing draws them).
export function ManageFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <OpportunityHead
        eyebrow="Manage a Code With Us opportunity"
        program="code-with-us"
        status="Published"
        title="Build an accessible permit tracker"
      />
      <ManageTabs
        base={OPPORTUNITY}
        current="opportunity"
        tabs={[
          { key: "summary", label: "Summary" },
          { key: "opportunity", label: "Opportunity" },
          { key: "addenda", label: "Addenda" },
          { key: "history", label: "History" },
        ]}
      />
      <Region id="tab-heading" title="Opportunity">
        <Trimmed>
          The overview, description, details and key dates come first. They are the opportunities domain's design and are
          not shown here.
        </Trimmed>
        {children}
      </Region>
    </>
  );
}

const READERS = "Attach any documents proponents need. Anyone who can read this opportunity can read its attachments.";
const REMOVAL = "Removing an attachment stops it being readable through this opportunity once you save.";

// The control: the form's last part, a bordered panel headed "Attachments" (H3). Who can read an attachment, the rows
// or the empty sentence, the stated rule, then Add attachment, which the rule describes (R-8.17, R-8.20, R-8.31).
export function AttachmentControl({ children }: { children?: ReactNode }) {
  return (
    <section className="op-panel" aria-labelledby="form-attachments">
      <SectionTitle level={3} id="form-attachments">Attachments</SectionTitle>
      {children ? (
        <>
          <p className="op-text">
            {READERS} {REMOVAL}
          </p>
          <ul className="fl-rows" data-testid="attachment-list">
            {children}
          </ul>
        </>
      ) : (
        <>
          <p className="op-text">{READERS}</p>
          <p className="op-text">No attachments have been added.</p>
        </>
      )}
      <p id="attachment-size-limit" className="op-note" data-testid="attachment-size-limit">
        Any type of file, up to 10 MB each.
      </p>
      <Actions>
        <FileTrigger>
          <Button variant="secondary" aria-describedby="attachment-size-limit" data-testid="attachment-add-button">
            Add attachment
          </Button>
        </FileTrigger>
      </Actions>
    </section>
  );
}

function RemoveButton({ name }: { name: string }) {
  return (
    <Button variant="secondary" size="small" aria-label={`Remove ${name}`} data-testid="attachment-remove-button">
      Remove
    </Button>
  );
}

// A stored attachment: its name, read-only (R-8.27 note); its download link at the address it is stored at (R-8.10);
// and Remove.
export function StoredRow({ name, id }: { name: string; id: string }) {
  return (
    <li className="fl-row" data-testid="attachment-existing-row">
      <TextField
        label="Attachment name"
        value={name}
        isReadOnly
        description="Already stored, so its name cannot be changed."
        data-testid="attachment-existing-name"
      />
      <div className="fl-line">
        <Link href={`/api/files/${id}?type=blob`} data-testid="attachment-download-link">
          Download {name}
        </Link>
        <RemoveButton name={name} />
      </div>
    </li>
  );
}

// A new attachment, not yet uploaded: what was chosen, then its parts — the name field, the resulting name, a refusal —
// and Remove (R-8.17, R-8.23, R-8.27).
export function NewRow({ chosen, file, children }: { chosen: string; file: string; children?: ReactNode }) {
  return (
    <li className="fl-row" data-testid="attachment-new-row">
      <p className="fl-chosen">{chosen}</p>
      {children}
      <div className="fl-line">
        <RemoveButton name={file} />
      </div>
    </li>
  );
}

// The attachments on the opportunity's own page: download links under an H3, nothing to rename or remove.
export function PublicAttachments({ files }: { files: { name: string; id: string }[] }) {
  return (
    <div className="fl-sub">
      <SectionTitle level={3} id="view-attachments">Attachments</SectionTitle>
      <ul className="fl-links" aria-labelledby="view-attachments" data-testid="attachment-list">
        {files.map((file) => (
          <li key={file.id} data-testid="attachment-existing-row">
            <Link href={`/api/files/${file.id}?type=blob`} data-testid="attachment-download-link">
              Download {file.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ——— The image picker, on the person's own profile ———

const PICTURE_RULE =
  "A JPEG or PNG image, up to 10 MB. A picture wider or taller than 500 pixels is made smaller to fit, keeping its " +
  "proportions. Anyone can see your profile picture, including people who are not signed in.";

// The profile's editing form around the picker: the H1, the profile's section links, and the users domain's "Edit your
// details" region, whose other fields are trimmed (user-profile-self · editing draws them).
export function ProfileFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <PageTitle>User Profile</PageTitle>
      <ProfileTabs base="/users/me" current="profile" tabs={VENDOR_TABS} />
      {children}
    </>
  );
}

// The picture group: its label, the picture or the sentence standing in for it, any status or refusal, the stated rule,
// then the trigger, which the rule describes (R-8.13, R-8.17, R-8.28, R-8.30).
export function PictureGroup({ trigger, children }: { trigger: string; children: ReactNode }) {
  return (
    <div className="fl-group" role="group" aria-labelledby="picture-label">
      <p className="fl-group-label" id="picture-label">Profile picture (optional)</p>
      {children}
      <p id="image-file-rule" className="op-note" data-testid="image-file-rule">
        {PICTURE_RULE}
      </p>
      <FileTrigger acceptedFileTypes={["image/jpeg", "image/png"]}>
        <Button variant="secondary" aria-describedby="image-file-rule" data-testid="change-avatar">
          {trigger}
        </Button>
      </FileTrigger>
    </div>
  );
}

// The stored picture, shown from the address it is stored at, at its stored size.
export function StoredPicture() {
  return (
    <img
      src="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000805?type=blob"
      alt="Your current profile picture"
      className="fl-image"
      data-testid="profile-image"
    />
  );
}

// ——— Insert image, in the content domain's body editor ———

const BODY = "Placeholder: the rules of the hackathon, written by an administrator.\n\n## Where it happens";

// The managing screen in edit mode around the editor: the head, and the "Edit the page" region, whose title and address
// fields are trimmed (content-edit · editing draws them).
export function EditFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <ManageHead title="Hackathon rules" />
      <Region id="content-edit-heading" title="Edit the page">
        <Trimmed>The title and address come first. They are the content domain's design and are not shown here.</Trimmed>
        {children}
      </Region>
    </>
  );
}

// The content domain's body editor with this domain's rule under the toolbar and a slot for the upload's status or
// refusal between the rule and the body, `small` apart. Insert image is unavailable while an upload runs (R-8.29).
export function ImageEditor({ uploading = false, body = BODY, children }: { uploading?: boolean; body?: string; children?: ReactNode }) {
  return (
    <div className="fl-editor">
      <Toolbar aria-label="Formatting for Body" className="fl-toolbar">
        <Button variant="tertiary" size="small">Bold</Button>
        <Button variant="tertiary" size="small">Italic</Button>
        <Button variant="tertiary" size="small">Heading</Button>
        <Button variant="tertiary" size="small">Bulleted list</Button>
        <Button variant="tertiary" size="small">Numbered list</Button>
        <Button variant="tertiary" size="small">Link</Button>
        <FileTrigger acceptedFileTypes={["image/jpeg", "image/png"]}>
          <Button
            variant="tertiary"
            size="small"
            isDisabled={uploading || undefined}
            aria-describedby="embedded-image-rule"
            data-testid="content-body-image-button"
          >
            Insert image
          </Button>
        </FileTrigger>
      </Toolbar>
      <p id="embedded-image-rule" className="op-note" data-testid="image-file-rule">
        Insert image takes a JPEG or PNG image, up to 10 MB. An inserted image is stored as soon as you choose it and
        anyone can see it.
      </p>
      {children}
      <TextArea
        id="content-body"
        label="Body"
        isRequired
        description="Formatted text, between 1 and 50,000 characters. An inserted image is placed at the cursor."
        defaultValue={body}
        data-testid="content-body-field"
      />
      <p className="fl-guide">
        <Link href="/content/markdown-guide" target="_blank">How to format text (opens in a new tab)</Link>
      </p>
    </div>
  );
}

// The upload under way, announced as a status beside a spinner.
export function Uploading({ file }: { file: string }) {
  return (
    <div className="op-wait" role="status" data-testid="embedded-image-uploading">
      <ProgressCircle isIndeterminate aria-label="Uploading image" />
      <span className="op-note">Uploading {file}…</span>
    </div>
  );
}

// ——— The four service addresses ———

type Part = { items: Detail[]; testId?: string };

// A response reference: the small line saying what the address answers with, the H1, then the request and the answer,
// each as terms and values. A test ID on the whole of a request or an answer is on a wrapper around its details; one on
// a single part is on that value.
export function Reference({
  prefix,
  answersWith = "data",
  title,
  request,
  answer,
}: {
  prefix: string;
  answersWith?: "data" | "the file";
  title: string;
  request: Part;
  answer: Part;
}) {
  return (
    <>
      <div className="op-head">
        <p className="op-eyebrow">Response reference: this address answers with {answersWith}, not a page</p>
        <PageTitle>{title}</PageTitle>
      </div>
      <Region id={`${prefix}-request`} title="Request">
        <div data-testid={request.testId}>
          <Details items={request.items} />
        </div>
      </Region>
      <Region id={`${prefix}-answer`} title="Answer">
        <div data-testid={answer.testId}>
          <Details items={answer.items} />
        </div>
      </Region>
    </>
  );
}
