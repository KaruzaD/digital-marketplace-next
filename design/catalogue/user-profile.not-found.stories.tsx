import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_TWO } from "./user-kit";

// user-profile · not-found — somebody other than the owner or an administrator opened the profile (R-4.25); drawn for
// another vendor
const meta: Meta = { title: "users/user-profile/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_TWO}>
      <MissingPage />
    </SitePage>
  ),
};
