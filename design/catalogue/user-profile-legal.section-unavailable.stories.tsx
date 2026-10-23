import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";
import { VendorProfileForAdministrator } from "./user-profile-sections";

// user-profile-legal · section-unavailable — an administrator asked for a vendor's legal section and is shown the
// profile section instead; nobody may accept terms on a vendor's behalf (R-4.33, R-4.34, R-4.16)
const meta: Meta = { title: "users/user-profile-legal/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <VendorProfileForAdministrator />
    </SitePage>
  ),
};
