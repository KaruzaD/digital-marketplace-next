import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, Checkbox, Form, InlineAlert, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { Group, UserPage, VENDOR_ONE } from "./user-kit";

// user-sign-up-complete · save-failed — the service refused the save; the cause is deliberately not named (R-4.6).
// Seen by the vendor who has just signed in for the first time.
const meta: Meta = { title: "users/user-sign-up-complete/save-failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SaveFailed: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Complete Your Profile</PageTitle>
        <InlineAlert
          variant="danger"
          role="alert"
          title="Your profile could not be saved"
          description="Nothing you entered has been lost. Check your details and try again."
        />
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
              <TextField label="Sign-in username" value="test-vendor-1" isReadOnly data-testid="idp-username-field" />
              <TextField id="profile-name" label="Name" defaultValue="Test Vendor One" isRequired data-testid="name-field" />
              <TextField id="profile-email" label="Email address" type="email" defaultValue="vendor1@example.com" isRequired data-testid="email-field" />
            </div>
            <Checkbox defaultSelected data-testid="sign-up-notifications-checkbox">Email me when new opportunities are posted</Checkbox>
            <Checkbox isRequired defaultSelected data-testid="sign-up-terms-checkbox">
              I have read and agree to the terms and conditions and the privacy policy
            </Checkbox>
            <Actions>
              <Button type="submit" variant="primary" data-testid="sign-up-complete-button">Complete profile</Button>
            </Actions>
          </div>
        </Form>
      </UserPage>
    </SitePage>
  ),
};
