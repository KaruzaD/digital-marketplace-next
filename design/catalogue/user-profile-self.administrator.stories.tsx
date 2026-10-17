import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, ProfileTabs, ReadOnlyDetails, STAFF_TABS, UserPage } from "./user-kit";

// user-profile-self · administrator — an administrator's own profile: status shown, no administrator box,
// no deactivation control (R-4.12, R-4.31, R-4.34)
const meta: Meta = { title: "users/user-profile-self/administrator", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Administrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base="/users/me" current="profile" tabs={STAFF_TABS} />
        <AccountFacts type="Public sector employee" status="Active" id="0b6f2c1e-5a7d-4c3e-9f10-000000000001" />
        <ReadOnlyDetails noPicture username="test-admin" name="Test Administrator" email="admin@example.com" jobTitle="Service administrator">
          <Actions>
            <Button variant="primary" data-testid="profile-edit-button">Edit profile</Button>
          </Actions>
        </ReadOnlyDetails>
        <Region id="permissions-heading" title="Permissions">
          <p className="op-text" data-testid="profile-permissions-label">You have administrator permissions.</p>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
