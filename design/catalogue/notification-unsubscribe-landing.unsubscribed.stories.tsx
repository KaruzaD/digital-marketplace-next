import type { Meta, StoryObj } from "@storybook/react-vite";
import { UnsubscribeSettings } from "./notification-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-unsubscribe-landing · unsubscribed — the signed-in person pressed Unsubscribe. The dialog has closed,
// focus is back on the checkbox, the checkbox is cleared, and the change is announced. It is the signed-in person's
// own notices that stopped (R-6.7). The announcement's wording is the design's own (DESIGN.md, notifications gap 4).
const meta: Meta = { title: "notifications/notification-unsubscribe-landing/unsubscribed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Unsubscribed: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UnsubscribeSettings
        subscribed={false}
        announcement="You have unsubscribed. vendor1@example.com will no longer be emailed about new opportunities."
      />
    </SitePage>
  ),
};
