import type { Meta, StoryObj } from "@storybook/react-vite";
import { OptInControl } from "./notification-kit";
import { OpportunityListPage } from "./opportunity-list-page";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-optin-opportunity-list · subscribed — the same vendor has just pressed "Email me about new
// opportunities". Their account records the request, the control now offers the opposite choice, and the change is
// announced; the next opportunity published reaches them (R-6.21). Focus stays on the button, whose text has changed.
// Turning emails off from here also saves at once, without the question the settings page asks (R-6.21 note).
const meta: Meta = {
  title: "notifications/notification-optin-opportunity-list/subscribed",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Subscribed: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="opportunities">
      <OpportunityListPage audience="vendor" notice={<OptInControl subscribed />} />
    </SitePage>
  ),
};
