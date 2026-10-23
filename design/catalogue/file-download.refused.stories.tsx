import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-download · refused — a second vendor asks for the content of a file another vendor uploaded and marked readable
// by no one else, or for an identifier no file carries; both are answered as not authorized and no content is sent
// (R-8.7, R-8.12, R-8.25). Not a screen: the address answers with data. This response reference names the answer.
const meta: Meta = { title: "files/file-download/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="download"
          answersWith="the file"
          title="A stored file"
          request={{
            testId: "file-download-request",
            items: [
              { term: "Address", value: "/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000802?type=blob" },
              { term: "Asked by", value: "A vendor who did not upload the file and is given no way to read it" },
            ],
          }}
          answer={{
            testId: "file-refused",
            items: [
              { term: "Outcome", value: "Refused: not authorized" },
              { term: "Message", value: "You are not authorized to read this file." },
              { term: "Same answer when", value: "No stored file has the identifier asked for, or the identifier is malformed" },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
