import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";
import { VendorProfileForAdministrator } from "./user-profile-sections";

// user-profile-notifications · section-unavailable — an administrator asked for somebody else's notification settings
// and is shown the profile section instead (R-4.34)
const meta: Meta = { title: "users/user-profile-notifications/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <VendorProfileForAdministrator />
    </SitePage>
  ),
};
