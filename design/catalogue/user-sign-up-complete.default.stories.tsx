import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, Checkbox, Form, Link, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { Group, UserPage, VENDOR_ONE } from "./user-kit";

// user-sign-up-complete · default — terms not yet agreed, completion unavailable (R-4.3, R-4.24, R-4.27, R-4.28). Seen
// by the vendor who has just signed in for the first time.
const meta: Meta = { title: "users/user-sign-up-complete/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Complete Your Profile</PageTitle>
        <p className="op-text">Confirm your details to finish creating your vendor account.</p>
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
              <TextField
                label="Sign-in username"
                value="test-vendor-1"
                isReadOnly
                description="The account you signed in with. It cannot be changed."
                data-testid="idp-username-field"
              />
              <TextField id="profile-name" label="Name" defaultValue="Test Vendor One" isRequired data-testid="name-field" />
              <TextField id="profile-email" label="Email address" type="email" defaultValue="vendor1@example.com" isRequired data-testid="email-field" />
            </div>
            <Checkbox data-testid="sign-up-notifications-checkbox">Email me when new opportunities are posted</Checkbox>
            <Group>
              <p className="op-text">
                Read the <Link href="/content/terms-and-conditions">terms and conditions</Link> and the{" "}
                <Link href="/content/privacy">privacy policy</Link> before you agree to them.
              </p>
              <Checkbox isRequired data-testid="sign-up-terms-checkbox">
                I have read and agree to the terms and conditions and the privacy policy
              </Checkbox>
            </Group>
            <p id="sign-up-complete-hint" className="op-note">
              Agree to the terms and conditions and the privacy policy to complete your profile.
            </p>
            <Actions>
              <Button type="submit" variant="primary" isDisabled aria-describedby="sign-up-complete-hint" data-testid="sign-up-complete-button">
                Complete profile
              </Button>
            </Actions>
          </div>
        </Form>
      </UserPage>
    </SitePage>
  ),
};
