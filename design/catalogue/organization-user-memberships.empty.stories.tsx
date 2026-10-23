import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsEmpty } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · empty — a vendor, reached by account identifier, who owns no organization and
// belongs to none; each section says so in words instead of showing an empty table (wording is the design's own: gap 6)
const meta: Meta = { title: "organizations/organization-user-memberships/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsEmpty base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
    </SitePage>
  ),
};
