import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-edit · delete-confirm — the vendor asked to delete their draft. Deleting is permanent, and afterwards
// the proposal can no longer be opened. Delete is offered only on a draft (R-2.4)
const meta: Meta = { title: "proposals/proposal-cwu-edit/delete-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeleteConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Code With Us proposal"
          program="code-with-us"
          status="Draft"
          title="Build an accessible permit tracker"
        />
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="primary" data-testid="proposal-submit">Submit proposal</Button>
          <Button variant="secondary" danger data-testid="proposal-delete-button">Delete</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the draft story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Delete this proposal?"
            data-testid="proposal-delete-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Cancel</Button>
                <Button variant="primary" danger data-testid="proposal-delete-confirm">Delete proposal</Button>
              </>
            }
          >
            <p className="op-text">
              The draft and everything in it will be removed, and it can no longer be opened. This cannot be undone.
            </p>
          </AlertDialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
