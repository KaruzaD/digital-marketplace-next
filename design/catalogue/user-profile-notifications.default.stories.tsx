import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { NotificationsPage } from "./user-profile-sections";

// user-profile-notifications · default — notices of new opportunities turned on (R-4.29)
const meta: Meta = { title: "users/user-profile-notifications/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <NotificationsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
    </SitePage>
  ),
};
