import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, Checkbox, Form, Link, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ErrorSummary, Group, UserPage, VENDOR_ONE } from "./user-kit";

// user-sign-up-complete · invalid — name cleared and email malformed on submit (R-4.27). Seen by the vendor who has
// just signed in for the first time.
const meta: Meta = { title: "users/user-sign-up-complete/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Complete Your Profile</PageTitle>
        <ErrorSummary title="Your profile has 2 problems">
          <li data-testid="field-error"><Link href="#profile-name">Name: enter your name</Link></li>
          <li data-testid="field-error">
            <Link href="#profile-email">Email address: enter an email address in a valid format, like name@example.com</Link>
          </li>
        </ErrorSummary>
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
              <TextField id="profile-name" label="Name" defaultValue="" isRequired isInvalid errorMessage="Enter your name" data-testid="name-field" />
              <TextField
                id="profile-email"
                label="Email address"
                type="email"
                defaultValue="vendor1-at-example"
                isRequired
                isInvalid
                errorMessage="Enter an email address in a valid format, like name@example.com"
                data-testid="email-field"
              />
            </div>
            <Checkbox data-testid="sign-up-notifications-checkbox">Email me when new opportunities are posted</Checkbox>
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
