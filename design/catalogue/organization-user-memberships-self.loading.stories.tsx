import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembershipsLoading } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · loading — the vendor's organizations have not arrived yet
const meta: Meta = { title: "organizations/organization-user-memberships-self/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsLoading base="/users/me" />
    </SitePage>
  ),
};
