import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, VENDOR, Waiting } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-export-one · loading — the proposal has not arrived yet
const meta: Meta = { title: "proposals/proposal-twu-export-one/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Export a Team With Us proposal</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    </SitePage>
  ),
};
