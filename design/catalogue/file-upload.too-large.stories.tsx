import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · too-large — a signed-in person submits a file larger than the service's limit; it is refused as the
// requester's error, with a message naming the limit, and nothing is stored (R-8.17, R-8.18). Not a screen: the
// address answers with data. This response reference names the answer. Drawn for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/too-large", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TooLarge: StoryObj = {
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
              { term: "The file", value: "site-survey.pdf, 12.4 MB" },
              { term: "Name to store it under", value: "site-survey.pdf" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-refused-size",
            items: [
              { term: "Outcome", value: "Refused: the file is too large (the requester's error)" },
              {
                term: "Message",
                value: (
                  <>
                    The file is larger than <span data-testid="file-upload-size-limit">10 MB</span>. Upload a file of 10 MB or
                    smaller.
                  </>
                ),
              },
              { term: "Stored", value: "Nothing. The working copy has been removed." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
