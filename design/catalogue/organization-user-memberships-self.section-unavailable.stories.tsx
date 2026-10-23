import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";
import { PublicSectorOwnProfile } from "./user-profile-sections";

// organization-user-memberships-self · section-unavailable — a public sector employee asked for their own
// organizations section, which only a vendor's profile offers, and sees their profile section instead (R-4.34). The
// section is the users domain's, shared with its own section-unavailable stories.
const meta: Meta = { title: "organizations/organization-user-memberships-self/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <PublicSectorOwnProfile />
    </SitePage>
  ),
};
