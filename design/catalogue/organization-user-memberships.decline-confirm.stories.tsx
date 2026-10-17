import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeclineDialog, MembershipsPage } from "./organization-memberships";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-user-memberships · decline-confirm — the invited person, on their organizations reached by account
// identifier, is asked to confirm declining; declining is as direct as accepting (R-3.32, R-3.35).
// The whole page is drawn behind the dialog, as in organization-user-memberships · default.
const meta: Meta = { title: "organizations/organization-user-memberships/decline-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeclineConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MembershipsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003">
        <DeclineDialog />
      </MembershipsPage>
    </SitePage>
  ),
};
