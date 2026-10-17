import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-create · not-found — a vendor or a visitor who has not signed in may not create an opportunity (R-1.7)
const meta: Meta = { title: "opportunities/opportunity-twu-create/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
