import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { ActionBar, OpportunityHead, OpportunityPage, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · delete-confirm — the author asked to confirm deleting their draft (R-1.28, R-1.53)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/delete-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeleteConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Draft"
          title="Build an accessible permit tracker"
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="opportunity-submit-for-review">Submit for review</Button>
          <Button variant="secondary" danger data-testid="opportunity-delete-button">Delete</Button>
        </ActionBar>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Delete this opportunity?"
            data-testid="opportunity-delete-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="opportunity-dialog-cancel">Cancel</Button>
                <Button variant="primary" danger data-testid="opportunity-delete-confirm">Delete opportunity</Button>
              </>
            }
          >
            <p className="op-text">The opportunity and everything entered in it will be removed. This cannot be undone.</p>
          </AlertDialog>
        </Modal>
      </OpportunityPage>
    </SitePage>
  ),
};
