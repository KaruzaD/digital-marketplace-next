import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Form } from "@bcgov/design-system-react-components";
import { FilePage, PictureGroup, ProfileFrame, Refusal, StoredPicture, Trimmed } from "./file-kit";
import { Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// file-image-picker · rejected — the vendor chose "portrait.gif" through the chooser's "all files" option and saved.
// The picture is refused because its name does not end in .jpg, .jpeg or .png (R-8.30); a file whose name is allowed
// but whose content is not a JPEG or PNG image is refused in the same place (R-8.21). Nothing is stored, the stored
// picture is kept, and the rest of the form keeps what was typed. Focus moves to the message.
const meta: Meta = { title: "files/file-image-picker/rejected", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Rejected: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <FilePage>
        <ProfileFrame>
          <Region id="edit-heading" title="Edit your details">
            <Form validationBehavior="aria" className="op-region">
              <PictureGroup trigger="Choose a different profile picture">
                <StoredPicture />
                <Refusal testId="image-rejected-error" title="portrait.gif cannot be used as a profile picture" focus>
                  Choose a JPEG or PNG image. Its name must end in .jpg, .jpeg or .png. Your current picture has been kept.
                </Refusal>
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
