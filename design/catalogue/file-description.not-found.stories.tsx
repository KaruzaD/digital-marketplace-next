import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-description · not-found — an administrator asks for an identifier no stored file carries and is told it was not
// found; anyone else asking the same is answered as in file-description · refused (R-8.12). Not a screen: the address
// answers with data. This response reference names the answer.
const meta: Meta = { title: "files/file-description/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <FilePage>
        <Reference
          prefix="description"
          title="A stored file's description"
          request={{
            items: [
              { term: "Address", value: "/api/files/00000000-0000-4000-8000-000000000000, without requesting the content" },
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
