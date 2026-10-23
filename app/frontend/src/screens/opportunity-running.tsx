import { FormEvent, useState } from "react";
import { AlertDialog, Button, Form, Link, Modal, TextArea } from "@bcgov/design-system-react-components";
import { fileContentAddress } from "@rules/files";
import { ADDENDUM_MAX, NOTE_MAX, addendumProblem, cancellationNoteProblem, historyEntryLabel } from "@rules/opportunities";
import { downloadFile } from "../api/files";
import { Addendum, Attachment, HistoryEntry, Reporting } from "../api/opportunities";
import { Actions, DataTable, Details, Region, SectionTitle } from "../app/opportunity-kit";
import { readDate } from "../lib/dates";
import { momentLabel } from "./opportunity-parts";

/**
 * Running an opportunity once it is under way, as every program's manage page does it (design/
 * DESIGN.md, opportunities; decision record 0043): its addenda and the form that adds one
 * (R-1.32), its history with any private notes and their files, which no screen adds (R-1.33),
 * the dialog that cancels it (R-1.28), and the reporting figures on its summary (R-1.30). Nothing here knows which program it is in;
 * what is sent is the page's to say.
 */

/** What sending an action came to: nothing to say, or why it was refused. */
export type Sent = string | null;

/** "Addendum of September 20, 2026". */
export function addendumHeading(addendum: Addendum): string {
  const day = readDate(addendum.createdAt)?.label;
  return day ? `Addendum of ${day}` : "Addendum";
}

/**
 * Every addendum, oldest first, each under its own heading. On the manage page each says who added
 * it; on the public page it does not (opportunity-cwu-view).
 */
export function AddendaList({ addenda, showAuthor }: { addenda: readonly Addendum[]; showAuthor: boolean }) {
  if (addenda.length === 0) return <p className="op-text">No addenda have been added.</p>;
  return (
    <>
      {addenda.map((addendum, index) => (
        <article className="op-region" aria-labelledby={`addendum-${index + 1}`} key={addendum.id} data-testid="addendum">
          <SectionTitle level={3} id={`addendum-${index + 1}`}>
            {addendumHeading(addendum)}
          </SectionTitle>
          {showAuthor && addendum.createdBy ? <p className="op-note">{`Added by ${addendum.createdBy.name}`}</p> : null}
          <p className="op-text">{addendum.description}</p>
        </article>
      ))}
    </>
  );
}

/**
 * The Addenda tab: the addenda so far, and for the author and administrators the form that adds
 * one. It does not ask first; the sentence before its button says the addendum is permanent and
 * who will be emailed (R-1.32, R-1.35).
 */
export function AddendaTab({
  addenda,
  mayAdd,
  announced,
  onAdd,
}: {
  addenda: readonly Addendum[];
  mayAdd: boolean;
  /** Whether adding one emails anybody: not once the opportunity has been cancelled (R-1.35). */
  announced: boolean;
  onAdd: (addendum: string) => Promise<Sent>;
}) {
  const [text, setText] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function add(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    const local = addendumProblem(text);
    if (local) {
      setProblem(local);
      return;
    }
    setSending(true);
    const refusal = await onAdd(text);
    setSending(false);
    if (refusal === null) {
      setText("");
      setProblem(null);
    } else setProblem(refusal);
  }

  return (
    <>
      <AddendaList addenda={addenda} showAuthor />
      {mayAdd ? (
        <Form validationBehavior="aria" className="op-region" onSubmit={(event) => void add(event)}>
          <TextArea
            label="New addendum"
            isRequired
            description={`Up to ${ADDENDUM_MAX.toLocaleString("en-CA")} characters.`}
            value={text}
            onChange={(value) => {
              setText(value);
              if (problem) setProblem(null);
            }}
            isInvalid={problem !== null}
            errorMessage={problem ?? undefined}
            data-testid="addendum-text-field"
          />
          <p className="op-text">
            {announced
              ? "An addendum cannot be changed or removed once it is added. Everyone watching this opportunity, everyone who has submitted a proposal, and its author will be emailed."
              : "An addendum cannot be changed or removed once it is added. Nobody is emailed, because this opportunity has been cancelled."}
          </p>
          <Actions>
            <Button type="submit" variant="primary" isDisabled={sending} data-testid="addendum-add-button">
              Add addendum
            </Button>
          </Actions>
        </Form>
      ) : null}
    </>
  );
}

