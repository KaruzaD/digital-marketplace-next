import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, STAFF, Waiting } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-export-all · loading — the proposals have not arrived yet
const meta: Meta = { title: "proposals/proposal-cwu-export-all/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <PageTitle>Export all Code With Us proposals</PageTitle>
        <Waiting label="Loading proposals" />
      </ProposalPage>
    </SitePage>
  ),
};
