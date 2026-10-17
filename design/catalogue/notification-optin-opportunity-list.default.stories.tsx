import type { Meta, StoryObj } from "@storybook/react-vite";
import { OptInControl } from "./notification-kit";
import { OpportunityListPage } from "./opportunity-list-page";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-optin-opportunity-list · default — a signed-in vendor with new-opportunity emails off, on the list of
// opportunities. The control sits once, at the head of the results before the first group, at every screen width
// (R-6.21, R-6.27). Pressing it saves at once, with no confirmation (R-6.21 note). The list around it is the
// opportunities domain's, drawn whole (opportunity-list · default).
const meta: Meta = {
  title: "notifications/notification-optin-opportunity-list/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="opportunities">
      <OpportunityListPage audience="vendor" notice={<OptInControl subscribed={false} />} />
    </SitePage>
  ),
};
