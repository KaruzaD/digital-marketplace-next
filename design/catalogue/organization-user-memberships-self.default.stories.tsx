import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · default — a vendor's own organizations: the one they own, one they administer,
// one they are an ordinary member of, and an invitation waiting for their answer (R-3.9, R-3.10, R-3.15, R-3.23, R-3.25)
const meta: Meta = { title: "organizations/organization-user-memberships-self/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/me" />
    </SitePage>
  ),
};
