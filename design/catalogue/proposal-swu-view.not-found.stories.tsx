import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · not-found — a proposal this reader may not see: the opportunity has not closed yet, the proposal
// is a draft, or it is another vendor's (R-2.24, R-2.25)
const meta: Meta = { title: "proposals/proposal-swu-view/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
