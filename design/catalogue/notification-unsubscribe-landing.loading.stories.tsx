import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationPage } from "./notification-kit";
import { PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-unsubscribe-landing · loading — the signed-in account has not arrived yet. The question is not asked
// until it has, because the question must name the signed-in person's own address (R-6.7).
const meta: Meta = { title: "notifications/notification-unsubscribe-landing/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <NotificationPage>
        <PageTitle>Notifications</PageTitle>
        <Waiting label="Loading your notification settings" />
      </NotificationPage>
    </SitePage>
  ),
};
