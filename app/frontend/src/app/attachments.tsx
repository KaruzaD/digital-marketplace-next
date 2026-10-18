import { useCallback, useRef, useState, type ReactNode } from "react";
import { Button, Link, Text, TextField } from "@bcgov/design-system-react-components";
import {
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_LABEL,
  attachmentName,
  fileContentAddress,
  fileNameError,
  readableSize,
} from "@rules/files";
import { downloadFile } from "../api/files";
import { Attachment, AttachmentUpload, uploadAttachment } from "../api/opportunities";
import { Panel, SectionTitle } from "./opportunity-kit";
import { FormPart } from "./proposal-kit";
import { TitledAlert } from "./titled-alert";

/**
 * The attachment control (design/DESIGN.md, files, file-attachment-control), shared by the
 * opportunity forms.
 *
 * The limit is stated before a file is chosen, and the trigger points at it (R-8.17); a file over
 * it is refused where it was chosen and never sent. A file within it is stored as soon as it is
 * chosen, under its own name and with no read access recorded against the file itself, so what it
 * is attached to decides who may read it (R-8.19, R-8.20, R-8.25); its row then offers it at its
 * own address. On a saved opportunity it is attached at once as well, so the opportunity carries
 * it whatever is done next — publishing, leaving the tab — and removing a new row detaches it at
 * once (decision record 0033). A new attachment can still be renamed until the form is saved,
 * with its original ending put back if it is left off (R-8.27): a renamed one is stored again
 * under its new name when the form is saved, and that is the one the opportunity keeps.
 */

/** A file chosen on this device, and the copy stored when it was chosen. */
export interface NewAttachment {
  readonly key: string;
  readonly file: File;
  readonly typedName: string;
  /** Why the file cannot be attached: too large, or refused when it was stored or attached. */
  readonly refusal: string | null;
  /** Shown once a save has been tried: the resulting name is not a name a file may have (R-8.23). */
  readonly nameError: string | null;
  /** The file as stored under its own name when it was chosen, once that has finished. */
  readonly stored: Attachment | null;
  /** Being stored now. */
  readonly uploading: boolean;
}

/** Where the host is an opportunity already saved: what it carries can be changed at once. */
export interface AttachmentOptions {
  /** Makes the opportunity carry exactly these files, answering with why not when refused. */
  readonly attach?: (fileIds: readonly string[]) => Promise<string | null>;
}

export const SIZE_RULE = `Any type of file, up to ${FILE_SIZE_LIMIT_LABEL} each.`;

/** The words on a row whose file is over the limit, giving its size and the limit (R-8.17). */
export function tooLargeMessage(file: Pick<File, "size">): string {
  return `It is ${readableSize(file.size)}. Attachments must be ${FILE_SIZE_LIMIT_LABEL} or smaller. Remove it, then attach a smaller file.`;
}

function nameErrorFor(attachment: NewAttachment): string | null {
  const name = attachmentName(attachment.file.name, attachment.typedName);
  const error = fileNameError(name);
  return error ? `${error} With its ending, this one is ${name.length}.` : null;
}

/** What storing the new attachments came to. */
export type StoredAttachments =
  | { readonly ok: true; readonly ids: readonly string[] }
  | { readonly ok: false };

function refusalOf(answer: Exclude<AttachmentUpload, { kind: "stored" }>): string {
  return answer.kind === "refused" && answer.reasons.length > 0 ? answer.reasons.join(" ") : "The file could not be stored. Try again.";
}

