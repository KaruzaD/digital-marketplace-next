import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, ButtonGroup, Form, Link, TextField } from "@bcgov/design-system-react-components";
import { PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ErrorSummary, Group, ProfileTabs, PUBLIC_SERVANT, STAFF_TABS, UserPage } from "./user-kit";

// user-profile · invalid — the owner saved with the name cleared and a malformed email address (R-4.27)
const meta: Meta = { title: "users/user-profile/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000002";

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <ProfileTabs base={base} current="profile" tabs={STAFF_TABS} />
        <ErrorSummary title="Your changes have 2 problems">
          <li data-testid="field-error"><Link href="#profile-name">Name: enter your name</Link></li>
          <li data-testid="field-error">
            <Link href="#profile-email">Email address: enter an email address in a valid format, like name@example.com</Link>
          </li>
        </ErrorSummary>
        <Region id="edit-heading" title="Edit your details">
          <Form validationBehavior="aria">
            <div className="us-form">
              <Group>
                <FileTrigger acceptedFileTypes={["image/*"]}>
                  <Button variant="secondary" data-testid="change-avatar">Choose a profile picture</Button>
                </FileTrigger>
              </Group>
              <div className="us-fields">
                <TextField label="Sign-in username" value="test-gov" isReadOnly data-testid="idp-username-field" />
                <TextField id="profile-name" label="Name" defaultValue="" isRequired isInvalid errorMessage="Enter your name" data-testid="name-field" />
                <TextField
                  id="profile-email"
                  label="Email address"
                  type="email"
                  defaultValue="gov-at-example"
                  isRequired
                  isInvalid
                  errorMessage="Enter an email address in a valid format, like name@example.com"
                  data-testid="email-field"
                />
                <TextField id="profile-job-title" label="Job title (optional)" defaultValue="" maxLength={100} data-testid="job-title-field" />
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
