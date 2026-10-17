import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsEmpty } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · empty — a vendor who owns no organization and belongs to none; each section
// says so in words instead of showing an empty table (wording is the design's own: gap 6)
const meta: Meta = { title: "organizations/organization-user-memberships-self/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsEmpty base="/users/me" />
    </SitePage>
  ),
};
