import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · no-file — the submission carries a name and a read-access statement but no file part; it is refused as
// a bad request naming what was missing, and is not recorded as a fault of the service (R-8.18). Not a screen: the
// address answers with data. This response reference names the answer. Drawn for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/no-file", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NoFile: StoryObj = {
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
              { term: "The file", value: "None" },
              { term: "Name to store it under", value: "terms.pdf" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-refused-no-file",
            items: [
              { term: "Outcome", value: "Refused: bad request" },
              { term: "Message", value: "The submission carried no file. Include the file to upload." },
              { term: "Stored", value: "Nothing. Not recorded in the service's error log." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
