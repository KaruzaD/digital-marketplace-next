import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-export-one · not-found — anyone not entitled to read the proposal: another vendor, a visitor, or staff
// before the opportunity has closed (R-2.24, R-2.25, R-2.37)
const meta: Meta = { title: "proposals/proposal-cwu-export-one/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
