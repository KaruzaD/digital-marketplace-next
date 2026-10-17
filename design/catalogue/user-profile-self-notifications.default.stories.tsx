import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { NotificationsPage } from "./user-profile-sections";

// user-profile-self-notifications · default — notices of new opportunities turned on (R-4.29)
const meta: Meta = { title: "users/user-profile-self-notifications/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <NotificationsPage base="/users/me" />
    </SitePage>
  ),
};