/** The attachments a form is holding: those already stored that it keeps, and those it adds. */
export function useAttachments(initial: readonly Attachment[], options: AttachmentOptions = {}) {
  const { attach } = options;
  const [kept, setKeptState] = useState<readonly Attachment[]>(initial);
  const [fresh, setFreshState] = useState<readonly NewAttachment[]>([]);
  // The same lists, read by work that finishes after the render that started it.
  const keptNow = useRef<readonly Attachment[]>(initial);
  const freshNow = useRef<readonly NewAttachment[]>([]);
  // What the saved opportunity carries, as far as this form has changed it.
  const attachedNow = useRef<readonly string[]>(initial.map((attachment) => attachment.id));
  const attaching = useRef<Promise<unknown>>(Promise.resolve());
  const uploads = useRef(new Map<string, Promise<void>>());
  const counter = useRef(0);

  const setKept = useCallback((next: (current: readonly Attachment[]) => readonly Attachment[]) => {
    keptNow.current = next(keptNow.current);
    setKeptState(keptNow.current);
  }, []);
  const setFresh = useCallback((next: (current: readonly NewAttachment[]) => readonly NewAttachment[]) => {
    freshNow.current = next(freshNow.current);
    setFreshState(freshNow.current);
  }, []);
  const update = useCallback(
    (key: string, change: Partial<NewAttachment>) =>
      setFresh((current) => current.map((row) => (row.key === key ? { ...row, ...change } : row))),
    [setFresh],
  );

  /** Changes what the saved opportunity carries, one change at a time, in the order asked. */
  const persist = useCallback(
    (change: (ids: readonly string[]) => readonly string[]): Promise<string | null> => {
      if (!attach) return Promise.resolve(null);
      const run = attaching.current.then(async () => {
        const next = change(attachedNow.current);
        const refusal = await attach(next);
        if (refusal === null) attachedNow.current = next;
        return refusal;
      });
      attaching.current = run.catch(() => undefined);
      return run;
    },
    [attach],
  );

  const storeAtOnce = useCallback(
    async (row: NewAttachment) => {
      const answer = await uploadAttachment(row.file, row.file.name);
      if (answer.kind !== "stored") {
        update(row.key, { uploading: false, refusal: refusalOf(answer) });
        return;
      }
      const id = answer.attachment.id;
      const refusal = await persist((ids) => [...ids, id]);
      if (!freshNow.current.some((current) => current.key === row.key)) {
        // Removed while it was being stored: it is not to stay attached.
        if (refusal === null) await persist((ids) => ids.filter((each) => each !== id));
        return;
      }
      update(row.key, refusal === null ? { uploading: false, stored: answer.attachment } : { uploading: false, refusal });
    },
    [persist, update],
  );

  const add = useCallback(
    (files: readonly File[]) => {
      const rows: NewAttachment[] = files.map((file) => {
        counter.current += 1;
        const tooLarge = file.size > FILE_SIZE_LIMIT_BYTES;
        // A name no file may have is left until the person has given it another (R-8.23).
        const storable = !tooLarge && fileNameError(file.name) === null;
        return {
          key: `new-${counter.current}`,
          file,
          typedName: "",
          refusal: tooLarge ? tooLargeMessage(file) : null,
          nameError: null,
          stored: null,
          uploading: storable,
        };
      });
      setFresh((current) => [...current, ...rows]);
      for (const row of rows) {
        if (!row.uploading) continue;
        const work = storeAtOnce(row).finally(() => uploads.current.delete(row.key));
        uploads.current.set(row.key, work);
      }
    },
    [setFresh, storeAtOnce],
  );

  const rename = useCallback(
    (key: string, typedName: string) => {
      setFresh((current) =>
        current.map((attachment) =>
          attachment.key === key
            ? { ...attachment, typedName, nameError: attachment.nameError ? nameErrorFor({ ...attachment, typedName }) : null }
            : attachment,
        ),
      );
    },
    [setFresh],
  );

  const removeNew = useCallback(
    (key: string) => {
      const row = freshNow.current.find((attachment) => attachment.key === key);
      setFresh((current) => current.filter((attachment) => attachment.key !== key));
      const id = row?.stored?.id;
      if (id) void persist((ids) => ids.filter((each) => each !== id));
    },
    [persist, setFresh],
  );

  const removeKept = useCallback(
    (id: string) => setKept((current) => current.filter((attachment) => attachment.id !== id)),
    [setKept],
  );

  /**
   * Answers with the identifiers the opportunity should carry once the form is saved: what it
   * keeps, and each new attachment under its resulting name — the copy stored when it was chosen,
   * or, renamed, a copy stored now under the new name. A row that cannot be stored — too large, a
   * name of the wrong length, or refused by the service — is marked with its reason, and nothing
   * is saved.
   */
  const store = useCallback(async (): Promise<StoredAttachments> => {
    await Promise.all(uploads.current.values());
    setFresh((current) => current.map((attachment) => ({ ...attachment, nameError: nameErrorFor(attachment) })));
    const checked = freshNow.current;
    if (checked.some((attachment) => attachment.refusal || attachment.nameError)) return { ok: false };
    const ids: string[] = keptNow.current.map((attachment) => attachment.id);
    const stored: Attachment[] = [];
    for (const attachment of checked) {
      const name = attachmentName(attachment.file.name, attachment.typedName);
      if (attachment.stored && attachment.stored.name === name) {
        stored.push(attachment.stored);
        ids.push(attachment.stored.id);
        continue;
      }
      const answer = await uploadAttachment(attachment.file, name);
      if (answer.kind !== "stored") {
        update(attachment.key, { refusal: refusalOf(answer) });
        return { ok: false };
      }
      stored.push(answer.attachment);
      ids.push(answer.attachment.id);
    }
    // Once the form is saved, what was added is stored like the rest.
    setKept((current) => [...current, ...stored]);
    setFresh(() => []);
    return { ok: true, ids };
  }, [setFresh, setKept, update]);

  return { kept, fresh, attachesAtOnce: attach !== undefined, add, rename, removeNew, removeKept, store };
}

