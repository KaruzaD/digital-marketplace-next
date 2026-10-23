import { useEffect, useState } from "react";
import { Link, Text } from "@bcgov/design-system-react-components";
import { PROGRAM_NAMES, Program } from "@rules/opportunities";
import { ownsOrAdministers } from "@rules/organizations";
import type { Account } from "../api/accounts";
import { fetchOwnMemberships } from "../api/organizations";
import { CwuProposal, listCwuProposals } from "../api/proposals";
import { TeamProposal, listTeamProposals } from "../api/team-proposals";
import { Label } from "../app/marketplace";
import { Actions, DataTable, PageTitle, Region, Waiting } from "../app/opportunity-kit";
import { ProposalPage } from "../app/proposal-kit";
import { TitledAlert } from "../app/titled-alert";
import { readDate } from "../lib/dates";
import { ProposalStatusBadge } from "./proposal-cwu-form";

/**
 * The dashboard as a vendor sees it (proposal-vendor-dashboard), as its stories draw it: the H1,
 * the section links, then the proposals they wrote and, under a heading of its own, the proposals
 * put forward for organizations they own or administer — never another vendor's (R-2.24). Each
 * list that is empty says so in words; a vendor who owns and administers no organization has no
 * organizations' heading at all. Each row links to the proposal's manage page. All three programs
 * are listed together, each row naming its program as a grey label and its status as a coloured one.
 */

/** One proposal as the dashboard lists it, in any of the three programs. */
export interface DashboardProposal {
  readonly id: string;
  readonly program: Program;
  readonly opportunity: { readonly id: string; readonly title: string };
  readonly status: string;
  readonly updatedAt: string;
  readonly createdBy: { readonly id: string; readonly name: string } | null;
  /** The organization it is put forward for, if any. */
  readonly organization: { readonly id: string; readonly legalName: string } | null;
}

export function dashboardProposalOfCwu(proposal: CwuProposal): DashboardProposal {
  return {
    id: proposal.id,
    program: "code-with-us",
    opportunity: proposal.opportunity,
    status: proposal.status,
    updatedAt: proposal.updatedAt,
    createdBy: proposal.createdBy,
    organization: proposal.proponent.tag === "organization" ? proposal.proponent.value : null,
  };
}

export function dashboardProposalOfTeam(proposal: TeamProposal): DashboardProposal {
  return {
    id: proposal.id,
    program: proposal.program,
    opportunity: proposal.opportunity,
    status: proposal.status,
    updatedAt: proposal.updatedAt,
    createdBy: proposal.createdBy,
    organization: proposal.organization,
  };
}

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "failed" }
  | { readonly kind: "listed"; readonly proposals: readonly DashboardProposal[]; readonly managed: ReadonlySet<string> };

/** Which of the listed proposals go under which heading. */
export function vendorDashboardRows(
  account: Pick<Account, "id">,
  proposals: readonly DashboardProposal[],
  managed: ReadonlySet<string>,
): { mine: DashboardProposal[]; organizations: DashboardProposal[] } {
  const newestFirst = (a: DashboardProposal, b: DashboardProposal) => b.updatedAt.localeCompare(a.updatedAt);
  return {
    mine: proposals.filter((proposal) => proposal.createdBy?.id === account.id).sort(newestFirst),
    organizations: proposals.filter((proposal) => proposal.organization !== null && managed.has(proposal.organization.id)).sort(newestFirst),
  };
}

const manageAddress = (proposal: DashboardProposal) => `/opportunities/${proposal.program}/${proposal.opportunity.id}/proposals/${proposal.id}/edit`;

function OpportunityLink({ proposal }: { proposal: DashboardProposal }) {
  return (
    <Link href={manageAddress(proposal)} data-testid="dashboard-proposal-link">
      {proposal.opportunity.title || "Untitled opportunity"}
    </Link>
  );
}

