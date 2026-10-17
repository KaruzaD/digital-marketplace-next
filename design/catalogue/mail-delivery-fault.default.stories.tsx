import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatcherReference } from "./notification-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// mail-delivery-fault · default — the mail catcher's control for a mail server that refuses delivery. Not a screen of
// the service (origin: mail-catcher). This response reference names the control's two requests and what it reports.
// Its test IDs stay null (DESIGN.md, notifications gap 14). The request carries no session, so the shell around it is
// a visitor's.
const meta: Meta = { title: "notifications/mail-delivery-fault/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <CatcherReference
        idPrefix="mail-delivery-fault"
        title="A mail server that refuses delivery"
        requestTitle="Requests"
        requests={[
          { term: "Address", value: "/api/v1/chaos" },
          { term: "Refuse delivery", value: "Every message the service tries to send from now on is refused at the start of the attempt" },
          { term: "Restore delivery", value: "Delivery is accepted again. Messages refused earlier stay refused" },
        ]}
        answer={[{ term: "Delivery refused", value: "Whether the fault is in force" }]}
      />
    </SitePage>
  ),
};
