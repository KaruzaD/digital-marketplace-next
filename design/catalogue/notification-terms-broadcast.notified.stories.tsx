import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { TermsBroadcastPage } from "./notification-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// notification-terms-broadcast · notified — the administrator confirmed. The service reports success as soon as every
// acceptance is withdrawn, while the emails are still being sent (R-6.24), and nothing later reports whether each one
// arrived (R-6.2). The wording says exactly that, so the administrator is not told more than the service knows.
const meta: Meta = { title: "notifications/notification-terms-broadcast/notified", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Notified: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <TermsBroadcastPage
        outcome={
          <div data-testid="notify-vendors-success">
            <InlineAlert
              variant="success"
              role="status"
              title="Vendors have been notified"
              description="Every vendor's acceptance of the terms has been withdrawn. Emails asking active vendors to read and accept the new terms are being sent now. This page will not report whether each email arrives."
            />
          </div>
        }
      />
    </SitePage>
  ),
};
