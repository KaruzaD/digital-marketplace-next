import type { Meta, StoryObj } from "@storybook/react-vite";
import { VENDOR } from "./opportunity-kit";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-view · default — a signed-in vendor on an open opportunity: they can watch it and start a proposal
// (R-1.5, R-1.6, R-1.16, R-1.23, R-2.1). None of the page's own notices applies, so its messages are empty.
const meta: Meta = { title: "opportunities/opportunity-swu-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <OpportunityViewPage program="sprint-with-us" state="default" />
    </SitePage>
  ),
};
