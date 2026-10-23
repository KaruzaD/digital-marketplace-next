import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attach-by-identifier · default — a vendor who may read a stored file (they uploaded it) saves their Code With Us
// proposal as it stands, naming that file's identifier as an attachment. The attachment is accepted (R-8.22), and the
// file becomes readable by whoever may read the proposal (R-8.20). Not a screen: the address answers with data. This
// response reference names each part of the answer.
const meta: Meta = { title: "files/file-attach-by-identifier/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="attach"
          title="Attach a stored file by its identifier"
          request={{
            testId: "file-attach-request",
            items: [
              { term: "Address", value: "/api/proposals/code-with-us/3d9a51c7-2e6b-4f80-b1a4-000000000201" },
              { term: "Sent by", value: "The vendor who wrote the proposal, and who uploaded the file and may read it" },
              { term: "The record", value: "The proposal as it stands, with one attachment added" },
              { term: "Attachment added", value: "5b2e0c3a-8d41-4f6e-a1c2-000000000807" },
            ],
          }}
          answer={{
            testId: "file-attach-accepted",
            items: [
              { term: "Outcome", value: "Saved, with the file attached" },
              {
                term: "Attachments as stored",
                value: "5b2e0c3a-8d41-4f6e-a1c2-000000000803, 5b2e0c3a-8d41-4f6e-a1c2-000000000807",
                testId: "file-attach-identifiers",
              },
              { term: "Who may now read the file", value: "Whoever may read the proposal, as well as anyone who could read it before" },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
