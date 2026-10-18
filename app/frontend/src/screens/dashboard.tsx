import { useEffect, useState } from "react";
import { Link, Text } from "@bcgov/design-system-react-components";
import type { Account } from "../api/accounts";
import { PROGRAM_NAMES, statusLabel } from "@rules/opportunities";
import { panelRoleLabel } from "@rules/other-program-content";
import { ListedOpportunity, listAllOpportunities } from "../api/opportunity-list";
import { Label } from "../app/marketplace";
import { Actions, DataTable, OpportunityPage, PageTitle, Region, StatusLabel, Waiting } from "../app/opportunity-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { readDate } from "../lib/dates";
import { VendorDashboard } from "./vendor-dashboard";

/**
 * The dashboard, where a returning person lands after signing in (R-4.22), and where the
 * profile-completion page sends a vendor who has agreed to the terms before and every public
 * sector employee (R-4.23).
 *
 * A member of public sector staff sees the opportunities they created, and an administrator every
 * opportunity with who created it (opportunity-dashboard; R-1.3), as the opportunity-dashboard
 * stories draw it: the H1, Create an opportunity, then the table. Each row names the opportunity,
 * links to its manage page, and shows its program and state, in all three programs. A vendor sees
 * their own proposals and their organizations' (proposal-vendor-dashboard; R-2.24). Below their
 * own, public sector staff and administrators see the opportunities whose evaluation panel they
 * sit on (evaluation-panel-dashboard; R-5.19), in the same kind of table.
 */
export function DashboardScreen() {
  useScreenTitle("Dashboard");
  return (
    <RequireSignIn title="Dashboard">
      {(account) => (account.type === "VENDOR" ? <VendorDashboard account={account} /> : <OpportunityDashboard account={account} />)}
    </RequireSignIn>
  );
}

type Listed =
  | { readonly kind: "loading" }
  | { readonly kind: "listed"; readonly opportunities: readonly ListedOpportunity[] }
  | { readonly kind: "failed" };

