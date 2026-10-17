import type { Meta, StoryObj } from "@storybook/react-vite";
import { LeaveDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · leave-confirm — a member, on their organizations reached by account identifier, asked
// to confirm leaving; the membership becomes inactive, they leave its team and this list, and nobody is emailed
// (R-3.10, R-3.32). The whole page is drawn behind the dialog, as in organization-user-memberships · default.
const meta: Meta = { title: "organizations/organization-user-memberships/leave-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const LeaveConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003">
        <LeaveDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
