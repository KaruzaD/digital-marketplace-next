import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttachmentControl, FilePage, ManageFrame, StoredRow } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · default — the Attachments part of the Opportunity tab in edit mode, holding two attachments
// that are already stored. Their names are read-only (R-8.27 note), each can be downloaded from the address it is
// stored at (R-8.10) and removed, and the size limit is stated before a file is chosen (R-8.17). The rest of the form
// is the opportunities domain's (opportunity-*-edit · editing) and is trimmed here. Seen by an administrator.
const meta: Meta = { title: "files/file-attachment-control/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <FilePage>
        <ManageFrame>
          <AttachmentControl>
            <StoredRow name="Statement of work.pdf" id="5b2e0c3a-8d41-4f6e-a1c2-000000000803" />
            <StoredRow name="Current permit screens.png" id="5b2e0c3a-8d41-4f6e-a1c2-000000000804" />
          </AttachmentControl>
        </ManageFrame>
      </FilePage>
    </SitePage>
  ),
};
