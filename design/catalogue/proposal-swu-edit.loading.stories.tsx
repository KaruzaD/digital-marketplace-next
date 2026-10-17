import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, VENDOR, Waiting } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · loading — the proposal has not arrived yet
const meta: Meta = { title: "proposals/proposal-swu-edit/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Manage a Sprint With Us proposal</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    </SitePage>
  ),
};
