import type { Meta, StoryObj } from "@storybook/react-vite";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { CapabilitiesPage } from "./user-profile-sections";

// user-profile-capabilities · default — a vendor recording their capabilities, one description expanded (R-4.8)
// Capability names and descriptions are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "users/user-profile-capabilities/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <CapabilitiesPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
    </SitePage>
  ),
};
