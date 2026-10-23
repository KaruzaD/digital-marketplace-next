import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · name-too-long — the name to store the file under is 256 characters; the upload is refused as a bad
// request and the message names the permitted length (R-8.23). Not a screen: the address answers with data. This
// response reference names the answer. Drawn for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/name-too-long", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NameTooLong: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="upload"
          title="Storing a file"
          request={{
            testId: "file-upload-request",
            items: [
              { term: "Address", value: "/api/files, sent by a signed-in person" },
              { term: "The file", value: "terms.pdf, 240 KB" },
              { term: "Name to store it under", value: "A name 256 characters long" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-refused-name",
            items: [
              { term: "Outcome", value: "Refused: bad request" },
              { term: "Message", value: "The file name must be between 1 and 255 characters long." },
              { term: "Stored", value: "Nothing. The working copy has been removed." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
