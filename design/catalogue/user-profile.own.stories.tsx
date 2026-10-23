import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { AccountFacts, ProfileTabs, ReadOnlyDetails, UserPage, VENDOR_ONE, VENDOR_TABS } from "./user-kit";

// user-profile · own — a vendor viewing their own profile by its identifier (R-4.34, R-4.28, R-4.9)
const meta: Meta = { title: "users/user-profile/own", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003";

export const Own: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base={base} current="profile" tabs={VENDOR_TABS} />
        <AccountFacts type="Vendor" id="0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
        <ReadOnlyDetails noPicture username="test-vendor-1" name="Test Vendor One" email="vendor1@example.com">
          <Actions>
            <Button variant="primary" data-testid="profile-edit-button">Edit profile</Button>
          </Actions>
        </ReadOnlyDetails>
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
