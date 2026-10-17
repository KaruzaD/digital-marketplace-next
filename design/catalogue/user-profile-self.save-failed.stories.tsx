import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, ButtonGroup, Form, InlineAlert, TextField } from "@bcgov/design-system-react-components";
import { PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { Group, UserPage, VENDOR_ONE } from "./user-kit";

// user-profile-self · save-failed — the service refused the change (for example an email address another vendor
// already uses); the cause is deliberately not named (R-4.6)
const meta: Meta = { title: "users/user-profile-self/save-failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SaveFailed: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <InlineAlert
          variant="danger"
          role="alert"
          title="Your changes could not be saved"
          description="Nothing you entered has been lost. Check your details and try again."
        />
        <Region id="edit-heading" title="Edit your details">
          <Form validationBehavior="aria">
            <div className="us-form">
              <Group>
                <FileTrigger acceptedFileTypes={["image/*"]}>
                  <Button variant="secondary" data-testid="change-avatar">Choose a profile picture</Button>
                </FileTrigger>
              </Group>
              <div className="us-fields">
                <TextField label="Sign-in username" value="test-vendor-1" isReadOnly data-testid="idp-username-field" />
                <TextField id="profile-name" label="Name" defaultValue="Test Vendor One" isRequired maxLength={100} data-testid="name-field" />
                <TextField id="profile-email" label="Email address" type="email" defaultValue="vendor2@example.com" isRequired data-testid="email-field" />
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
