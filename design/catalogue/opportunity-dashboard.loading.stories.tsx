import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpportunityPage, PageTitle, STAFF, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-dashboard · loading — the list of opportunities has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-dashboard/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <PageTitle>Dashboard</PageTitle>
        <Waiting label="Loading your opportunities" />
      </OpportunityPage>
    </SitePage>
  ),
};
