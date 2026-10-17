import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFrame, FilePage, ImageEditor } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-embedded-image · default — the body editor on a page's managing screen in edit mode, before an image is chosen.
// "Insert image" offers only JPEG and PNG files, and the rule and the size limit are stated before a file is chosen
// (R-8.17, R-8.29). The editor is the content domain's (content-edit · editing); the title and address fields are
// trimmed here. Seen by an administrator.
const meta: Meta = { title: "files/file-embedded-image/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <FilePage>
        <EditFrame>
          <ImageEditor />
        </EditFrame>
      </FilePage>
    </SitePage>
  ),
};
