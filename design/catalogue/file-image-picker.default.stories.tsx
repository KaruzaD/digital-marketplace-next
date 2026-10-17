import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Form } from "@bcgov/design-system-react-components";
import { FilePage, PictureGroup, ProfileFrame, StoredPicture, Trimmed } from "./file-kit";
import { Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// file-image-picker · default — a vendor editing their own profile, with a profile picture already stored. The picture
// is shown from the address it is stored at, as it was stored: an upload 2000 by 300 pixels is held at 500 by 75
// (R-8.13), and it is readable by anyone, signed in or not (R-8.28). The chooser offers only JPEG and PNG files, and the
// rule and the size limit are stated before a file is chosen (R-8.17, R-8.21, R-8.30). The rest of the profile form is
// the users domain's (user-profile-self · editing) and is trimmed here. The same picker is the organization logo's.
const meta: Meta = { title: "files/file-image-picker/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <FilePage>
        <ProfileFrame>
          <Region id="edit-heading" title="Edit your details">
            <Form validationBehavior="aria" className="op-region">
              <PictureGroup trigger="Choose a different profile picture">
                <StoredPicture />
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
