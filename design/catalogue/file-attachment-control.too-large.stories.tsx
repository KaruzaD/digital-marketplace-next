import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttachmentControl, FilePage, ManageFrame, NewRow, Refusal } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · too-large — the person chose a file larger than the limit that was stated before they
// chose it. The attachment is marked on its own row with a message naming the limit, and the form cannot be saved until
// it is removed. The service's own refusal of an oversized upload is shown in the same place with the same words
// (R-8.17). Seen by an administrator.
const meta: Meta = { title: "files/file-attachment-control/too-large", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TooLarge: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <FilePage>
        <ManageFrame>
          <AttachmentControl>
            <NewRow chosen="New: site-survey.pdf, 12.4 MB." file="site-survey.pdf">
              <Refusal testId="attachment-size-error" title="site-survey.pdf is too large to attach">
                It is 12.4 MB. Attachments must be 10 MB or smaller. Remove it, then attach a smaller file.
              </Refusal>
            </NewRow>
          </AttachmentControl>
        </ManageFrame>
      </FilePage>
    </SitePage>
  ),
};
