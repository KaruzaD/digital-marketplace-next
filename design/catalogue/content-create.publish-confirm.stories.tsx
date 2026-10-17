import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, ButtonGroup, Modal, Text, TextField } from "@bcgov/design-system-react-components";
import { ContentPage, FieldPair, PageForm } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · publish-confirm — the administrator pressed Publish page and is asked to confirm, because the page is
// public from the moment it is published and there is no draft to hold it back (R-7.7, R-7.1 note). The form behind the
// dialog is trimmed; it is drawn whole in content-create · ready.
const meta: Meta = { title: "content/content-create/publish-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const PublishConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <PageTitle>Create a New Page</PageTitle>
        <PageForm>
          <FieldPair>
            <TextField label="Title" isRequired defaultValue="Hackathon rules" data-testid="content-title-field" />
            <TextField label="Address" isRequired defaultValue="hackathon-rules" data-testid="content-slug-field" />
          </FieldPair>
          <ButtonGroup ariaLabel="Page actions">
            <Button variant="secondary" data-testid="content-cancel-button">Cancel</Button>
            <Button variant="primary" data-testid="content-publish-button">Publish page</Button>
          </ButtonGroup>
        </PageForm>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Publish this page?"
            data-testid="content-publish-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="content-dialog-cancel">Cancel</Button>
                <Button variant="primary" data-testid="content-publish-confirm">Publish page</Button>
              </>
            }
          >
            <Text elementType="p">
              "Hackathon rules" will be public at /content/hackathon-rules as soon as it is published. Anyone can read it,
              including people who are not signed in.
            </Text>
          </AlertDialog>
        </Modal>
      </ContentPage>
    </SitePage>
  ),
};
