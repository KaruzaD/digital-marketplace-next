import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Form } from "@bcgov/design-system-react-components";
import { FilePage, PictureGroup, ProfileFrame, Trimmed } from "./file-kit";
import { Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// file-image-picker · chosen — the vendor chose "harbour.png" and it is previewed from their own device. Nothing is
// uploaded or stored until they save; when they do, the picture is stored marked readable by anyone and made smaller if
// it is wider or taller than 500 pixels (R-8.13, R-8.28). Choosing again replaces the preview; Cancel discards it.
const meta: Meta = { title: "files/file-image-picker/chosen", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Chosen: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <FilePage>
        <ProfileFrame>
          <Region id="edit-heading" title="Edit your details">
            <Form validationBehavior="aria" className="op-region">
              <PictureGroup trigger="Choose a different profile picture">
                <img
                  src="blob:preview-of-harbour.png"
                  alt="Preview of harbour.png, your new profile picture"
                  className="fl-image"
                  data-testid="profile-image-preview"
                />
                <p role="status" className="op-note">
                  harbour.png is ready. Save your changes to use it as your profile picture.
                </p>
              </PictureGroup>
              <Trimmed>
                Sign-in username, name and email address follow. They are the users domain's design and are not shown here.
              </Trimmed>
              <ButtonGroup ariaLabel="Profile actions">
                <Button type="submit" variant="primary">Save changes</Button>
                <Button variant="secondary">Cancel</Button>
              </ButtonGroup>
            </Form>
          </Region>
        </ProfileFrame>
      </FilePage>
    </SitePage>
  ),
};
