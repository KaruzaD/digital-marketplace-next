import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { TermsBroadcastPage } from "./notification-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// notification-terms-broadcast · notify-failed — the administrator confirmed and the service refused or failed before
// reporting success. Vendors have not been told. The alert names no cause and makes no claim about whether any
// acceptance was withdrawn, because no criterion says (DESIGN.md, notifications gap 8). The button stays, so the
// administrator can try again.
const meta: Meta = { title: "notifications/notification-terms-broadcast/notify-failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotifyFailed: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <TermsBroadcastPage
        outcome={
          <div data-testid="notify-vendors-failure">
            <InlineAlert
              variant="danger"
              role="alert"
              title="Vendors have not been notified"
              description="The service could not complete the announcement. Try again."
            />
          </div>
        }
      />
    </SitePage>
  ),
};
