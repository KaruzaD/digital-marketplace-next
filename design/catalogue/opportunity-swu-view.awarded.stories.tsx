import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN } from "./opportunity-kit";
import { OpportunityViewPage } from "./opportunity-view-page";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-view · awarded — an awarded opportunity names its successful proponent to everyone; their contact
// details and score are shown only to those who may see the proposal's score, here an administrator, and withheld
// from anyone else (R-1.26, R-1.27). The page raises its notice that the opportunity has been awarded.
const meta: Meta = { title: "opportunities/opportunity-swu-view/awarded", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Awarded: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="opportunities">
      <OpportunityViewPage program="sprint-with-us" state="awarded" />
    </SitePage>
  ),
};
