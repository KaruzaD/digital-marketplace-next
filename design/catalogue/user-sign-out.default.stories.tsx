import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import { PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { UserPage } from "./user-kit";

// user-sign-out · default — session ended with the service and the identity provider (R-4.17). The person is now a
// visitor, so the header offers Sign In and Sign Up.
const meta: Meta = { title: "users/user-sign-out/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <PageTitle>Signed Out</PageTitle>
        <div data-testid="sign-out-success">
          <InlineAlert variant="success" role="status" title="You have successfully signed out" />
        </div>
        <p className="op-text">
          <Link href="/sign-in">Sign in again</Link>
        </p>
      </UserPage>
    </SitePage>
  ),
};
