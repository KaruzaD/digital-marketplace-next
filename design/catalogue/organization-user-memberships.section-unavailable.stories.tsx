import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";
import { VendorProfileForAdministrator } from "./user-profile-sections";

// organization-user-memberships · section-unavailable — an administrator asked for a vendor's organizations section,
// which is not among the sections an administrator sees on somebody else's account, and is shown the profile
// section instead, with no membership control at all (R-4.34). The section is the users domain's, shared with its own
// section-unavailable stories.
const meta: Meta = { title: "organizations/organization-user-memberships/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <VendorProfileForAdministrator />
    </SitePage>
  ),
};
