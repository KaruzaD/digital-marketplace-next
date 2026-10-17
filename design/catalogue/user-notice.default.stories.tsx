import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { UserPage } from "./user-kit";

// user-notice · default — /notice/deactivatedOwnAccount (R-4.9, R-4.5). The person has been signed out, so the
// header is a visitor's.
const meta: Meta = { title: "users/user-notice/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <div className="op-region" data-testid="notice-deactivated-own-account">
          <PageTitle>Your account has been deactivated</PageTitle>
          <p className="op-text">You have deactivated your Digital Marketplace account and have been signed out.</p>
          <p className="op-text">You can reactivate your account at any time by signing in again.</p>
        </div>
        <Actions>
          <Link href="/" isButton buttonVariant="primary" data-testid="notice-back-to-home">Back to home</Link>
        </Actions>
      </UserPage>
    </SitePage>
  ),
};
