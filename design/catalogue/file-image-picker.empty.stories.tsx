import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Form } from "@bcgov/design-system-react-components";
import { FilePage, PictureGroup, ProfileFrame, Trimmed } from "./file-kit";
import { Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// file-image-picker · empty — a vendor editing their own profile, with no profile picture stored. A sentence stands in
// place of the picture; the chooser offers only JPEG and PNG files, and the rule and the size limit are stated before a
// file is chosen (R-8.17, R-8.30).
const meta: Meta = { title: "files/file-image-picker/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <FilePage>
        <ProfileFrame>
          <Region id="edit-heading" title="Edit your details">
            <Form validationBehavior="aria" className="op-region">
              <PictureGroup trigger="Choose a profile picture">
                <p className="op-note">No profile picture has been added.</p>
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
