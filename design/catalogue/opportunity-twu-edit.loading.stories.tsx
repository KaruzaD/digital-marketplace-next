import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, OpportunityPage, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · loading — the opportunity has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-twu-edit/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <PageTitle>Manage a Team With Us opportunity</PageTitle>
        <Waiting label="Loading opportunity" />
      </OpportunityPage>
    </SitePage>
  ),
};
