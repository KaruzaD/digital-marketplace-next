import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatcherReference } from "./notification-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// mail-delivery-delay · default — the control, beside the mail catcher, for a mail server that is slow to answer. Not
// a screen of the service (origin: mail-catcher). This response reference names the control's two requests and what
// it reports. Its test IDs stay null (DESIGN.md, notifications gap 14). The request carries no session, so the shell
// around it is a visitor's.
const meta: Meta = { title: "notifications/mail-delivery-delay/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <CatcherReference
        idPrefix="mail-delivery-delay"
        title="A mail server that is slow to answer"
        requestTitle="Requests"
        requests={[
          { term: "Address", value: "/hold/proxies/smtp/toxics" },
          {
            term: "Slow delivery",
            value: "Every reply the mail server makes reaches the service three seconds late. Nothing is refused or lost",
          },
          { term: "Restore delivery speed", value: "The delay is lifted. Messages already on their way arrive" },
        ]}
        answer={[{ term: "Delivery slowed", value: "Whether the delay is in force" }]}
      />
    </SitePage>
  ),
};
