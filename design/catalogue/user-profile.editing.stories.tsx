import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, ButtonGroup, Form, TextField } from "@bcgov/design-system-react-components";
import { PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { AccountFacts, Group, ProfileTabs, PUBLIC_SERVANT, STAFF_TABS, UserPage } from "./user-kit";

// user-profile · editing — the owner editing their own details, reached by identifier (R-4.18, R-4.27, R-4.28)
const meta: Meta = { title: "users/user-profile/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000002";

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base={base} current="profile" tabs={STAFF_TABS} />
        <AccountFacts type="Public sector employee" />
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
                <TextField label="Sign-in username" value="test-gov" isReadOnly description="This cannot be changed." data-testid="idp-username-field" />
                <TextField id="profile-name" label="Name" defaultValue="Test Public Servant" isRequired maxLength={100} data-testid="name-field" />
                <TextField id="profile-email" label="Email address" type="email" defaultValue="gov@example.com" isRequired data-testid="email-field" />
                <TextField id="profile-job-title" label="Job title (optional)" defaultValue="Procurement officer" maxLength={100} data-testid="job-title-field" />
              </div>
              <ButtonGroup ariaLabel="Profile actions">
                <Button type="submit" variant="primary" data-testid="profile-save-button">Save changes</Button>
                <Button variant="secondary" data-testid="profile-cancel-button">Cancel</Button>
              </ButtonGroup>
            </div>
          </Form>
        </Region>
        {/* Editing replaces only the details; an ordinary public sector employee's permissions stay a read-only label (R-4.12). */}
        <Region id="permissions-heading" title="Permissions">
          <p className="op-text" data-testid="profile-permissions-label">You do not have administrator permissions.</p>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
