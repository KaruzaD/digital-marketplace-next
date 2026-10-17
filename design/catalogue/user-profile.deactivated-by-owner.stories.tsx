import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, InlineAlert } from "@bcgov/design-system-react-components";
import { PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, ReadOnlyDetails, UserPage } from "./user-kit";

// user-profile · deactivated-by-owner — no reactivation control; the person comes back by signing in (R-4.19, R-4.9)
const meta: Meta = { title: "users/user-profile/deactivated-by-owner", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeactivatedByOwner: StoryObj = {
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
          <InlineAlert
            variant="info"
            title="This person deactivated their own account on September 2, 2026"
            description="An administrator cannot reactivate it. The person reactivates it themselves by signing in again."
          />
        </Region>
      </UserPage>
    </SitePage>
  ),
};
