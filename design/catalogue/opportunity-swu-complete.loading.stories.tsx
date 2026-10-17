import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, OpportunityPage, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-complete · loading — the report has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-swu-complete/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <PageTitle>Sprint With Us opportunity report</PageTitle>
        <Waiting label="Loading report" />
      </OpportunityPage>
    </SitePage>
  ),
};
