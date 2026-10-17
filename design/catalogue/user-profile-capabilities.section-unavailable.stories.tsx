import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";
import { VendorProfileForAdministrator } from "./user-profile-sections";

// user-profile-capabilities · section-unavailable — an administrator asked for a vendor's capabilities and is shown
// the profile section instead, with no capability control at all (R-4.8, R-4.34)
const meta: Meta = { title: "users/user-profile-capabilities/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <VendorProfileForAdministrator />
    </SitePage>
  ),
};
