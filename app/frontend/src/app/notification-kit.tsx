import type { ReactNode } from "react";
import { Link } from "@bcgov/design-system-react-components";
import type { EmailBlock, EmailInline, ReferenceGroup as SampleGroup, ReferenceMessage } from "../api/notifications";
import { Details, OpportunityPage, SectionTitle, type Detail } from "./opportunity-kit";

/**
 * The notifications domain's own pieces, as `design/catalogue/notification-kit.tsx` draws them: a
 * row that holds a sentence and the button beside it, the status region an immediate save reports
 * into, and the email reference's contents, event sections and preview frame. Built on
 * `./opportunity-kit`; none of them is a design-system component.
 */

const css = `
.nt-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-medium); }
.nt-row > *, .nt-message > *, .nt-preview > *, .nt-contents > * { margin: var(--layout-margin-none); }
.nt-saved { margin: var(--layout-margin-none); font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.nt-saved:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.nt-contents ul {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
  font: var(--typography-regular-small-body);
}
.nt-contents a.bcds-react-aria-Link { font: inherit; }
.nt-message {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-medium);
  padding-top: var(--layout-padding-medium);
  border-top: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.nt-preview {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-medium);
  border-radius: var(--layout-border-radius-medium);
  font: var(--typography-regular-body);
  color: var(--typography-color-primary);
  overflow-wrap: anywhere;
}
.nt-preview-title { font: var(--typography-bold-body); }
.nt-preview-footer { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.nt-preview-footer > a.bcds-react-aria-Link { font: inherit; }
@media (max-width: 767.98px) {
  .nt-row > button { flex: 1 1 100%; justify-content: center; }
  .nt-preview { font: var(--typography-regular-small-body); }
}
`;

export function NotificationStyles() {
  return <style>{css}</style>;
}

/** A whole page of this domain: the opportunity kit's page frame with this kit's style sheet. */
export function NotificationPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <NotificationStyles />
      {children}
    </OpportunityPage>
  );
}

/** A sentence and the control beside it, sharing a line where they fit; on a phone the button goes full width. */
export function NoticeRow({ children }: { children: ReactNode }) {
  return <div className="nt-row">{children}</div>;
}

/**
 * The status region a control that saves at once reports into. It is present before anything is
 * saved, so the outcome is announced; while empty it takes no room but stays in the accessibility tree.
 */
export function SaveStatus({ children }: { children?: ReactNode }) {
  return (
    <p role="status" className="nt-saved">
      {children}
    </p>
  );
}

/** The email reference's contents: an in-page link to every event. */
export function ReferenceContents({ groups }: { groups: readonly SampleGroup[] }) {
  return (
    <nav className="op-region nt-contents" aria-labelledby="email-reference-contents">
      <SectionTitle id="email-reference-contents">Events that send email</SectionTitle>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`#${group.id}`}>{group.event}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * One event on the email reference: an H2 naming the event (its words carry the group's test ID),
 * then each message it sends as an article under a rule, its H3 naming the recipient, its subject
 * and (only where one is written) its summary as details, and its body in the preview frame, a
 * named group so the repeated links inside it are told apart.
 */
export function ReferenceGroup({ group }: { group: SampleGroup }) {
  return (
    <section className="op-region" aria-labelledby={group.id}>
      <SectionTitle id={group.id}>
        <span data-testid="email-reference-group-title">{group.event}</span>
      </SectionTitle>
      {group.messages.map((message) => (
        <SampleMessage key={message.id} message={message} />
      ))}
    </section>
  );
}

function SampleMessage({ message }: { message: ReferenceMessage }) {
  const facts: Detail[] = [{ term: "Subject", value: message.subject, testId: "email-reference-subject" }];
  if (message.summary) facts.push({ term: "Who receives it and why", value: message.summary, testId: "email-reference-summary" });
  return (
    <article className="nt-message" aria-labelledby={message.id}>
      <SectionTitle level={3} id={message.id}>
        {message.recipient}
      </SectionTitle>
      <Details items={facts} />
      <div role="group" aria-label={`Email body: ${message.subject}`} className="nt-preview" data-testid="email-reference-body">
        <p className="nt-preview-title">{message.title}</p>
        {message.body.map((block, index) => (
          <p key={index}>
            <Block block={block} />
          </p>
        ))}
        <p className="nt-preview-footer">
          <Block block={message.footer} />
        </p>
      </div>
    </article>
  );
}

function Block({ block }: { block: EmailBlock }) {
  return block.kind === "paragraph" ? <Inlines content={block.content} /> : <Link href={block.href}>{block.label}</Link>;
}

function Inlines({ content }: { content: readonly EmailInline[] }) {
  return (
    <>
      {content.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <Link key={index} href={part.href}>
            {part.text}
          </Link>
        ),
      )}
    </>
  );
}