/** Which of the listed opportunities the dashboard shows: an administrator all, anyone else their own. */
export function dashboardRows(account: Pick<Account, "id" | "type">, all: readonly ListedOpportunity[]): ListedOpportunity[] {
  const shown = account.type === "ADMIN" ? [...all] : all.filter((opportunity) => opportunity.createdBy?.id === account.id);
  return shown.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** The opportunities whose evaluation panel the person sits on, each with their role on it (R-5.19). */
export function panelRows(account: Pick<Account, "id">, all: readonly ListedOpportunity[]): { opportunity: ListedOpportunity; role: string }[] {
  return all
    .flatMap((opportunity) => {
      const seat = opportunity.evaluationPanel?.find((member) => member.user.id === account.id);
      return seat ? [{ opportunity, role: panelRoleLabel(seat) }] : [];
    })
    .sort((a, b) => b.opportunity.updatedAt.localeCompare(a.opportunity.updatedAt));
}

function OpportunityDashboard({ account }: { account: Account }) {
  const [listed, setListed] = useState<Listed>({ kind: "loading" });
  const administrator = account.type === "ADMIN";

  useEffect(() => {
    let current = true;
    void listAllOpportunities().then((answer) => {
      if (current) setListed(answer.kind === "listed" ? { kind: "listed", opportunities: answer.opportunities } : { kind: "failed" });
    });
    return () => {
      current = false;
    };
  }, []);

  if (listed.kind === "loading") {
    return (
      <OpportunityPage>
        <PageTitle>Dashboard</PageTitle>
        <Waiting label="Loading your opportunities" />
      </OpportunityPage>
    );
  }

  const rows = listed.kind === "listed" ? dashboardRows(account, listed.opportunities) : [];
  const seats = listed.kind === "listed" ? panelRows(account, listed.opportunities) : [];
  const mine = administrator ? "All opportunities" : "My opportunities";
  return (
    <OpportunityPage>
      <PageTitle>Dashboard</PageTitle>
      <Actions>
        <Link href="/opportunities/create" isButton buttonVariant="primary" data-testid="dashboard-create-opportunity">
          Create an opportunity
        </Link>
      </Actions>
      <nav className="op-tabs" aria-label="Dashboard sections">
        <ul>
          <li>
            <Link href="#my-opportunities" data-testid="dashboard-show-my-opportunities">
              {mine}
            </Link>
          </li>
          <li>
            <Link href="#evaluations" data-testid="dashboard-show-evaluations">
              Evaluations
            </Link>
          </li>
        </ul>
      </nav>
      <Region id="dashboard-mine-heading" anchor="my-opportunities" title={mine}>
        {listed.kind === "failed" ? (
          <TitledAlert variant="danger" role="alert" title="Your opportunities could not be loaded">
            <Text elementType="p">Reload the page to try again.</Text>
          </TitledAlert>
        ) : rows.length === 0 ? (
          <p className="op-text" data-testid="dashboard-empty-message">
            {administrator ? "There are no opportunities yet." : "You have not created any opportunities yet."}
          </p>
        ) : (
          <DataTable
            captionId="dashboard-caption"
            caption={administrator ? "Every opportunity in the service, whoever created it" : "Opportunities you created"}
            columns={administrator ? ["Title", "Program", "Status", "Last updated", "Created by"] : ["Title", "Program", "Status", "Last updated"]}
            testId="dashboard-opportunities-table"
          >
            {rows.map((opportunity) => (
              <tr key={`${opportunity.program}-${opportunity.id}`} data-testid="dashboard-opportunity-row">
                <td>
                  <Link href={`/opportunities/${opportunity.program}/${opportunity.id}/edit`} data-testid="dashboard-opportunity-link">
                    {opportunity.title || "Untitled opportunity"}
                  </Link>
                </td>
                <td>
                  <Label>{PROGRAM_NAMES[opportunity.program]}</Label>
                </td>
                <td>
                  <StatusLabel>{statusLabel(opportunity.status, opportunity.program)}</StatusLabel>
                </td>
                <td>{readDate(opportunity.updatedAt)?.label ?? ""}</td>
                {administrator ? <td>{opportunity.createdBy?.name ?? ""}</td> : null}
              </tr>
            ))}
          </DataTable>
        )}
      </Region>
      <EvaluationsSection seats={seats} failed={listed.kind === "failed"} />
    </OpportunityPage>
  );
}

/**
 * The opportunities whose panel the person sits on, under their own heading, a draft included, each
 * opening its manage page (evaluation-panel-dashboard; R-5.19).
 */
function EvaluationsSection({ seats, failed }: { seats: readonly { opportunity: ListedOpportunity; role: string }[]; failed: boolean }) {
  return (
    <Region id="dashboard-evaluations-heading" anchor="evaluations" title="Evaluations">
      <p className="op-text">Opportunities whose evaluation panel you sit on, including drafts that are not yet public.</p>
      {failed ? null : seats.length === 0 ? (
        <p className="op-text" data-testid="dashboard-empty-panel-message">
          You are not on the evaluation panel of any opportunity. When an opportunity's owner adds you to its panel, it is listed here.
        </p>
      ) : (
        <DataTable
          captionId="dashboard-panel-caption"
          caption="Opportunities you are evaluating"
          columns={["Title", "Program", "Your role", "Status"]}
          testId="dashboard-panel-opportunities-table"
        >
          {seats.map(({ opportunity, role }) => (
            <tr key={`${opportunity.program}-${opportunity.id}`} data-testid="dashboard-panel-opportunity-row">
              <td>
                <Link href={`/opportunities/${opportunity.program}/${opportunity.id}/edit`} data-testid="dashboard-opportunity-link">
                  {opportunity.title || "Untitled opportunity"}
                </Link>
              </td>
              <td>
                <Label>{PROGRAM_NAMES[opportunity.program]}</Label>
              </td>
              <td>{role}</td>
              <td>
                <StatusLabel>{statusLabel(opportunity.status, opportunity.program)}</StatusLabel>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </Region>
  );
}
