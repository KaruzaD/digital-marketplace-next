import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatcherReference } from "./notification-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// caught-message · default — one message the service sent, read back from the mail catcher by its identifier. Not a
// screen of the service: the catcher answers with the message's headers and bodies (origin: mail-catcher). This
// response reference names each part of the answer the surface reads. Its test IDs stay null (DESIGN.md,
// notifications gap 14). The request carries no session, so the shell around it is a visitor's.
const meta: Meta = { title: "notifications/caught-message/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <CatcherReference
        idPrefix="caught-message"
        title="A message the service sent"
        requests={[
          { term: "Address", value: "/api/v1/message/:messageId, where :messageId is the catcher's own identifier for the message" },
        ]}
        answer={[
          { term: "Visible recipients", value: "The addresses the message was sent to openly" },
          { term: "Copied recipients", value: "The addresses the message was copied to" },
          { term: "Sender", value: "The address the message came from" },
          { term: "Reply to", value: "The address a reply goes to" },
          { term: "Subject", value: "The message's subject line" },
          { term: "Formatted body", value: "The message as a mail program that shows formatting displays it" },
          { term: "Plain text body", value: "The message as a mail program that shows plain text displays it" },
          { term: "Logo address", value: "The address of the image at the top of the formatted body" },
          { term: "Links in the body", value: "Every link in the formatted body, each as its label and where it leads" },
        ]}
      />
    </SitePage>
  ),
};
