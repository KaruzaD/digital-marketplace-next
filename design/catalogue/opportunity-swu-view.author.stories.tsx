import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-view · author — its author, who (with administrators) alone sees who created and last changed it,
// and who is not offered Watch on their own opportunity (R-1.5, R-1.29)
const meta: Meta = { title: "opportunities/opportunity-swu-view/author", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Author: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="opportunities">
      <OpportunityViewPage program="sprint-with-us" state="author" />
    </SitePage>
  ),
};
