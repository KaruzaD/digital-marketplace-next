import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFrame, FilePage, ImageEditor, Refusal } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-embedded-image · failed — the administrator chose an image larger than the limit and the upload was refused.
// The message names the file, the reason and the limit, and says nothing was added: the body is exactly as it was
// before the image was chosen (R-8.17, R-8.29). Any other refusal is shown in the same place with its own reason.
const meta: Meta = { title: "files/file-embedded-image/failed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Failed: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <FilePage>
        <EditFrame>
          <ImageEditor>
            <Refusal testId="embedded-image-error" title="harbour-survey.png could not be inserted">
              It is 12.4 MB. Images must be 10 MB or smaller. Nothing was added to the body.
            </Refusal>
          </ImageEditor>
        </EditFrame>
      </FilePage>
    </SitePage>
  ),
};
