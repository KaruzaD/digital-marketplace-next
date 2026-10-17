import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Label } from "./marketplace";
import { Actions, DataTable, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage, ProposalStatus } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-vendor-dashboard · default — a vendor who owns an organization sees the proposals they wrote and, under a
// separate heading, the proposals written for organizations they own or administer, and never another vendor's. The
// section links move to each list (R-2.24)
const meta: Meta = { title: "proposals/proposal-vendor-dashboard/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const mine = [
  {
    href: "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111/edit",
    title: "Build an accessible permit tracker",
    program: "Code With Us",
    status: "Submitted",
    updated: "September 15, 2026",
  },
  {
    href: "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211/edit",
    title: "Modernize the licence renewal service",
    program: "Sprint With Us",
    status: "Draft",
    updated: "September 12, 2026",
  },
];
const organizations = [
  {
    href: "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311/edit",
    title: "Data platform team",
    organization: "Example Digital Ltd.",
    program: "Team With Us",
    author: "Test Vendor Two",
    status: "Under review",
  },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <nav aria-label="Dashboard sections">
          <Actions>
            <Link href="#my-proposals" data-testid="dashboard-show-my-proposals">
              My proposals
            </Link>
            <Link href="#organization-proposals" data-testid="dashboard-show-org-proposals">
              My organizations' proposals
            </Link>
          </Actions>
        </nav>
        <Region id="my-proposals" title="My proposals">
          <DataTable
            captionId="my-proposals-caption"
            caption="Proposals you wrote, most recently updated first"
            columns={["Opportunity", "Program", "Status", "Last updated"]}
            testId="dashboard-my-proposals-table"
          >
            {mine.map((r) => (
              <tr key={r.href} data-testid="dashboard-proposal-row">
                <td>
                  <Link href={r.href} data-testid="dashboard-proposal-link">
                    {r.title}
                  </Link>
                </td>
                <td>
                  <Label>{r.program}</Label>
                </td>
                <td>
                  <ProposalStatus>{r.status}</ProposalStatus>
                </td>
                <td>{r.updated}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
        <Region id="organization-proposals" title="My organizations' proposals">
          <DataTable
            captionId="org-proposals-caption"
            caption="Proposals written for organizations you own or administer"
            columns={["Opportunity", "Organization", "Program", "Written by", "Status"]}
            testId="dashboard-org-proposals-table"
          >
            {organizations.map((r) => (
              <tr key={r.href} data-testid="dashboard-proposal-row">
                <td>
                  <Link href={r.href} data-testid="dashboard-proposal-link">
                    {r.title}
                  </Link>
                </td>
                <td>{r.organization}</td>
                <td>
                  <Label>{r.program}</Label>
                </td>
                <td>{r.author}</td>
                <td>
                  <ProposalStatus>{r.status}</ProposalStatus>
                </td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
