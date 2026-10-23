import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Panel } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { Choices, UserPage } from "./user-kit";

// user-sign-in · default — R-4.1, R-4.22. Seen by a visitor who has not signed in.
const meta: Meta = { title: "users/user-sign-in/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <PageTitle>Sign In</PageTitle>
        <p className="op-text">Choose the kind of account you sign in with.</p>
        <Choices>
          <Panel id="sign-in-vendor-heading" title="Vendor" testId="sign-in-vendor-card">
            <p className="op-text">Sign in with your code-hosting account to register organizations and submit proposals.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-in-vendor-button">Sign in as a vendor</Button>
            </Actions>
          </Panel>
          <Panel id="sign-in-public-sector-heading" title="Public sector employee" testId="sign-in-public-sector-card">
            <p className="op-text">Sign in with your government account to create and manage opportunities.</p>
            <Actions>
              <Button variant="secondary" data-testid="sign-in-public-sector-button">Sign in as a public sector employee</Button>
            </Actions>
          </Panel>
        </Choices>
        <p className="op-text">
          Don’t have an account? <Link href="/sign-up" data-testid="sign-in-go-to-sign-up">Sign up</Link>
        </p>
      </UserPage>
    </SitePage>
  ),
};
