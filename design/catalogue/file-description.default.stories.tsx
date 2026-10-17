import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, Reference } from "./file-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-description · default — a person who may read a stored file asks for it without requesting its content, and
// receives its identifier, name, stored date and the identifier of the stored content it shares with any identical
// upload, but not the content itself (R-8.5, R-8.11). Not a screen: the address answers with data. This response
// reference names each part of the answer. Drawn for a vendor who may read the file.
const meta: Meta = { title: "files/file-description/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <FilePage>
        <Reference
          prefix="description"
          title="A stored file's description"
          request={{
            items: [
              { term: "Address", value: "/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000801, without requesting the content" },
              { term: "Asked by", value: "A person who may read the file" },
            ],
          }}
          answer={{
            testId: "file-description-answer",
            items: [
              { term: "Identifier", value: "5b2e0c3a-8d41-4f6e-a1c2-000000000801", testId: "file-description-id" },
              { term: "Name", value: "terms.pdf", testId: "file-description-name" },
              {
                term: "Stored",
                value: <time dateTime="2026-09-19T10:15:00-07:00">September 19, 2026 at 10:15 a.m.</time>,
                testId: "file-description-stored-date",
              },
              {
                term: "Stored content",
                value: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
                testId: "file-description-content-id",
              },
              { term: "Content", value: "Not included" },
            ],
          }}
        />
      </FilePage>
    </SitePage>
  ),
};
