import type { Meta, StoryObj } from "@storybook/react-vite";
import { AcceptDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · accept-confirm — the invited person, arriving from the invitation email's
// accept choice or pressing Accept here, is asked to confirm joining; nothing changes until they do (R-3.9, R-3.31, R-3.35).
// The whole page is drawn behind the dialog, as in organization-user-memberships-self · default.
const meta: Meta = { title: "organizations/organization-user-memberships-self/accept-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AcceptConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/me">
        <AcceptDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
