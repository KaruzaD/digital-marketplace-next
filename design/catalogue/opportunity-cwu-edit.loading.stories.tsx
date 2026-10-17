import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, OpportunityPage, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · loading — the opportunity has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <PageTitle>Manage a Code With Us opportunity</PageTitle>
        <Waiting label="Loading opportunity" />
      </OpportunityPage>
    </SitePage>
  ),
};
