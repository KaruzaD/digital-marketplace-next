import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-upload · fault — a well-formed upload that fails because of the service itself (here, illustratively, storage
// that cannot be written). This is the one answer that is a fault of the service; R-8.17, R-8.18 and R-8.24 say that a
// submission that is the requester's error must never get it. Not a screen: the address answers with data. This
// response reference names the answer. Drawn for a signed-in vendor.
const meta: Meta = { title: "files/file-upload/fault", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Fault: StoryObj = {
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
              { term: "The file", value: "terms.pdf, 240 KB, its size declared in advance" },
              { term: "Name to store it under", value: "terms.pdf" },
              { term: "Who may read it", value: "Anyone" },
            ],
          }}
          answer={{
            testId: "file-upload-service-fault",
            items: [
              { term: "Outcome", value: "Failed: a fault of the service" },
              { term: "Message", value: "The file could not be stored because of a problem with the service. Try again later." },
              { term: "Stored", value: "Nothing. The working copy has been removed, and the fault is recorded in the service's error log." },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
