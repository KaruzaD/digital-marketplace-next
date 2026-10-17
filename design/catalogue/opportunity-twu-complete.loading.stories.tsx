import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, OpportunityPage, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-complete · loading — the report has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-twu-complete/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <PageTitle>Team With Us opportunity report</PageTitle>
        <Waiting label="Loading report" />
      </OpportunityPage>
    </SitePage>
  ),
};
