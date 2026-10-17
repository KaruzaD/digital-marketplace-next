import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN } from "./opportunity-kit";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-view · awarded — an awarded opportunity names its successful proponent to everyone; their contact
// details and score are shown only to those who may see the proposal's score, here an administrator, and withheld
// from anyone else (R-1.26, R-1.27)
const meta: Meta = { title: "opportunities/opportunity-cwu-view/awarded", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Awarded: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="opportunities">
      <OpportunityViewPage program="code-with-us" state="awarded" />
    </SitePage>
  ),
};
