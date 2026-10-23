import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { LegalPage } from "./user-profile-sections";

// user-profile-legal · terms-updated — an administrator announced changed terms; standing acceptance withdrawn (R-4.16)
const meta: Meta = { title: "users/user-profile-legal/terms-updated", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TermsUpdated: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <LegalPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" updated />
    </SitePage>
  ),
};
