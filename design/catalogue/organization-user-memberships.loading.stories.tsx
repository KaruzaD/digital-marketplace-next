import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsLoading } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · loading — the vendor's organizations, reached by account identifier, have not arrived yet
const meta: Meta = { title: "organizations/organization-user-memberships/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsLoading base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
    </SitePage>
  ),
};
