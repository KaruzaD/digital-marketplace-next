import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeclineDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships-self · decline-confirm — the invited person, arriving from the invitation email's
// decline choice or pressing Decline here, is asked to confirm; declining is as direct as accepting (R-3.32, R-3.35).
// The whole page is drawn behind the dialog, as in organization-user-memberships-self · default.
const meta: Meta = { title: "organizations/organization-user-memberships-self/decline-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeclineConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/me">
        <DeclineDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
