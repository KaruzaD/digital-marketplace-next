import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, ButtonGroup, Form, TextField } from "@bcgov/design-system-react-components";
import { PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { AccountFacts, Group, ProfileTabs, UserPage, VENDOR_ONE, VENDOR_TABS } from "./user-kit";

// user-profile-self · editing — a vendor editing their own details; no job title is asked of a vendor (R-4.18, R-4.27, R-4.28)
const meta: Meta = { title: "users/user-profile-self/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base="/users/me" current="profile" tabs={VENDOR_TABS} />
        <AccountFacts type="Vendor" />
        <Region id="edit-heading" title="Edit your details">
          <Form validationBehavior="aria">
            <div className="us-form">
              <Group>
                <p className="us-group-label">Profile picture (optional)</p>
                <p className="op-note">No profile picture has been added.</p>
                <FileTrigger acceptedFileTypes={["image/*"]}>
                  <Button variant="secondary" data-testid="change-avatar">Choose a profile picture</Button>
                </FileTrigger>
              </Group>
              <div className="us-fields">
                <TextField label="Sign-in username" value="test-vendor-1" isReadOnly description="This cannot be changed." data-testid="idp-username-field" />
                <TextField id="profile-name" label="Name" defaultValue="Test Vendor One" isRequired maxLength={100} data-testid="name-field" />
                <TextField id="profile-email" label="Email address" type="email" defaultValue="vendor1@example.com" isRequired data-testid="email-field" />
              </div>
              <ButtonGroup ariaLabel="Profile actions">
                <Button type="submit" variant="primary" data-testid="profile-save-button">Save changes</Button>
                <Button variant="secondary" data-testid="profile-cancel-button">Cancel</Button>
              </ButtonGroup>
            </div>
          </Form>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
