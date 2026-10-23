import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, ButtonGroup, Modal, Text, TextField } from "@bcgov/design-system-react-components";
import { ContentPage, ManageHead, PageForm } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · publish-confirm — the administrator pressed Publish changes and is asked to confirm. Readers see the new
// wording at once; the replaced wording is kept as an earlier version that nothing in the service can show (R-7.8, R-7.23).
// The form behind the dialog is trimmed; it is drawn whole in content-edit · editing.
const meta: Meta = { title: "content/content-edit/publish-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const PublishConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <PageForm>
          <TextField label="Title" isRequired defaultValue="Hackathon rules" data-testid="content-title-field" />
          <ButtonGroup ariaLabel="Edit actions">
            <Button variant="secondary" data-testid="content-cancel-button">Cancel</Button>
            <Button variant="primary" data-testid="content-publish-changes-button">Publish changes</Button>
          </ButtonGroup>
        </PageForm>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Publish your changes?"
            data-testid="content-publish-changes-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="content-dialog-cancel">Cancel</Button>
                <Button variant="primary" data-testid="content-publish-changes-confirm">Publish changes</Button>
              </>
            }
          >
            <Text elementType="p">
              Everyone reading /content/hackathon-rules will see the new wording straight away. The wording it replaces is
              kept on record, but it cannot be viewed or restored from the service.
            </Text>
          </AlertDialog>
        </Modal>
      </ContentPage>
    </SitePage>
  ),
};
