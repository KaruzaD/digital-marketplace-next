import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// file-upload · signed-out — a visitor who is not signed in submits a file; the upload is refused as not permitted and
// nothing is stored (R-8.1). Not a screen: the address answers with data. This response reference names the answer.
const meta: Meta = { title: "files/file-upload/signed-out", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SignedOut: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <FilePage>
        <Reference
          prefix="upload"
          title="Storing a file"
          request={{
            testId: "file-upload-request",
            items: [
              { term: "Address", value: "/api/files, sent by a visitor who is not signed in" },
              { term: "The file", value: "terms.pdf, 240 KB" },
              { term: "Name to store it under", value: "terms.pdf" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-refused-signed-out",
            items: [
              { term: "Outcome", value: "Refused: not permitted" },
              { term: "Message", value: "Sign in to upload a file." },
              { term: "Stored", value: "Nothing. The working copy has been removed." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
