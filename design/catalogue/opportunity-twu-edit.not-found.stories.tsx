import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · not-found — anyone who is neither the opportunity's author, an administrator, nor on its panel (R-1.3, R-5.19)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
