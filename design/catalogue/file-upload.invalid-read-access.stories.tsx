import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · invalid-read-access — the read-access statement names a kind of access the service does not recognise;
// the upload is refused as a bad request reporting that the information was invalid, and nothing is stored (R-8.24).
// A statement that is missing, or is not well-formed data at all, gets the same answer with its own message (R-8.18).
// Not a screen: the address answers with data. This response reference names the answer. Drawn for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/invalid-read-access", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const InvalidReadAccess: StoryObj = {
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
              { term: "Name to store it under", value: "terms.pdf" },
              { term: "Who may read it", value: 'A kind of access named "ministry", which the service does not recognise' },
            ],
          }}
          answer={{
            testId: "file-upload-refused-read-access",
            items: [
              { term: "Outcome", value: "Refused: bad request" },
              {
                term: "Message",
                value: 'The read-access information provided was invalid: "ministry" is not a kind of access the service recognises.',
              },
              { term: "Stored", value: "Nothing. The working copy has been removed." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
