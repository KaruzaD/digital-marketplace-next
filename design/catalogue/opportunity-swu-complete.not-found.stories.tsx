import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-complete · not-found — anyone but an administrator, the opportunity's own author included (R-1.40)
const meta: Meta = { title: "opportunities/opportunity-swu-complete/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF}>
      <MissingPage />
    </SitePage>
  ),
};
