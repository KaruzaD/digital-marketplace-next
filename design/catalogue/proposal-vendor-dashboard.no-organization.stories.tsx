import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Label } from "./marketplace";
import { Actions, DataTable, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage, ProposalStatus } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-vendor-dashboard · no-organization — a vendor who owns and administers no organization sees only the
// proposals they wrote. There is no organizations' heading and no link to one (R-2.24)
const meta: Meta = { title: "proposals/proposal-vendor-dashboard/no-organization", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const mine = [
  {
    href: "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111/edit",
    title: "Build an accessible permit tracker",
    program: "Code With Us",
    status: "Withdrawn",
    updated: "September 18, 2026",
  },
];

export const NoOrganization: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <nav aria-label="Dashboard sections">
          <Actions>
            <Link href="#my-proposals" data-testid="dashboard-show-my-proposals">
              My proposals
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
      </ProposalPage>
    </SitePage>
  ),
};
