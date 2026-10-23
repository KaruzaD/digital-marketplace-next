import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { LegalPage } from "./user-profile-sections";

// user-profile-self-legal · default — a vendor whose acceptance of the current terms stands (R-4.33)
const meta: Meta = { title: "users/user-profile-self-legal/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <LegalPage base="/users/me" />
    </SitePage>
  ),
};
