import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-sign-out · failed — the session could not be ended (R-4.17). The session may still stand, so the header still
// shows the person signed in.
const meta: Meta = { title: "users/user-sign-out/failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Failed: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Sign Out Failed</PageTitle>
        <div data-testid="sign-out-failed">
          <InlineAlert
            variant="danger"
            role="alert"
            title="We could not sign you out"
            description="You may still be signed in. Try signing out again."
          />
        </div>
      </UserPage>
    </SitePage>
  ),
};