export type AttachmentsState = ReturnType<typeof useAttachments>;

const hiddenInput = { display: "none" } as const;

// The files domain's rows, as `design/catalogue/file-kit.tsx` draws them: rows `small` apart, each
// bordered with its parts `small` apart, a stored row's link and Remove sharing a line where they
// fit. The panel, text and note classes are the opportunity kit's, whose style sheet the root
// layout places once.
const css = `
.fl-rows, .fl-links {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.fl-row, .fl-sub { display: flex; flex-direction: column; gap: var(--layout-margin-small); }
.fl-row > *, .fl-sub > *, .fl-line > * { margin: var(--layout-margin-none); }
.fl-row {
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.fl-line { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-small) var(--layout-margin-medium); }
.fl-chosen { font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.fl-row .bcds-react-aria-TextField { width: 100%; }
`;

function FileStyles() {
  return <style>{css}</style>;
}

/** A download link: the file's own address, fetched with the person's token when followed (R-8.10). */
function DownloadLink({ attachment }: { attachment: Attachment }) {
  return (
    <Link
      href={fileContentAddress(attachment.id)}
      data-testid="attachment-download-link"
      onClick={(event) => {
        event.preventDefault();
        void downloadFile(attachment.id, attachment.name);
      }}
    >
      {`Download ${attachment.name}`}
    </Link>
  );
}

/** What the control is attached to: an opportunity, or a Code With Us proposal. */
export type AttachmentHost = "opportunity" | "proposal";

/** The sentence at the top of the control, as each host's stories word it. */
export function attachmentIntro(host: AttachmentHost, saved: boolean): string {
  if (host === "opportunity") {
    return "Attach any documents proponents need. Anyone who can read this opportunity can read its attachments. Removing an attachment stops it being readable through this opportunity once you save.";
  }
  const intro = "Anyone who can read this proposal can read its attachments. Attachments are checked even when you save a draft.";
  return saved ? `${intro} Removing an attachment stops it being readable through this proposal once you save.` : intro;
}

/**
 * The editable control, as the last panel of an opportunity or proposal form
 * (file-attachment-control): who can read an attachment, the rows or the empty sentence, the
 * stated rule, then Add attachment, which the rule describes (R-8.17, R-8.20, R-8.31).
 */
