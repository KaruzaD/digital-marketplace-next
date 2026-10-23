import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-email-reference · not-found — anybody who is not an administrator, signed in or not, asks for the page.
// It is refused (R-6.13 note) with the shared missing page, which never says "not allowed" and so does not reveal
// that the page exists. What a refusal shows is not stated (DESIGN.md, notifications gap 10). Drawn for a vendor; the
// page beneath the header is the same for a visitor or a public sector employee.
const meta: Meta = { title: "notifications/notification-email-reference/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <MissingPage />
    </SitePage>
  ),
};
