import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { CapabilitiesPage } from "./user-profile-sections";

// user-profile-self-capabilities · default — a vendor recording their own capabilities, one description expanded (R-4.8)
// Capability names and descriptions are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "users/user-profile-self-capabilities/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <CapabilitiesPage base="/users/me" />
    </SitePage>
  ),
};
