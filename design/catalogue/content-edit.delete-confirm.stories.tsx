import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, Text } from "@bcgov/design-system-react-components";
import { ContentPage, ManageHead, PageActions } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · delete-confirm — the administrator pressed Delete page on an ordinary page. This one question is the only
// safeguard: removal is immediate and permanent, takes every version with it, and the address stops answering (R-7.9).
// The page behind the dialog is trimmed; it is drawn whole in content-edit · default.
const meta: Meta = { title: "content/content-edit/delete-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeleteConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <PageActions deletable />
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Delete “Hackathon rules”?"
            data-testid="content-delete-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="content-dialog-cancel">Cancel</Button>
                <Button variant="primary" danger data-testid="content-delete-confirm">Delete page</Button>
              </>
            }
          >
            <Text elementType="p">
              The page and every earlier version of it will be removed permanently, and /content/hackathon-rules will stop
              answering. Links to it from anywhere will lead to the not-found page. This cannot be undone.
            </Text>
          </AlertDialog>
        </Modal>
      </ContentPage>
    </SitePage>
  ),
};