export function AttachmentControl({
  state,
  headingLevel,
  host = "opportunity",
  saved = true,
  part,
  words,
}: {
  state: AttachmentsState;
  headingLevel: 2 | 3;
  host?: AttachmentHost;
  /** Whether the host has been saved before, so that removing something takes a way of reading it away. */
  saved?: boolean;
  /** Drawn as a numbered part of a long proposal form with this title, in place of a panel. */
  part?: string;
  /**
   * The words of a page whose story words the control its own way (the Code With Us proposal
   * form): no introduction, the limit stated in a sentence of its own, and the button's name.
   */
  words?: { readonly limit: string; readonly add: string };
}) {
  const input = useRef<HTMLInputElement>(null);
  const { kept, fresh } = state;
  const empty = kept.length === 0 && fresh.length === 0;
  // Called, not rendered as a component of its own, so the frame is never remounted and a field
  // inside it keeps its focus as the vendor types.
  const frame = (children: ReactNode) =>
    part ? (
      <FormPart id="form-attachments" title={part}>
        {children}
      </FormPart>
    ) : (
      <Panel id="form-attachments" title="Attachments" level={headingLevel}>
        {children}
      </Panel>
    );
  return frame(
    <>
      <FileStyles />
      {words ? null : <p className="op-text">{attachmentIntro(host, saved)}</p>}
      {empty ? (
        words ? null : <p className="op-text">No attachments have been added.</p>
      ) : (
        <ul className="fl-rows" data-testid="attachment-list">
          {kept.map((attachment) => (
            <li key={attachment.id} className="fl-row" data-testid="attachment-existing-row">
              <TextField
                label="Attachment name"
                value={attachment.name}
                isReadOnly
                description="Already stored, so its name cannot be changed."
                data-testid="attachment-existing-name"
              />
              <div className="fl-line">
                <DownloadLink attachment={attachment} />
                <Button
                  variant="secondary"
                  size="small"
                  aria-label={`Remove ${attachment.name}`}
                  data-testid="attachment-remove-button"
                  onPress={() => state.removeKept(attachment.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
          {fresh.map((attachment) => (
            <NewAttachmentRow key={attachment.key} attachment={attachment} state={state} host={host} />
          ))}
        </ul>
      )}
      <p id="attachment-size-limit" className={words ? "pf-text" : "op-note"} data-testid="attachment-size-limit">
        {words ? words.limit : SIZE_RULE}
      </p>
      {/* The control's own file input, opened by the button. React Aria's FileTrigger is not used:
          the design system bundles its own copy of React Aria, so FileTrigger's press handler
          never reached its Button (as in the image picker and the body editor). It is never
          displayed, so it takes no place in the panel. */}
      <input
        ref={input}
        type="file"
        multiple
        tabIndex={-1}
        aria-hidden="true"
        style={hiddenInput}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          // Cleared so that choosing the same file again is still noticed.
          event.currentTarget.value = "";
          if (files.length > 0) state.add(files);
        }}
      />
      <div className={part ? "pf-attach" : "op-actions"}>
        <Button
          variant="secondary"
          aria-describedby="attachment-size-limit"
          data-testid="attachment-add-button"
          onPress={() => input.current?.click()}
        >
          {words ? words.add : "Add attachment"}
        </Button>
      </div>
    </>,
  );
}

/**
 * A new attachment: what was chosen and where it has got to, then its parts — the name field and
 * the resulting name, or the refusal — and Remove (R-8.17, R-8.23, R-8.27).
 */
function NewAttachmentRow({ attachment, state, host }: { attachment: NewAttachment; state: AttachmentsState; host: AttachmentHost }) {
  const { file } = attachment;
  const resultId = `${attachment.key}-result`;
  const tooLarge = file.size > FILE_SIZE_LIMIT_BYTES;
  return (
    <li className="fl-row" data-testid="attachment-new-row">
      <p className="fl-chosen" role="status">
        {`New: ${file.name}, ${readableSize(file.size)}.${progress(attachment, state.attachesAtOnce, host)}`}
      </p>
      {attachment.stored && !attachment.refusal ? (
        <div className="fl-line">
          <DownloadLink attachment={attachment.stored} />
        </div>
      ) : null}
      {attachment.refusal ? (
        <div data-testid="attachment-size-error">
          <TitledAlert
            variant="danger"
            role="alert"
            title={tooLarge ? `${file.name} is too large to attach` : `${file.name} could not be attached`}
          >
            <Text elementType="p">{attachment.refusal}</Text>
          </TitledAlert>
        </div>
      ) : (
        <>
          <TextField
            label={`Name for ${file.name} (optional)`}
            value={attachment.typedName}
            onChange={(value) => state.rename(attachment.key, value)}
            description={describeRename(file.name)}
            isInvalid={attachment.nameError !== null}
            errorMessage={attachment.nameError ?? undefined}
            aria-describedby={resultId}
            data-testid="attachment-name-field"
          />
          <p id={resultId} className="op-note" data-testid="attachment-resulting-name">
            {`Will be saved as: ${attachmentName(file.name, attachment.typedName)}`}
          </p>
        </>
      )}
      <div className="fl-line">
        <Button
          variant="secondary"
          size="small"
          aria-label={`Remove ${file.name}`}
          data-testid="attachment-remove-button"
          onPress={() => state.removeNew(attachment.key)}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}

/** Where a new attachment has got to, said after its name and size. */
export function progress(
  attachment: Pick<NewAttachment, "refusal" | "stored" | "uploading">,
  attachesAtOnce: boolean,
  host: AttachmentHost = "opportunity",
): string {
  if (attachment.refusal) return "";
  if (attachment.uploading) return " Uploading…";
  if (!attachment.stored) return " It is uploaded when you save.";
  return attachesAtOnce
    ? ` Uploaded and attached to this ${host}. A name typed here is given to it when you save.`
    : ` Uploaded. It is attached to the ${host} when you save it.`;
}

function describeRename(original: string): string {
  const dot = original.lastIndexOf(".");
  const ending = dot > 0 && dot < original.length - 1 ? original.slice(dot) : null;
  return ending
    ? `Leave it empty to keep the name ${original}. If you leave off the ending, ${ending} is added.`
    : `Leave it empty to keep the name ${original}.`;
}

/** The attachments on an opportunity's own page: download links, nothing to change (public-view). */
export function AttachmentList({
  attachments,
  heading = true,
}: {
  attachments: readonly Attachment[];
  /** Whether the list brings its own "Attachments" heading, as it does in a Description section. */
  heading?: boolean;
}) {
  if (attachments.length === 0) return null;
  const list = (
    <ul className="fl-links" aria-labelledby={heading ? "view-attachments" : "form-attachments"} data-testid="attachment-list">
      {attachments.map((attachment) => (
        <li key={attachment.id} data-testid="attachment-existing-row">
          <DownloadLink attachment={attachment} />
        </li>
      ))}
    </ul>
  );
  if (!heading) {
    return (
      <>
        <FileStyles />
        {list}
      </>
    );
  }
  return (
    <div className="fl-sub">
      <FileStyles />
      <SectionTitle level={3} id="view-attachments">
        Attachments
      </SectionTitle>
      {list}
    </div>
  );
}
