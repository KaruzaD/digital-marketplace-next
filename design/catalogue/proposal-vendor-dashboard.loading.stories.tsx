import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, VENDOR, Waiting } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-vendor-dashboard · loading — the vendor's proposals have not arrived yet
const meta: Meta = { title: "proposals/proposal-vendor-dashboard/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <Waiting label="Loading your proposals" />
      </ProposalPage>
    </SitePage>
  ),
};
