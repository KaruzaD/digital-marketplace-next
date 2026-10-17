import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { AccountFacts, ProfileTabs, PUBLIC_SERVANT, ReadOnlyDetails, STAFF_TABS, UserPage } from "./user-kit";

// user-profile-self · public-sector — a public sector employee's own profile: job title, two sections,
// permissions as a read-only label (R-4.34, R-4.28, R-4.12)
const meta: Meta = { title: "users/user-profile-self/public-sector", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const PublicSector: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base="/users/me" current="profile" tabs={STAFF_TABS} />
        <AccountFacts type="Public sector employee" id="0b6f2c1e-5a7d-4c3e-9f10-000000000002" />
        <ReadOnlyDetails noPicture username="test-gov" name="Test Public Servant" email="gov@example.com" jobTitle="Procurement officer">
          <Actions>
            <Button variant="primary" data-testid="profile-edit-button">Edit profile</Button>
          </Actions>
        </ReadOnlyDetails>
        <Region id="permissions-heading" title="Permissions">
          <p className="op-text" data-testid="profile-permissions-label">You do not have administrator permissions.</p>
        </Region>
        <Region id="status-heading" title="Deactivate your account">
          <p className="op-text">You will be signed out at once. You can come back at any time by signing in again.</p>
          <Actions>
            <Button variant="secondary" danger data-testid="profile-deactivate-button">Deactivate account</Button>
          </Actions>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
