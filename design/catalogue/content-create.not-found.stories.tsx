import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · not-found — anybody but an administrator opened /content/create directly and is shown the
// not-found screen (R-7.6, R-7.10). Drawn for a vendor.
const meta: Meta = { title: "content/content-create/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
