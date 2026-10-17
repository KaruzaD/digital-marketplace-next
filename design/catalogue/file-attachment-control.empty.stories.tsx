import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttachmentControl, FilePage, ManageFrame } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · empty — the opportunity has no attachments yet. The list is replaced by a sentence saying
// so, and the size limit is stated before the person chooses a file (R-8.17). Seen by an administrator.
const meta: Meta = { title: "files/file-attachment-control/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <FilePage>
        <ManageFrame>
          <AttachmentControl />
        </ManageFrame>
      </FilePage>
    </SitePage>
  ),
};