/** Every change of state and every event, newest first, with who made it (R-1.4, R-1.30). */
export function HistoryTable({ history }: { history: readonly HistoryEntry[] }) {
  return (
    <DataTable
      captionId="history-caption"
      caption="Every change of state and every event, newest first"
      columns={["Date", "Entry", "By", "Note"]}
    >
      {history.map((entry, index) => (
        <tr key={`${entry.createdAt}-${index}`}>
          <td>
            <time dateTime={entry.createdAt}>{momentLabel(entry.createdAt)}</time>
          </td>
          <td>{historyEntryLabel(entry)}</td>
          <td>{entry.createdBy?.name ?? ""}</td>
          <td>
            <HistoryNote note={entry.note} attachments={entry.attachments} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

/** What a history entry's Note column holds: the note, and the files a private note carries. */
export function HistoryNote({ note, attachments }: { note: string | null; attachments: readonly Attachment[] }) {
  return (
    <>
      {note ? <span style={{ whiteSpace: "pre-wrap" }}>{note}</span> : null}
      {attachments.map((attachment) => (
        <span key={attachment.id}>
          {note ? " " : ""}
          {"Attachment: "}
          <Link
            href={fileContentAddress(attachment.id)}
            onClick={(event) => {
              event.preventDefault();
              void downloadFile(attachment.id, attachment.name);
            }}
          >
            {attachment.name}
          </Link>
        </span>
      ))}
    </>
  );
}

/**
 * The confirmation before an administrator cancels an opportunity, with an optional note of up to
 * 1,000 characters (R-1.28); its body says who will be told (R-1.36).
 */
export function CancelDialog({
  isOpen,
  isSending,
  onKeep,
  onConfirm,
}: {
  isOpen: boolean;
  isSending: boolean;
  onKeep: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const problem = cancellationNoteProblem(note);
  return (
    <Modal isOpen={isOpen} isDismissable onOpenChange={(open) => (!open && !isSending ? onKeep() : undefined)}>
      <AlertDialog
        variant="destructive"
        title="Cancel this opportunity?"
        data-testid="opportunity-cancel-dialog"
        buttons={
          <>
            <Button variant="secondary" isDisabled={isSending} onPress={onKeep} data-testid="opportunity-dialog-cancel">
              Keep opportunity
            </Button>
            <Button
              variant="primary"
              danger
              isDisabled={isSending || problem !== null}
              onPress={() => onConfirm(note)}
              data-testid="opportunity-cancel-confirm"
            >
              Cancel opportunity
            </Button>
          </>
        }
      >
        <div className="op-dialog">
          <p className="op-text">
            It will stop accepting proposals, and this cannot be undone. Everyone watching it and everyone who has submitted a
            proposal will be told it has been cancelled, and its author will be told separately.
          </p>
          <TextArea
            label="Note (optional)"
            description={`Up to ${NOTE_MAX.toLocaleString("en-CA")} characters.`}
            value={note}
            onChange={setNote}
            isInvalid={problem !== null}
            errorMessage={problem ?? undefined}
            data-testid="opportunity-cancel-note-field"
          />
        </div>
      </AlertDialog>
    </Modal>
  );
}

/**
 * The Summary tab's reporting figures, for the author and administrators once the opportunity is
 * published (R-1.30); before then, the sentence that says they are counted from publication.
 */
export function ReportingSection({ reporting, unpublished }: { reporting: Reporting | undefined; unpublished: boolean }) {
  if (unpublished || !reporting) {
    return unpublished ? <p className="op-note">Views, watchers and proposals are counted once the opportunity is published.</p> : null;
  }
  return (
    <Region id="reporting-heading" title="Reporting" level={3}>
      <Details
        items={[
          { term: "Views", value: String(reporting.numViews), testId: "reporting-views" },
          { term: "Watchers", value: String(reporting.numWatchers), testId: "reporting-watchers" },
          { term: "Proposals submitted", value: String(reporting.numProposals), testId: "reporting-proposals" },
        ]}
      />
    </Region>
  );
}