export function VendorDashboard({ account }: { account: Account }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });

  useEffect(() => {
    let current = true;
    void Promise.all([
      listCwuProposals(),
      listTeamProposals("sprint-with-us"),
      listTeamProposals("team-with-us"),
      fetchOwnMemberships(),
    ]).then(([codeWithUs, sprintWithUs, teamWithUs, memberships]) => {
      if (!current) return;
      if (codeWithUs.kind !== "listed" || sprintWithUs.kind !== "listed" || teamWithUs.kind !== "listed") {
        setLoaded({ kind: "failed" });
        return;
      }
      const managed = new Set(
        memberships.kind === "listed"
          ? memberships.memberships.filter((membership) => ownsOrAdministers(membership)).map((membership) => membership.organization.id)
          : [],
      );
      const proposals = [
        ...codeWithUs.proposals.map(dashboardProposalOfCwu),
        ...sprintWithUs.proposals.map(dashboardProposalOfTeam),
        ...teamWithUs.proposals.map(dashboardProposalOfTeam),
      ];
      setLoaded({ kind: "listed", proposals, managed });
    });
    return () => {
      current = false;
    };
  }, []);

  if (loaded.kind === "loading") {
    return (
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <Waiting label="Loading your proposals" />
      </ProposalPage>
    );
  }
  if (loaded.kind === "failed") {
    return (
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <TitledAlert variant="danger" role="alert" title="Your proposals could not be loaded">
          <Text elementType="p">Reload the page to try again.</Text>
        </TitledAlert>
      </ProposalPage>
    );
  }

  const administersAny = loaded.managed.size > 0;
  const { mine, organizations } = vendorDashboardRows(account, loaded.proposals, loaded.managed);
  return (
    <ProposalPage>
      <PageTitle>Dashboard</PageTitle>
      <nav aria-label="Dashboard sections">
        <Actions>
          <Link href="#my-proposals" data-testid="dashboard-show-my-proposals">
            My proposals
          </Link>
          {administersAny ? (
            <Link href="#organization-proposals" data-testid="dashboard-show-org-proposals">
              My organizations' proposals
            </Link>
          ) : null}
        </Actions>
      </nav>
      <Region id="my-proposals" title="My proposals">
        {mine.length === 0 ? (
          <div data-testid="dashboard-empty-my-proposals">
            <p className="op-text">
              You have not started any proposals. <Link href="/opportunities">Browse opportunities</Link> to find one to bid on.
            </p>
          </div>
        ) : (
          <DataTable
            captionId="my-proposals-caption"
            caption="Proposals you wrote, most recently updated first"
            columns={["Opportunity", "Program", "Status", "Last updated"]}
            testId="dashboard-my-proposals-table"
          >
            {mine.map((proposal) => (
              <tr key={proposal.id} data-testid="dashboard-proposal-row">
                <td>
                  <OpportunityLink proposal={proposal} />
                </td>
                <td>
                  <Label>{PROGRAM_NAMES[proposal.program]}</Label>
                </td>
                <td>
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td>{readDate(proposal.updatedAt)?.label ?? ""}</td>
              </tr>
            ))}
          </DataTable>
        )}
      </Region>
      {administersAny ? (
        <Region id="organization-proposals" title="My organizations' proposals">
          {organizations.length === 0 ? (
            <div data-testid="dashboard-empty-org-proposals">
              <p className="op-text">No one has started a proposal for an organization you own or administer.</p>
            </div>
          ) : (
            <DataTable
              captionId="org-proposals-caption"
              caption="Proposals written for organizations you own or administer"
              columns={["Opportunity", "Organization", "Program", "Written by", "Status"]}
              testId="dashboard-org-proposals-table"
            >
              {organizations.map((proposal) => (
                <tr key={proposal.id} data-testid="dashboard-proposal-row">
                  <td>
                    <OpportunityLink proposal={proposal} />
                  </td>
                  <td>{proposal.organization?.legalName ?? ""}</td>
                  <td>
                    <Label>{PROGRAM_NAMES[proposal.program]}</Label>
                  </td>
                  <td>{proposal.createdBy?.name ?? ""}</td>
                  <td>
                    <ProposalStatusBadge status={proposal.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </Region>
      ) : null}
    </ProposalPage>
  );
}
