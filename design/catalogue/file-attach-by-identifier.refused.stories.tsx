import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attach-by-identifier · refused — a second vendor saves their own proposal naming the identifier of a file another
// vendor uploaded and marked readable by no one else. They may not read that file, so they may not attach it: the
// attachment is refused and the proposal's attachments are as they were (R-8.22, which replaces R-8.15). What kind of
// refusal this is, and whether the rest of the save is kept, no criterion says (DESIGN.md, files, gap 14). Not a
// screen: the address answers with data. This response reference names the answer.
const meta: Meta = { title: "files/file-attach-by-identifier/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="attach"
          title="Attach a stored file by its identifier"
          request={{
            testId: "file-attach-request",
            items: [
              { term: "Address", value: "/api/proposals/code-with-us/3d9a51c7-2e6b-4f80-b1a4-000000000202" },
              { term: "Sent by", value: "A vendor who wrote this proposal but did not upload the file and is given no way to read it" },
              { term: "The record", value: "The proposal as it stands, with one attachment added" },
              { term: "Attachment added", value: "5b2e0c3a-8d41-4f6e-a1c2-000000000802" },
            ],
          }}
          answer={{
            testId: "file-attach-refused",
            items: [
              { term: "Outcome", value: "Refused: the file is not one the sender may read" },
              { term: "Message", value: "You can only attach a file you are permitted to read." },
              {
                term: "Attachments as stored",
                value: "None. The proposal's attachments are as they were.",
                testId: "file-attach-identifiers",
              },
              { term: "Who may read the file", value: "Unchanged. The proposal gives no one a way to read it." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
