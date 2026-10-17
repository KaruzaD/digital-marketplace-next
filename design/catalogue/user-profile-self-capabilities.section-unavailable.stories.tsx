import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";
import { PublicSectorOwnProfile } from "./user-profile-sections";

// user-profile-self-capabilities · section-unavailable — a public sector employee asked for capabilities, which their
// profile does not offer, and is shown their profile section instead (R-4.34)
const meta: Meta = { title: "users/user-profile-self-capabilities/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <PublicSectorOwnProfile />
    </SitePage>
  ),
};
