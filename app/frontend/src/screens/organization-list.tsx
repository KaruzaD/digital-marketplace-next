import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import {
  OrganizationViewer,
  compareByLegalName,
  listOffersDetailColumns,
  listOffersRegistration,
  pageOf,
} from "@rules/organizations";
import { ListedOrganization, fetchOrganizations } from "../api/organizations";
import { useSession } from "../auth/session";
import { useLoadingShown } from "../app/loading";
import { Actions, PageTitle, Waiting } from "../app/opportunity-kit";
import { OrganizationPage, OrganizationRows, Pagination } from "../app/organization-kit";
import { useScreenTitle } from "../app/screen-title";

/**
 * The organization list, at `/organizations` (organization-list).
 *
 * Anyone may browse it: every organization that has not been archived, by legal name, fifty to a
 * page, a page past the last showing the first (R-3.1). Each row shows the organization's logo,
 * which anyone may see (R-8.28), and its legal name. Vendors and administrators are offered the
 * owner, team size and qualification columns, filled only where the service tells them — every
 * row for an administrator, the rows a vendor owns or administers — and only those rows link to
 * the organization's management page (R-3.3, R-3.21). A vendor is offered Create organization
 * and My organizations (R-3.2).
 */

const TITLE = "Digital Marketplace Organizations";

export function OrganizationListScreen() {
  useScreenTitle(TITLE);
  const session = useSession();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const viewer: OrganizationViewer | null = session.status === "signed-in" ? session.account : null;
  const settled = session.status !== "starting";
  const viewerId = viewer?.id ?? null;
  const [answer, setAnswer] = useState<readonly ListedOrganization[] | "loading" | "refused" | "failed">("loading");

  // Asked once it is known whom the list is for, since what the service tells depends on it.
  useEffect(() => {
    if (!settled) return;
    let current = true;
    setAnswer("loading");
    void fetchOrganizations().then((found) => {
      if (!current) return;
      setAnswer(found.kind === "listed" ? [...found.organizations].sort(compareByLegalName) : found.kind);
    });
    return () => {
      current = false;
    };
  }, [settled, viewerId]);

  const loading = answer === "loading";
  const loadingShown = useLoadingShown(loading);
  if (loading) {
    if (!loadingShown) return null;
    return (
      <OrganizationPage>
        <PageTitle>{TITLE}</PageTitle>
        <Waiting label="Loading organizations" />
      </OrganizationPage>
    );
  }
  if (answer === "refused") {
    return (
      <OrganizationPage>
        <PageTitle>{TITLE}</PageTitle>
        <div data-testid="organization-list-refused">
          <InlineAlert
            variant="danger"
            role="alert"
            title="You are not permitted to see these organizations"
            description="Only a signed-in vendor can see the organizations they act for."
          />
        </div>
      </OrganizationPage>
    );
  }
  if (answer === "failed") {
    return (
      <OrganizationPage>
        <PageTitle>{TITLE}</PageTitle>
        <InlineAlert variant="danger" role="alert" title="The organizations could not be loaded" description="Try again in a moment." />
      </OrganizationPage>
    );
  }

  const detailed = listOffersDetailColumns(viewer);
  const { page, pageCount, items } = pageOf(answer, search.page);
  const caption = !detailed
    ? "Registered organizations by legal name."
    : viewer?.type === "ADMIN"
      ? "Registered organizations by legal name. Archived organizations are not listed."
      : "Registered organizations by legal name. Owner, team size and qualification are shown only for organizations you own or administer.";

  return (
    <OrganizationPage>
      <PageTitle>{TITLE}</PageTitle>
      {listOffersRegistration(viewer) ? (
        <Actions>
          <Link href="/organizations/create" isButton buttonVariant="primary" data-testid="organization-create-link">
            Create organization
          </Link>
          <Link href="/users/me?tab=organizations" isButton buttonVariant="secondary" data-testid="organization-list-my-organizations">
            My organizations
          </Link>
        </Actions>
      ) : null}
      <OrganizationRows organizations={items} full={detailed} caption={caption} />
      <Pagination page={page} pages={pageCount} />
    </OrganizationPage>
  );
}
