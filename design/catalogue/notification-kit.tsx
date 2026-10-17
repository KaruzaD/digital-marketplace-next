import type { ReactNode } from "react";
import { Button, Checkbox, Link } from "@bcgov/design-system-react-components";
import { ContentPage, CurrentWording, FixedPageWarning, ManageHead, PageActions, PageFacts } from "./content-kit";
import { Actions, Details, OpportunityPage, PageTitle, Panel, Region, SectionTitle, type Detail } from "./opportunity-kit";
import { ProfileTabs, VENDOR_TABS } from "./user-kit";

// The pieces the notifications domain's screens are put together from in the chosen direction (design/DESIGN.md,
// "Notification screens in the chosen direction"): the new-opportunity email control on the list, the settings page the
// unsubscribe offer lands on, the terms broadcast on the terms page's managing screen, the email reference's message
// and preview frame, and the mail catcher's response references. Built on opportunity-kit.tsx, user-kit.tsx and
// content-kit.tsx; this project's own compositions of design-system components and tokens, none of them a
// design-system component.

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
}
.nt-preview-title { font: var(--typography-bold-body); }
.nt-preview-footer { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.nt-preview-footer > a.bcds-react-aria-Link { font: inherit; }
@media (max-width: 767.98px) {
  .nt-row > button { flex: 1 1 100%; justify-content: center; }
  .nt-preview { font: var(--typography-regular-small-body); }
}
`;

// A whole page of this domain: the opportunity page frame (the page container, the direction's style sheets, the
// regions `large` apart, `medium` on a phone) with this kit's style sheet.
export function NotificationPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <NotificationStyles />
      {children}
    </OpportunityPage>
  );
}

export function NotificationStyles() {
  return <style>{css}</style>;
}

// The status region a control that saves at once reports into. It is present before anything is saved, so the outcome
// is announced; while empty it takes no room in the column but stays in the accessibility tree.
function SaveStatus({ children }: { children?: ReactNode }) {
  return (
    <p role="status" className="nt-saved">
      {children}
    </p>
  );
}

// The new-opportunity email control on the list of opportunities (R-6.21, R-6.27): a bordered panel at the head of the
// results, before the first group, with the state in words, the one button naming the choice it offers, and the status
// region its immediate save reports into. Neutral throughout (rule 3). The sentence and the button share a line where
// they fit; on a phone the button goes full width. It is never hidden at any width.
export function OptInControl({ subscribed }: { subscribed: boolean }) {
  return (
    <>
      <NotificationStyles />
      <Panel id="notification-optin-heading" title="New opportunity emails" testId="notification-optin-control">
        <div className="nt-row">
          <p className="op-text" data-testid="notification-optin-state">
            {subscribed
              ? "You are emailed at vendor1@example.com when new opportunities are posted."
              : "You are not emailed when new opportunities are posted."}
          </p>
          <Button variant="secondary" size="medium" data-testid="notification-optin-toggle">
            {subscribed ? "Stop emailing me about new opportunities" : "Email me about new opportunities"}
          </Button>
        </div>
        <SaveStatus>{subscribed ? "Saved. You will be emailed when the next opportunity is posted." : null}</SaveStatus>
      </Panel>
    </>
  );
}

// The signed-in person's own notification settings, which the unsubscribe offer in an email lands on: the users
// domain's notifications section (its H1, section links, address sentence and checkbox, with their test IDs) with the
// sentence saying what the choice covers (R-6.16). The question asked on arrival is passed as `children`.
export function UnsubscribeSettings({
  subscribed,
  announcement,
  children,
}: {
  subscribed: boolean;
  announcement?: string;
  children?: ReactNode;
}) {
  return (
    <NotificationPage>
      <PageTitle>Notifications</PageTitle>
      <ProfileTabs base="/users/me" current="notifications" tabs={VENDOR_TABS} />
      <p className="op-text" data-testid="notifications-email-address">
        Notifications are sent to vendor1@example.com. If this address is wrong, <Link href="/users/me">correct it on your profile</Link>.
      </p>
      <p className="op-text">
        This setting covers only emails announcing newly published opportunities. Other emails from the service, such as
        those about opportunities you watch or proposals you have submitted, are not affected by it.
      </p>
      <Checkbox defaultSelected={subscribed} data-testid="notifications-new-opportunities-checkbox">
        Email me when new opportunities are posted
      </Checkbox>
      <SaveStatus>{announcement}</SaveStatus>
      {children}
    </NotificationPage>
  );
}

// The terms page's managing screen as the content domain draws a page the service needs, with this domain's one
// region after it: what announcing changed terms does, the outcome when there is one, and the button (R-6.23, R-6.24).
// Edit page stays the screen's one primary action, so Notify vendors is secondary. A dialog is passed as `children`.
export function TermsBroadcastPage({ outcome, children }: { outcome?: ReactNode; children?: ReactNode }) {
  return (
    <ContentPage>
      <NotificationStyles />
      <ManageHead title="Terms and conditions" />
      <PageFacts
        slug="terms-and-conditions"
        published={{ iso: "2020-12-02", text: "December 2, 2020" }}
        publishedBy={{ name: "System" }}
        updated={{ iso: "2026-10-15", text: "October 15, 2026" }}
        updatedBy={{ name: "Test Administrator", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000001" }}
      />
      <FixedPageWarning slug="terms-and-conditions" />
      <PageActions deletable={false} />
      <CurrentWording
        title="Terms and conditions"
        slug="terms-and-conditions"
        body="Placeholder: the terms and conditions are the service's own text."
      />
      <Region id="notify-vendors-heading" title="Notify vendors of updated terms">
        {outcome}
        <p className="op-text">
          Use this once the changed terms are published. Every vendor's acceptance of the terms is withdrawn, and each active
          vendor is emailed asking them to read and accept the new terms. Until they accept, they cannot submit proposals to
          Code With Us, Sprint With Us or Team With Us.
        </p>
        <p className="op-text">
          Deactivated vendors are not emailed. Their acceptance is withdrawn too, and they will find the change when they next
          sign in.
        </p>
        <Actions>
          <Button variant="secondary" data-testid="notify-vendors-button">Notify vendors of updated terms</Button>
        </Actions>
      </Region>
      {children}
    </ContentPage>
  );
}

export type SampleMessage = {
  id: string;
  recipient: string;
  subject: string;
  summary?: string;
  title: string;
  paragraphs: string[];
  link?: { text: string; href: string };
  footer: { text: string; href: string };
};

export type SampleGroup = { id: string; event: string; messages: SampleMessage[] };

// One event on the email reference: an H2 naming the event (its words carry the group's test ID), then each message
// it sends as an article under a rule, its H3 naming the recipient, its subject and (only where one is written) its
// summary as details, and its body in the preview frame, a named group so the repeated links inside it are told apart.
export function ReferenceGroup({ group }: { group: SampleGroup }) {
  return (
    <section className="op-region" aria-labelledby={group.id}>
      <SectionTitle id={group.id}>
        <span data-testid="email-reference-group-title">{group.event}</span>
      </SectionTitle>
      {group.messages.map((m) => {
        const facts: Detail[] = [{ term: "Subject", value: m.subject, testId: "email-reference-subject" }];
        if (m.summary) facts.push({ term: "Who receives it and why", value: m.summary, testId: "email-reference-summary" });
        return (
          <article key={m.id} className="nt-message" aria-labelledby={m.id}>
            <SectionTitle level={3} id={m.id}>
              {m.recipient}
            </SectionTitle>
            <Details items={facts} />
            <div role="group" aria-label={`Email body: ${m.subject}`} className="nt-preview" data-testid="email-reference-body">
              <p className="nt-preview-title">{m.title}</p>
              {m.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {m.link ? (
                <p>
                  <Link href={m.link.href}>{m.link.text}</Link>
                </p>
              ) : null}
              <p className="nt-preview-footer">
                <Link href={m.footer.href}>{m.footer.text}</Link>
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

// The reference page's contents: an in-page link to every event.
export function ReferenceContents({ groups }: { groups: SampleGroup[] }) {
  return (
    <nav className="op-region nt-contents" aria-labelledby="email-reference-contents">
      <SectionTitle id="email-reference-contents">Events that send email</SectionTitle>
      <ul>
        {groups.map((g) => (
          <li key={g.id}>
            <Link href={`#${g.id}`}>{g.event}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// A mail catcher address as a response reference: the small line saying the address is the catcher's, the H1, then
// the request or requests and the answer, each as terms and values. These addresses are not the service's and carry
// no test IDs (design/DESIGN.md, notifications gap 14).
export function CatcherReference({
  idPrefix,
  title,
  requestTitle = "Request",
  requests,
  answer,
}: {
  idPrefix: string;
  title: string;
  requestTitle?: string;
  requests: Detail[];
  answer: Detail[];
}) {
  return (
    <NotificationPage>
      <div className="op-head">
        <p className="op-eyebrow">Response reference: this address is the mail catcher's, not the service's</p>
        <PageTitle>{title}</PageTitle>
      </div>
      <Region id={`${idPrefix}-request`} title={requestTitle}>
        <Details items={requests} />
      </Region>
      <Region id={`${idPrefix}-answer`} title="Answer">
        <Details items={answer} />
      </Region>
    </NotificationPage>
  );
}
