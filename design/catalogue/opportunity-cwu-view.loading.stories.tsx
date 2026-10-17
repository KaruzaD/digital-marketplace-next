import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpportunityViewLoading } from "./opportunity-view-page";
import { SitePage, VISITOR, WIDTHS } from "./site";

// opportunity-cwu-view · loading — the opportunity has not arrived yet
const meta: Meta = { title: "opportunities/opportunity-cwu-view/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="opportunities">
      <OpportunityViewLoading program="code-with-us" />
    </SitePage>
  ),
};
