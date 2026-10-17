import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@bcgov/design-system-react-components";
import { AttachmentControl, FilePage, ManageFrame, NewRow } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · invalid — the person saved with a new attachment's name longer than 255 characters. The
// save is refused and the error is shown against that attachment, not against the form as a whole; what was typed is
// kept (R-8.23, R-8.27 note). Focus moves to the name field. Seen by an administrator.
const meta: Meta = { title: "files/file-attachment-control/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const longName =
  "Statement of work for the accessible permit tracker including the full description of every screen the applicant " +
  "sees, the status messages for each stage of an application, the plain-language glossary, the keyboard and screen " +
  "reader test plan, and the schedule";

// After the refused save, focus goes to the refused field.
function NameField() {
  useEffect(() => {
    document.getElementById("attachment-new-1-name")?.focus();
  }, []);
  return (
    <TextField
      id="attachment-new-1-name"
      label="Name for scan0001.pdf (optional)"
      defaultValue={longName}
      description="Leave it empty to keep the name scan0001.pdf. If you leave off the ending, .pdf is added."
      isInvalid
      errorMessage="The file name must be between 1 and 255 characters long. With its ending, this one is 264."
      data-testid="attachment-name-field"
    />
  );
}

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <FilePage>
        <ManageFrame>
          <AttachmentControl>
            <NewRow chosen="New: scan0001.pdf, 1.2 MB. It is uploaded when you save." file="scan0001.pdf">
              <NameField />
            </NewRow>
          </AttachmentControl>
        </ManageFrame>
      </FilePage>
    </SitePage>
  ),
};
