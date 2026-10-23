import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, ReadOnlyDetails, UserPage } from "./user-kit";

// user-profile · deactivated-by-admin — the reactivation control is offered (R-4.19, R-4.30)
const meta: Meta = { title: "users/user-profile/deactivated-by-admin", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeactivatedByAdmin: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Public sector employee" status="Inactive" id="0b6f2c1e-5a7d-4c3e-9f10-000000000002" />
        <ReadOnlyDetails username="test-gov" name="Test Public Servant" email="gov@example.com" jobTitle="Procurement officer" />
        <Region id="permissions-heading" title="Permissions">
          <Checkbox data-testid="profile-admin-checkbox">Administrator</Checkbox>
        </Region>
        <Region id="status-heading" title="Account status">
          <p className="op-text">An administrator deactivated this account on September 2, 2026.</p>
          <p className="op-text">Reactivating it lets the person sign in again. They will be told by email.</p>
          <Actions>
            <Button variant="primary" data-testid="profile-reactivate-button">Reactivate account</Button>
          </Actions>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
