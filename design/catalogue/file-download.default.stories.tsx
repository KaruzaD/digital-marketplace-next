import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// file-download · default — a visitor who is not signed in asks for the content of a file marked readable by anyone and
// receives its bytes, described by a content type worked out from the name alone and offered as a download named for
// saving rather than displayed (R-8.7, R-8.10). Every download link in the interface is this request. Not a screen:
// the address answers with the file. This response reference names each part of the answer.
const meta: Meta = { title: "files/file-download/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <FilePage>
        <Reference
          prefix="download"
          answersWith="the file"
          title="A stored file"
          request={{
            testId: "file-download-request",
            items: [
              { term: "Address", value: "/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000801?type=blob" },
              { term: "Asked by", value: "A visitor who is not signed in. The file was marked readable by anyone." },
            ],
          }}
          answer={{
            testId: "file-download-response",
            items: [
              { term: "Content", value: "The stored bytes of terms.pdf, 240 KB", testId: "file-download-body" },
              {
                term: "Described as",
                value:
                  "application/pdf, worked out from the ending of the name. A name with no recognised ending is described as " +
                  "unspecified binary data.",
                testId: "file-download-content-type",
              },
              { term: "Offered as", value: "A file to save, not to display in the browser", testId: "file-download-disposition" },
              { term: "Named for saving", value: "terms.pdf", testId: "file-download-filename" },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
