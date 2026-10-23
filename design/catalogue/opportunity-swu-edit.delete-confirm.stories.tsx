import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, Text } from "@bcgov/design-system-react-components";
import { ActionBar, OpportunityHead, OpportunityPage, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · delete-confirm — the author asked to confirm deleting their draft (R-1.28, R-1.53)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/delete-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeleteConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Draft"
          title="Modernize the licence renewal service"
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
            <Text elementType="p">The opportunity and everything entered in it will be removed. This cannot be undone.</Text>
          </AlertDialog>
        </Modal>
      </OpportunityPage>
    </SitePage>
  ),
};
