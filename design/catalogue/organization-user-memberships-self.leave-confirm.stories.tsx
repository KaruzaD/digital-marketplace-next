import type { Meta, StoryObj } from "@storybook/react-vite";
import { LeaveDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · leave-confirm — a member asked to confirm leaving an organization; the
// membership becomes inactive, they leave its team and this list, and nobody is emailed (R-3.10, R-3.32).
// The whole page is drawn behind the dialog, as in organization-user-memberships-self · default.
const meta: Meta = { title: "organizations/organization-user-memberships-self/leave-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const LeaveConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/me">
        <LeaveDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
