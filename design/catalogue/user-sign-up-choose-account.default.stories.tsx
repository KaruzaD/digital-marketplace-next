import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Panel } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { Choices, UserPage } from "./user-kit";

// user-sign-up-choose-account · default — R-4.1. Seen by a visitor who has not signed in.
const meta: Meta = { title: "users/user-sign-up-choose-account/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <PageTitle>Choose Account Type</PageTitle>
        <p className="op-text">
          Your account is created the first time you sign in. The kind of account you get depends on how you sign in.
        </p>
        <Choices>
          <Panel id="sign-up-vendor-heading" title="Vendor" testId="sign-up-vendor-card">
            <p className="op-text">For people who want to register organizations and submit proposals. You sign up with your code-hosting account.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-up-vendor-button">Sign up as a vendor</Button>
            </Actions>
          </Panel>
          <Panel id="sign-up-public-sector-heading" title="Public sector employee" testId="sign-up-public-sector-card">
            <p className="op-text">For public sector staff who create and manage opportunities. You sign up with your government account.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-up-public-sector-button">Sign up as a public sector employee</Button>
            </Actions>
          </Panel>
        </Choices>
        <p className="op-text">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </UserPage>
    </SitePage>
  ),
};
