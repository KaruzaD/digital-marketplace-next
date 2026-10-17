import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · default — a signed-in person submits one file, a name and a read-access statement together, and the
// service answers with the stored file's record: its identifier, its name and the date it was stored (R-8.1, R-8.2,
// R-8.6). Not a screen: the address answers with data. This response reference names each part of the answer. Drawn
// for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="upload"
          title="Storing a file"
          request={{
            testId: "file-upload-request",
            items: [
              { term: "Address", value: "/api/files, sent by a signed-in person as one submission" },
              { term: "The file", value: "terms.pdf, 240 KB, its size declared in advance" },
              { term: "Name to store it under", value: "terms.pdf" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-stored",
            items: [
              { term: "Outcome", value: "Stored" },
              { term: "Identifier", value: "5b2e0c3a-8d41-4f6e-a1c2-000000000801", testId: "file-upload-stored-id" },
              { term: "Name", value: "terms.pdf" },
              { term: "Stored", value: <time dateTime="2026-09-19T10:15:00-07:00">September 19, 2026 at 10:15 a.m.</time> },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
