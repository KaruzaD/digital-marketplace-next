import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, VISITOR, WIDTHS } from "./site";

// opportunity-cwu-view · signed-out — a visitor who has not signed in reads the opportunity; nothing is offered to
// act on, since watching needs a signed-in person and a proposal needs a vendor (R-1.5, R-1.6, R-2.1)
const meta: Meta = { title: "opportunities/opportunity-cwu-view/signed-out", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SignedOut: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="opportunities">
      <OpportunityViewPage program="code-with-us" state="signed-out" />
    </SitePage>
  ),
};
