import { ReactNode } from "react";
import { mayManagePages } from "@rules/content";
import type { Account } from "../api/accounts";
import { useSession } from "../auth/session";
import { ContentPage } from "./content-kit";
import { NotFound } from "./not-found";
import { PageTitle, Waiting } from "./opportunity-kit";

/**
 * A screen of the content area. An administrator sees it; anybody else who reaches it directly —
 * a vendor, a public sector employee, a visitor who has not signed in — is shown the not-found
 * screen, and nothing is asked of the service (R-7.6). While the session is not yet known, the
 * screen's title stands over the kit's waiting row, as the screen's own loading state draws it.
 */
export function AdministratorsOnly({
  title,
  loadingLabel,
  children,
}: {
  title: string;
  /** What is awaited, without the trailing ellipsis the waiting row adds. */
  loadingLabel: string;
  children: (administrator: Account) => ReactNode;
}) {
  const session = useSession();
  if (session.status === "starting") {
    return (
      <ContentPage>
        <PageTitle>{title}</PageTitle>
        <Waiting label={loadingLabel} />
      </ContentPage>
    );
  }
  if (session.status === "signed-in" && mayManagePages(session.account)) {
    return <>{children(session.account)}</>;
  }
  return <NotFound />;
}
