import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { UserPage } from "./user-kit";

// user-notice · sign-in-failed — /notice/authFailure (R-4.4, R-4.1, R-4.6). Seen by a visitor whose sign-in failed.
const meta: Meta = { title: "users/user-notice/sign-in-failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SignInFailed: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <div className="op-region" data-testid="notice-sign-in-failed">
          <PageTitle>Sign in failed</PageTitle>
          <p className="op-text">We could not sign you in. Please try again.</p>
        </div>
        <Actions>
          <Link href="/sign-in" isButton buttonVariant="primary">Try signing in again</Link>
          <Link href="/" isButton buttonVariant="secondary" data-testid="notice-back-to-home">Back to home</Link>
        </Actions>
      </UserPage>
    </SitePage>
  ),
};
