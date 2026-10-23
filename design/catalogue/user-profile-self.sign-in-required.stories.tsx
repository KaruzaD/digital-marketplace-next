import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Panel } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { Choices, UserPage } from "./user-kit";

// user-profile-self · sign-in-required — a visitor who is not signed in opened /users/me and was sent to sign in,
// to be returned to their profile afterwards (R-4.26, R-4.22)
const meta: Meta = { title: "users/user-profile-self/sign-in-required", parameters: { viewport: { options: WIDTHS } } };
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
            title="Sign in to see your profile"
            description="Once you have signed in you will be taken back to your profile."
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
