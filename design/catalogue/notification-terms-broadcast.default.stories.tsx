import type { Meta, StoryObj } from "@storybook/react-vite";
import { TermsBroadcastPage } from "./notification-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// notification-terms-broadcast · default — an administrator viewing the service's terms and conditions page. The
// "Notify vendors of updated terms" section is offered here and on no other page, and only to an administrator
// (R-6.23). The rest of the screen (the facts, the warning that the service needs the page, Edit page and the current
// wording) is the content domain's managing screen for a page the service needs (content-edit · fixed).
const meta: Meta = { title: "notifications/notification-terms-broadcast/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <TermsBroadcastPage />
    </SitePage>
  ),
};
