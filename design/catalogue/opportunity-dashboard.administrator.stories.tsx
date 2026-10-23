import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Label } from "./marketplace";
import { ADMIN, Actions, DataTable, OpportunityPage, PageTitle, Region, StatusLabel } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-dashboard · administrator — an administrator sees every opportunity, with who created it (R-1.3)
const meta: Meta = {
  title: "opportunities/opportunity-dashboard/administrator",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

const rows = [
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", program: "code-with-us", title: "Build an accessible permit tracker", programName: "Code With Us", status: "Published", updated: "September 10, 2026", author: "Test Public Servant" },
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000202", program: "sprint-with-us", title: "Replace the grant intake forms", programName: "Sprint With Us", status: "Under review", updated: "September 8, 2026", author: "Test Public Servant" },
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000302", program: "team-with-us", title: "Accessibility specialists for the digital office", programName: "Team With Us", status: "Draft", updated: "September 3, 2026", author: "Test Public Servant" },
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000103", program: "code-with-us", title: "Add bilingual support to the park pass form", programName: "Code With Us", status: "Draft", updated: "September 2, 2026", author: "Test Public Servant Two" },
];

export const Administrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <PageTitle>Dashboard</PageTitle>
        <Actions>
          <Link href="/opportunities/create" isButton buttonVariant="primary" data-testid="dashboard-create-opportunity">
            Create an opportunity
          </Link>
        </Actions>
        <Region id="dashboard-mine-heading" title="All opportunities">
          <DataTable
            captionId="dashboard-caption"
            caption="Every opportunity in the service, whoever created it"
            columns={["Title", "Program", "Status", "Last updated", "Created by"]}
            testId="dashboard-opportunities-table"
          >
            {rows.map((r) => (
              <tr key={r.id} data-testid="dashboard-opportunity-row">
                <td>
                  <Link href={`/opportunities/${r.program}/${r.id}/edit`} data-testid="dashboard-opportunity-link">
                    {r.title}
                  </Link>
                </td>
                <td>
                  <Label>{r.programName}</Label>
                </td>
                <td>
                  <StatusLabel>{r.status}</StatusLabel>
                </td>
                <td>{r.updated}</td>
                <td>{r.author}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
