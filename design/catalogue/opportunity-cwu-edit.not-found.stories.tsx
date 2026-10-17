import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · not-found — anyone who is neither the opportunity's author nor an administrator (R-1.3, R-1.30)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
