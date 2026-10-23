import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";
import { PublicSectorOwnProfile } from "./user-profile-sections";

// user-profile-self-legal · section-unavailable — a public sector employee asked for the legal section, which only a
// vendor is shown, and sees their profile section instead (R-4.33, R-4.34)
const meta: Meta = { title: "users/user-profile-self-legal/section-unavailable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SectionUnavailable: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <PublicSectorOwnProfile />
    </SitePage>
  ),
};
