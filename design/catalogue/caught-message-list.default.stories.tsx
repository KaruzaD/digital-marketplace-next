import type { Meta, StoryObj } from "@storybook/react-vite";
import { CatcherReference } from "./notification-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// caught-message-list · default — every message in the mail catcher, newest first. Not a screen of the service: the
// catcher answers with its listing (origin: mail-catcher). The nth identifier, subject and visible recipient belong to
// the same message. This response reference names each part of the answer the surface reads. Its test IDs stay null
// (DESIGN.md, notifications gap 14). The request carries no session, so the shell around it is a visitor's.
const meta: Meta = { title: "notifications/caught-message-list/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <CatcherReference
        idPrefix="caught-message-list"
        title="Every message the service sent"
        requests={[{ term: "Address", value: "/api/v1/messages" }]}
        answer={[
          { term: "Message identifiers", value: "The catcher's identifier of each message, newest first" },
          { term: "Message subjects", value: "The subject of each message, in the same order" },
          { term: "Visible recipients", value: "The visible recipients of each message, in the same order" },
          { term: "Message count", value: "How many messages the catcher holds" },
        ]}
      />
    </SitePage>
  ),
};
