import { useEffect, useState } from "react";
import { mayReadEmailReference } from "@rules/users";
import { type ReferenceGroup as SampleGroup, readEmailReference } from "../api/notifications";
import { useSession } from "../auth/session";
import { useLoadingShown } from "../app/loading";
import { NotFound } from "../app/not-found";
import { NotificationPage, ReferenceContents, ReferenceGroup } from "../app/notification-kit";
import { PageTitle, Waiting } from "../app/opportunity-kit";
import { TitledAlert } from "../app/titled-alert";
import { useScreenTitle } from "../app/screen-title";

/**
 * notification-email-reference: every message the service can send, grouped under the event that
 * sends it, each with its subject, the one-line summary of who receives it and why where one is
 * written, and its body as a recipient sees it, built by the service from invented samples (R-6.13,
 * R-6.19). Each body ends as the sent message ends: Unsubscribe on a new-opportunity announcement,
 * the settings link on every other (R-6.6, R-6.16). Anybody but an administrator is shown the
 * missing page, and nothing is asked of the service. Drawn as its stories draw it, from the
 * notification kit.
 */

const TITLE = "Email Notification Reference";

export function EmailNotificationReferenceScreen() {
  useScreenTitle(TITLE);
  const session = useSession();
  if (session.status === "starting") return <LoadingPage />;
  if (session.status !== "signed-in" || !mayReadEmailReference(session.account)) return <NotFound />;
  return <Reference />;
}

function LoadingPage() {
  return (
    <NotificationPage testId="email-reference-page">
      <PageTitle>{TITLE}</PageTitle>
      <Waiting label="Loading sample emails" />
    </NotificationPage>
  );
}

type Reading = { status: "reading" } | Awaited<ReturnType<typeof readEmailReference>>;

function Reference() {
  const [reading, setReading] = useState<Reading>({ status: "reading" });
  const loadingShown = useLoadingShown(reading.status === "reading");

  useEffect(() => {
    let current = true;
    void readEmailReference().then((answer) => (current ? setReading(answer) : undefined));
    return () => {
      current = false;
    };
  }, []);

  if (reading.status === "reading") return loadingShown ? <LoadingPage /> : null;
  if (reading.status === "not-found") return <NotFound />;
  if (reading.status === "failed") {
    return (
      <NotificationPage testId="email-reference-page">
        <PageTitle>{TITLE}</PageTitle>
        <TitledAlert variant="danger" role="alert" title="The sample emails could not be loaded">
          <p className="op-text">Reload the page to try again.</p>
        </TitledAlert>
      </NotificationPage>
    );
  }
  return <ReferencePage groups={reading.groups} />;
}

function ReferencePage({ groups }: { groups: readonly SampleGroup[] }) {
  return (
    <NotificationPage testId="email-reference-page">
      <div className="op-head">
        <PageTitle>{TITLE}</PageTitle>
        <p className="op-text">
          Every email the service sends, shown as its recipient would see it. The names, addresses and records in these
          samples are invented.
        </p>
      </div>
      <ReferenceContents groups={groups} />
      {groups.map((group) => (
        <ReferenceGroup key={group.id} group={group} />
      ))}
    </NotificationPage>
  );
}
