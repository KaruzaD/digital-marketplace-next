import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFrame, FilePage, ImageEditor, Uploading as UploadStatus } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-embedded-image · uploading — the administrator chose "harbour-map.png" and it is being stored. A status line
// says so; Insert image is unavailable until the upload ends, and the body is not changed until it succeeds (R-8.29).
// The rest of the editor stays usable.
const meta: Meta = { title: "files/file-embedded-image/uploading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Uploading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <FilePage>
        <EditFrame>
          <ImageEditor uploading>
            <UploadStatus file="harbour-map.png" />
          </ImageEditor>
        </EditFrame>
      </FilePage>
    </SitePage>
  ),
};
