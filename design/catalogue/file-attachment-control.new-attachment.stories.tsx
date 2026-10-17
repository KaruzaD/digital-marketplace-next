import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@bcgov/design-system-react-components";
import { AttachmentControl, FilePage, ManageFrame, NewRow, StoredRow } from "./file-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · new-attachment — the person chose "scan0001.pdf" and typed "Statement of work" as its name.
// A new attachment can be renamed or removed until it is saved; the line under the name shows that the ending of the
// original file is put back on, so it will be stored as "Statement of work.pdf" (R-8.27). The file is uploaded when the
// form is saved, with no read access recorded against it (R-8.19). Seen by an administrator.
const meta: Meta = { title: "files/file-attachment-control/new-attachment", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NewAttachment: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <FilePage>
        <ManageFrame>
          <AttachmentControl>
            <StoredRow name="Current permit screens.png" id="5b2e0c3a-8d41-4f6e-a1c2-000000000804" />
            <NewRow chosen="New: scan0001.pdf, 1.2 MB. It is uploaded when you save." file="scan0001.pdf">
              <TextField
                label="Name for scan0001.pdf (optional)"
                defaultValue="Statement of work"
                description="Leave it empty to keep the name scan0001.pdf. If you leave off the ending, .pdf is added."
                aria-describedby="attachment-new-1-result"
                data-testid="attachment-name-field"
              />
              <p id="attachment-new-1-result" className="op-note" data-testid="attachment-resulting-name">
                Will be saved as: Statement of work.pdf
              </p>
            </NewRow>
          </AttachmentControl>
        </ManageFrame>
      </FilePage>
    </SitePage>
  ),
};
