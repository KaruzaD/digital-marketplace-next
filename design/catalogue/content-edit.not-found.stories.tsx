import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · not-found — anybody but an administrator opened a managing screen directly, or an administrator opened
// one for an address no page holds. Both are shown the not-found screen (R-7.6, R-7.10). Drawn for a vendor; an
// administrator sees the same page under their own header.
const meta: Meta = { title: "content/content-edit/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
