import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-export-all · not-found — a vendor or a visitor opens the address. Only public sector staff and
// administrators may take every proposal away (R-2.38)
const meta: Meta = { title: "proposals/proposal-twu-export-all/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
