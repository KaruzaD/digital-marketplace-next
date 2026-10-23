import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, Group, ReadOnlyDetails, UserPage } from "./user-kit";

// user-profile · default — an administrator viewing another person's active account (R-4.18, R-4.12, R-4.30, R-4.34)
const meta: Meta = { title: "users/user-profile/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Public sector employee" status="Active" id="0b6f2c1e-5a7d-4c3e-9f10-000000000002" />
        <ReadOnlyDetails noPicture username="test-gov" name="Test Public Servant" email="gov@example.com" jobTitle="Procurement officer" />
        <Region id="permissions-heading" title="Permissions">
          <Group>
            <Checkbox aria-describedby="admin-hint" data-testid="profile-admin-checkbox">Administrator</Checkbox>
            <p id="admin-hint" className="op-note">The change takes effect as soon as you tick or untick the box.</p>
          </Group>
        </Region>
        <Region id="status-heading" title="Account status">
          <p className="op-text">Deactivating this account removes the person’s access. They will be told by email.</p>
          <Actions>
            <Button variant="secondary" danger data-testid="profile-deactivate-button">Deactivate account</Button>
          </Actions>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
