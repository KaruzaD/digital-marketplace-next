import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, STAFF, Waiting } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · loading — the proposal has not arrived yet
const meta: Meta = { title: "proposals/proposal-swu-view/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <PageTitle>Sprint With Us proposal</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    </SitePage>
  ),
};
