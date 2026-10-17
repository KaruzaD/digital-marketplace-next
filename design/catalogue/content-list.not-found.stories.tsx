import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-list · not-found — a vendor, a public sector employee or a visitor who is not signed in opened /content
// directly. They are shown the not-found screen, which does not say the area exists (R-7.6). Drawn for a vendor, whose
// header offers no Content section.
const meta: Meta = { title: "content/content-list/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <MissingPage />
    </SitePage>
  ),
};
