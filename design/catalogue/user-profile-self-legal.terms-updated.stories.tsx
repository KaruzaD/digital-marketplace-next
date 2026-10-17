import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { LegalPage } from "./user-profile-sections";

// user-profile-self-legal · terms-updated — an administrator announced changed terms; standing acceptance withdrawn (R-4.16)
const meta: Meta = { title: "users/user-profile-self-legal/terms-updated", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TermsUpdated: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <LegalPage base="/users/me" updated />
    </SitePage>
  ),
};
