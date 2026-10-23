import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, OpportunityPage, PageTitle, Region, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-dashboard · empty — a public sector employee who has created nothing yet; the wording is not set by any criterion
const meta: Meta = { title: "opportunities/opportunity-dashboard/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <PageTitle>Dashboard</PageTitle>
        <Actions>
          <Link href="/opportunities/create" isButton buttonVariant="primary" data-testid="dashboard-create-opportunity">
            Create an opportunity
          </Link>
        </Actions>
        <Region id="dashboard-mine-heading" title="My opportunities">
          <p className="op-text" data-testid="dashboard-empty-message">
            You have not created any opportunities yet.
          </p>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
