import type { Meta, StoryObj } from "@storybook/react-vite";
import { AcceptDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · accept-confirm — the invited person, on their organizations reached by account
// identifier, is asked to confirm joining; nothing changes until they do (R-3.9, R-3.31, R-3.35).
// The whole page is drawn behind the dialog, as in organization-user-memberships · default.
const meta: Meta = { title: "organizations/organization-user-memberships/accept-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AcceptConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003">
        <AcceptDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
