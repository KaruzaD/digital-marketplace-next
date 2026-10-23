import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox, InlineAlert } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, Group, ReadOnlyDetails, UserPage } from "./user-kit";

// user-profile · admin-refused — an administrator ticked the administrator box on a vendor's profile (R-4.12)
const meta: Meta = { title: "users/user-profile/admin-refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AdminRefused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Vendor" status="Active" id="0b6f2c1e-5a7d-4c3e-9f10-000000000003" />
        <ReadOnlyDetails username="test-vendor-1" name="Test Vendor One" email="vendor1@example.com" />
        <Region id="permissions-heading" title="Permissions">
          <Group>
            <Checkbox isSelected={false} aria-describedby="admin-refused" data-testid="profile-admin-checkbox">Administrator</Checkbox>
            <div id="admin-refused">
              <InlineAlert variant="danger" role="alert" title="Vendors cannot be granted administrator permissions" />
            </div>
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
