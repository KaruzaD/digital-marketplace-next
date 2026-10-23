import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationPage } from "./notification-kit";
import { ADMIN, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// notification-email-reference · loading — an administrator has opened the page and the sample messages are still
// being composed. The heading and the page wrapper render at once.
const meta: Meta = { title: "notifications/notification-email-reference/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <NotificationPage testId="email-reference-page">
        <PageTitle>Email Notification Reference</PageTitle>
        <Waiting label="Loading sample emails" />
      </NotificationPage>
    </SitePage>
  ),
};
