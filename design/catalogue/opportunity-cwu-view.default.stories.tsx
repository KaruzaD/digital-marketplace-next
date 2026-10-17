import type { Meta, StoryObj } from "@storybook/react-vite";
import { VENDOR } from "./opportunity-kit";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-view · default — a signed-in vendor on an open opportunity: they can watch it and start a proposal
// (R-1.5, R-1.6, R-1.23, R-2.1)
const meta: Meta = { title: "opportunities/opportunity-cwu-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <OpportunityViewPage program="code-with-us" state="default" />
    </SitePage>
  ),
};
