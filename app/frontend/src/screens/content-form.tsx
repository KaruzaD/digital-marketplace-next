import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Toolbar } from "react-aria-components";
import {
  AlertDialog,
  Button,
  ButtonGroup,
  Form,
  Link,
  Modal,
  ProgressCircle,
  Text,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import {
  ADDRESS_IN_USE,
  PageField,
  PageProblem,
  PAGE_FIELD_LABELS,
  bodyProblem,
  slugProblem,
  titleProblem,
} from "@rules/content";
import {
  EMBEDDED_IMAGE_PLACEHOLDER_ALT,
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_LABEL,
  IMAGE_SIGNATURE_LENGTH,
  IMAGE_TYPES,
  embeddedImageReference,
  imageKindOf,
} from "@rules/files";
import { PageWording, PublishAnswer } from "../api/content";
import { originOfThisApp } from "../api/client";
import { uploadEmbeddedImage } from "../api/files";
import { FieldGroup, FieldPair, PageForm, PublishProblems, Refusal } from "../app/content-kit";
import {
  FORMATTING_LABELS,
  Formatting,
  TextEdit,
  applyFormatting,
  insertImageReference,
} from "../lib/formatted-text/editing";

/**
 * The one form a page is written in, on the create screen and on the managing screen in edit
 * mode (design/DESIGN.md, content, "Forms and validation"): title, address and body, each
 * marked with its reason when the person leaves it (R-7.20, R-7.21); the address rule and the
 * full public address beside the address (R-7.21 note); the body editor with its formatting
 * buttons, its image control and its link to the formatting guide (R-7.26, R-8.29); and a
 * publish button that is unavailable until every field is valid and asks to be confirmed,
 * because a page is public as soon as it is published. It is laid out with the content kit's
 * form pieces (design/catalogue/content-kit.tsx): title and address side by side where they fit,
 * the editor's parts `small` apart, the reason Publish is unavailable just before the submit row.
 */

const hiddenInput = { display: "none" } as const;

export const ADDRESS_RULE =
  "Use lowercase letters and numbers, in groups joined by single hyphens, like about-us. No capital letters, spaces or underscores, and no hyphen at the start or end.";

const FIELD_IDS: Readonly<Record<PageField, string>> = {
  title: "content-title",
  slug: "content-slug",
  body: "content-body",
};

const FORMATTING_ORDER: readonly Formatting[] = ["bold", "italic", "heading", "bulleted", "numbered", "link"];

export interface PageFormProps {
  /** Creating a page, or publishing a change to one. */
  readonly purpose: "create" | "change";
  readonly initial: PageWording;
  /** A page the service needs keeps its address (R-7.25). */
  readonly addressLocked?: boolean;
  /** Said once, before the fields. */
  readonly intro: ReactNode;
  readonly onCancel: () => void;
  readonly onPublish: (wording: PageWording) => Promise<PublishAnswer>;
  /** The page was published; the screen moves on. */
  readonly onPublished: (answer: Extract<PublishAnswer, { kind: "published" }>) => void;
}

const WORDS = {
  create: {
    button: "Publish page",
    buttonTestId: "content-publish-button",
    actions: "Page actions",
    toPublish: "to publish the page",
    ready: "You will be asked to confirm before the page is published.",
    dialogTitle: "Publish this page?",
    dialogTestId: "content-publish-dialog",
    confirmTestId: "content-publish-confirm",
    notPublished: "so this page was not created",
  },
  change: {
    button: "Publish changes",
    buttonTestId: "content-publish-changes-button",
    actions: "Edit actions",
    toPublish: "to publish your changes",
    ready: "You will be asked to confirm before your changes are published.",
    dialogTitle: "Publish your changes?",
    dialogTestId: "content-publish-changes-dialog",
    confirmTestId: "content-publish-changes-confirm",
    notPublished: "so your changes were not published",
  },
} as const;

/** The image control's last outcome, shown between the rule and the body (file-embedded-image). */
type ImageState =
  | { readonly kind: "idle" }
  | { readonly kind: "uploading"; readonly name: string }
  | { readonly kind: "inserted"; readonly name: string }
  | { readonly kind: "failed"; readonly name: string; readonly reason: string };

function megabytes(size: number): string {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/** Why a chosen image cannot be inserted, before anything is sent, or null. */
export async function checkChosenImage(file: Pick<File, "size" | "slice">): Promise<string | null> {
  if (file.size > FILE_SIZE_LIMIT_BYTES) {
    return `It is ${megabytes(file.size)}. Images must be ${FILE_SIZE_LIMIT_LABEL} or smaller. Nothing was added to the body.`;
  }
  try {
    const start = new Uint8Array(await file.slice(0, IMAGE_SIGNATURE_LENGTH).arrayBuffer());
    if (imageKindOf(start) === null) {
      return "It is not a JPEG or PNG image. Choose a JPEG or PNG image. Nothing was added to the body.";
    }
  } catch {
    // A file the browser cannot read here is left for the service to judge.
  }
  return null;
}

export function PageEditor({
  purpose,
  initial,
  addressLocked = false,
  intro,
  onCancel,
  onPublish,
  onPublished,
}: PageFormProps) {
  const words = WORDS[purpose];
  const [wording, setWording] = useState<PageWording>(initial);
  const [touched, setTouched] = useState<ReadonlySet<PageField>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [publishing, setPublishing] = useState(false);
  /** The address the service last said another page holds (R-7.22). */
  const [addressInUse, setAddressInUse] = useState<string | null>(null);
  /** What the service said when it would not publish, and which attempt that was, so a repeat is said again. */
  const [failure, setFailure] = useState<{ readonly reasons: readonly string[]; readonly attempt: number } | null>(null);
  const attempts = useRef(0);
  const [image, setImage] = useState<ImageState>({ kind: "idle" });
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  const problems = useMemo(() => {
    const found: Partial<Record<PageField, PageProblem>> = {};
    const title = titleProblem(wording.title);
    const slug = addressLocked ? null : slugProblem(wording.slug);
    const body = bodyProblem(wording.body);
    if (title) found.title = title;
    if (slug) found.slug = slug;
    if (body) found.body = body;
    return found;
  }, [wording, addressLocked]);

  const ready = Object.keys(problems).length === 0;
  const shown = (["title", "slug", "body"] as const)
    .filter((field) => touched.has(field) && problems[field])
    .map((field) => problems[field] as PageProblem);
  const slugIsInUse = addressInUse !== null && addressInUse === wording.slug;

  // A formatting button or an inserted image says where the selection goes once the new text
  // is drawn.
  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const textarea = bodyField();
    if (!selection || !textarea) return;
    pendingSelection.current = null;
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
  });

  function bodyField(): HTMLTextAreaElement | null {
    return editorRef.current?.querySelector("textarea") ?? null;
  }

  function selectionOfBody(): { start: number; end: number } {
    const textarea = bodyField();
    if (!textarea) return { start: wording.body.length, end: wording.body.length };
    return { start: textarea.selectionStart, end: textarea.selectionEnd };
  }

  function change(field: PageField, value: string) {
    setWording((current) => ({ ...current, [field]: value }));
  }

  function leave(field: PageField) {
    setTouched((current) => (current.has(field) ? current : new Set([...current, field])));
  }

  function applyEdit(edit: TextEdit) {
    pendingSelection.current = { start: edit.selectionStart, end: edit.selectionEnd };
    change("body", edit.value);
  }

  function format(formatting: Formatting) {
    const { start, end } = selectionOfBody();
    applyEdit(applyFormatting(wording.body, start, end, formatting));
  }

  async function insertImage(file: File | undefined) {
    if (!file) return;
    // Where the cursor was when the image was chosen is where it goes.
    const at = selectionOfBody();
    const refusal = await checkChosenImage(file);
    if (refusal) {
      setImage({ kind: "failed", name: file.name, reason: refusal });
      return;
    }
    setImage({ kind: "uploading", name: file.name });
    const stored = await uploadEmbeddedImage(file);
    if (stored.kind !== "stored") {
      const reasons = stored.kind === "refused" && stored.reasons.length > 0 ? `${stored.reasons.join(" ")} ` : "The image could not be stored. ";
      setImage({ kind: "failed", name: file.name, reason: `${reasons}Nothing was added to the body.` });
      return;
    }
    setImage({ kind: "inserted", name: file.name });
    setWording((current) => {
      const edit = insertImageReference(
        current.body,
        at.start,
        at.end,
        embeddedImageReference(stored.id),
        EMBEDDED_IMAGE_PLACEHOLDER_ALT,
      );
      pendingSelection.current = { start: edit.selectionStart, end: edit.selectionEnd };
      return { ...current, body: edit.value };
    });
  }

  async function publish() {
    if (!ready || publishing) return;
    setPublishing(true);
    setFailure(null);
    const answer = await onPublish(wording);
    setPublishing(false);
    setConfirming(false);
    if (answer.kind === "published") {
      onPublished(answer);
      return;
    }
    if (answer.kind === "address-in-use") {
      setAddressInUse(wording.slug);
      setTouched((current) => new Set([...current, "slug"]));
      return;
    }
    attempts.current += 1;
    setFailure({ reasons: answer.kind === "refused" ? answer.reasons : [], attempt: attempts.current });
  }

  const fieldError = (field: PageField): string | undefined =>
    field === "slug" && slugIsInUse
      ? ADDRESS_IN_USE
      : touched.has(field)
        ? problems[field]?.message
        : undefined;

  const publicAddress = slugProblem(wording.slug)
    ? wording.slug === ""
      ? `Public address: ${originOfThisApp()}/content/`
      : "Public address: shown once the address is valid."
    : `Public address: ${originOfThisApp()}/content/${wording.slug}`;

  const addressDescription = addressLocked
    ? "The service needs this page at this address, so the address cannot be changed."
    : purpose === "change"
      ? "Changing the address moves the page at once. Links to the old address will stop working."
      : undefined;

  // While the address the service refused is still in the field, the form says only that: the
  // refusal over the form and at the field, with no intro and no hint (content-create and
  // content-edit, duplicate-slug).
  const hinted = !slugIsInUse;

  return (
    <>
      {addressInUse !== null ? (
        <Refusal key={addressInUse} focus title="This address is already in use" testId="content-duplicate-slug-error">
          {`Another page is already published at /content/${addressInUse}, ${words.notPublished}. `}
          <Link href={`#${FIELD_IDS.slug}`}>Choose a different address</Link>.
        </Refusal>
      ) : null}
      {failure ? (
        <Refusal
          key={failure.attempt}
          focus
          title={purpose === "create" ? "The page was not published" : "Your changes were not published"}
        >
          {failure.reasons.length > 0
            ? failure.reasons.join(" ")
            : "The service could not publish it. Nothing you entered has been lost. Try again."}
        </Refusal>
      ) : null}
      {hinted ? intro : null}
      <Form
        validationBehavior="aria"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) setConfirming(true);
        }}
      >
        <PageForm>
          <FieldPair>
            <TextField
              id={FIELD_IDS.title}
              label="Title"
              isRequired
              description="Between 1 and 100 characters."
              value={wording.title}
              onChange={(value) => change("title", value)}
              onBlur={() => leave("title")}
              isInvalid={fieldError("title") !== undefined}
              errorMessage={fieldError("title")}
              data-testid="content-title-field"
            />
            {addressLocked ? (
              <TextField
                id={FIELD_IDS.slug}
                label="Address"
                isReadOnly
                description={addressDescription}
                value={wording.slug}
                data-testid="content-slug-field"
              />
            ) : (
              <FieldGroup>
                <TextField
                  id={FIELD_IDS.slug}
                  label="Address"
                  isRequired
                  description={addressDescription}
                  value={wording.slug}
                  onChange={(value) => change("slug", value)}
                  onBlur={() => leave("slug")}
                  isInvalid={fieldError("slug") !== undefined}
                  errorMessage={fieldError("slug")}
                  aria-describedby="content-slug-rule content-resulting-address"
                  data-testid="content-slug-field"
                />
                <div id="content-slug-rule" data-testid="content-slug-rule">
                  <Text elementType="p" size="small" color="secondary">
                    {ADDRESS_RULE}
                  </Text>
                </div>
                <div id="content-resulting-address" data-testid="content-resulting-address">
                  <Text elementType="p" size="small" color="secondary">
                    {publicAddress}
                  </Text>
                </div>
              </FieldGroup>
            )}
          </FieldPair>
          {/* A plain wrapper only so the editor can find its text area; the group inside lays it out. */}
          <div ref={editorRef}>
            <FieldGroup>
              <Toolbar aria-label="Formatting for Body" className="ct-toolbar">
                {FORMATTING_ORDER.map((formatting) => (
                  <Button key={formatting} variant="tertiary" size="small" onPress={() => format(formatting)}>
                    {FORMATTING_LABELS[formatting]}
                  </Button>
                ))}
                {/* The editor's own file input, opened by the button. React Aria's FileTrigger is not
                    used: the design system bundles its own copy of React Aria, so FileTrigger's press
                    handler never reached its Button and no file chooser opened (as in image-picker). */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={IMAGE_TYPES.join(",")}
                  tabIndex={-1}
                  aria-hidden="true"
                  style={hiddenInput}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    // Cleared so that choosing the same file again is still noticed.
                    event.currentTarget.value = "";
                    void insertImage(file);
                  }}
                />
                <Button
                  variant="tertiary"
                  size="small"
                  isDisabled={image.kind === "uploading"}
                  aria-describedby="embedded-image-rule"
                  data-testid="content-body-image-button"
                  onPress={() => imageInputRef.current?.click()}
                >
                  Insert image
                </Button>
              </Toolbar>
              <p id="embedded-image-rule" className="op-note" data-testid="image-file-rule">
                {`Insert image takes a JPEG or PNG image, up to ${FILE_SIZE_LIMIT_LABEL}. An inserted image is stored as soon as you choose it and anyone can see it.`}
              </p>
              {image.kind === "uploading" ? (
                <div className="op-wait" role="status" data-testid="embedded-image-uploading">
                  <ProgressCircle isIndeterminate aria-label="Uploading image" />
                  <span className="op-note">{`Uploading ${image.name}…`}</span>
                </div>
              ) : null}
              {image.kind === "inserted" ? (
                <p role="status" className="op-note">
                  {`${image.name} was inserted at the cursor. Replace "${EMBEDDED_IMAGE_PLACEHOLDER_ALT}" with a description of what it shows.`}
                </p>
              ) : null}
              {image.kind === "failed" ? (
                <Refusal title={`${image.name} could not be inserted`} testId="embedded-image-error">
                  {image.reason}
                </Refusal>
              ) : null}
              <TextArea
                id={FIELD_IDS.body}
                label="Body"
                isRequired
                description="Formatted text, between 1 and 50,000 characters. An inserted image is placed at the cursor."
                value={wording.body}
                onChange={(value) => change("body", value)}
                onBlur={() => leave("body")}
                isInvalid={fieldError("body") !== undefined}
                errorMessage={fieldError("body")}
                data-testid="content-body-field"
              />
              <p className="ct-guide">
                <Link href="/content/markdown-guide" target="_blank">
                  How to format text (opens in a new tab)
                </Link>
              </p>
            </FieldGroup>
          </div>
          {shown.length > 0 ? (
            <PublishProblems title={`Fix ${shown.length} ${shown.length === 1 ? "field" : "fields"} ${words.toPublish}`}>
              {shown.map((problem) => (
                <li key={problem.field} data-testid="field-error">
                  <Link href={`#${FIELD_IDS[problem.field]}`}>
                    {`${PAGE_FIELD_LABELS[problem.field]}: ${problem.summary}`}
                  </Link>
                </li>
              ))}
            </PublishProblems>
          ) : hinted ? (
            <p className="op-text" id="content-publish-hint">
              {ready
                ? words.ready
                : purpose === "create"
                  ? "Fill in the title, address and body to publish the page."
                  : addressLocked
                    ? "Fill in the title and body to publish your changes."
                    : "Fill in the title, address and body to publish your changes."}
            </p>
          ) : null}
          <ButtonGroup ariaLabel={words.actions}>
            <Button variant="secondary" onPress={onCancel} data-testid="content-cancel-button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!ready}
              aria-describedby={shown.length > 0 || hinted ? "content-publish-hint" : undefined}
              data-testid={words.buttonTestId}
            >
              {words.button}
            </Button>
          </ButtonGroup>
        </PageForm>
      </Form>
      <Modal isOpen={confirming} isDismissable onOpenChange={(open) => (publishing ? undefined : setConfirming(open))}>
        <AlertDialog
          variant="confirmation"
          title={words.dialogTitle}
          data-testid={words.dialogTestId}
          buttons={
            <>
              <Button
                variant="secondary"
                isDisabled={publishing}
                onPress={() => setConfirming(false)}
                data-testid="content-dialog-cancel"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={publishing}
                onPress={() => void publish()}
                data-testid={words.confirmTestId}
              >
                {words.button}
              </Button>
            </>
          }
        >
          <Text elementType="p">
            {purpose === "create"
              ? `"${wording.title}" will be public at /content/${wording.slug} as soon as it is published. Anyone can read it, including people who are not signed in.`
              : `Everyone reading /content/${wording.slug} will see the new wording straight away. The wording it replaces is kept on record, but it cannot be viewed or restored from the service.`}
          </Text>
        </AlertDialog>
      </Modal>
    </>
  );
}
