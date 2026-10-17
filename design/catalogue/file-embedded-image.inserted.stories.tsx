import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFrame, FilePage, ImageEditor } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-embedded-image · inserted — "harbour-map.png" was stored and a reference to it was inserted at the cursor. The
// reference is an internal marker carrying the file's identifier, never a web address; it is turned into the file's
// address only when the text is displayed (R-8.29). The inserted reference carries placeholder alternative text, which
// is selected so the administrator can type a description over it.
const meta: Meta = { title: "files/file-embedded-image/inserted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const body =
  "Placeholder: the rules of the hackathon, written by an administrator.\n\n## Where it happens\n\n" +
  "![Describe this image](@file/5b2e0c3a-8d41-4f6e-a1c2-000000000806)";

export const Inserted: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <FilePage>
        <EditFrame>
          <ImageEditor body={body}>
            <p role="status" className="op-note">
              harbour-map.png was inserted at the cursor. Replace "Describe this image" with a description of what it shows.
            </p>
          </ImageEditor>
        </EditFrame>
      </FilePage>
    </SitePage>
  ),
};
