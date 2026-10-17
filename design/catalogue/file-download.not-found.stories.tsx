import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-download · not-found — an administrator asks for the content of an identifier no stored file carries and is
// told it was not found; anyone else is answered as in file-download · refused (R-8.12). Not a screen: the address
// answers with data. This response reference names the answer.
const meta: Meta = { title: "files/file-download/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <FilePage>
        <Reference
          prefix="download"
          answersWith="the file"
          title="A stored file"
          request={{
            testId: "file-download-request",
            items: [
              { term: "Address", value: "/api/files/00000000-0000-4000-8000-000000000000?type=blob" },
              { term: "Asked by", value: "An administrator" },
            ],
          }}
          answer={{
            testId: "file-not-found",
            items: [
              { term: "Outcome", value: "Not found" },
              { term: "Message", value: "No stored file has this identifier." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
