import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Panel } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { Choices, UserPage } from "./user-kit";

// notification-unsubscribe-landing · sign-in-required — somebody who is not signed in followed an email's Unsubscribe
// offer. There is no way to unsubscribe without signing in; they are shown sign-in and returned to their own
// notification settings, with the question asked, afterwards (R-6.7). This is the users domain's sign-in-required
// screen (user-profile-self · sign-in-required) with the alert worded for this arrival.
const meta: Meta = {
  title: "notifications/notification-unsubscribe-landing/sign-in-required",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const SignInRequired: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <PageTitle>Sign In</PageTitle>
        <div data-testid="sign-in-required">
          <InlineAlert
            variant="info"
            role="status"
            title="Sign in to unsubscribe"
            description="Once you have signed in you will be taken to your notification settings and asked to confirm. The change applies to the account you sign in with."
          />
        </div>
        <Choices>
          <Panel id="sign-in-vendor-heading" title="Vendor" testId="sign-in-vendor-card">
            <p className="op-text">Sign in with your code-hosting account.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-in-vendor-button">Sign in as a vendor</Button>
            </Actions>
          </Panel>
          <Panel id="sign-in-public-sector-heading" title="Public sector employee" testId="sign-in-public-sector-card">
            <p className="op-text">Sign in with your government account.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-in-public-sector-button">Sign in as a public sector employee</Button>
            </Actions>
          </Panel>
        </Choices>
      </UserPage>
    </SitePage>
  ),
};
