import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · default — a vendor's organizations reached by account identifier: the one they own,
// one they administer, one they are an ordinary member of, and an invitation waiting for their answer
// (R-3.9, R-3.10, R-3.15, R-3.23, R-3.25)
const meta: Meta = { title: "organizations/organization-user-memberships/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
    </SitePage>
  ),
};
