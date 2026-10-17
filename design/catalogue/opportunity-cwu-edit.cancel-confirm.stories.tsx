import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextArea } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, OpportunityHead, OpportunityPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · cancel-confirm — an administrator asked to confirm cancelling a published opportunity, with an
// optional note (R-1.28, R-1.36)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/cancel-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const CancelConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Published"
          title="Build an accessible permit tracker"
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Cancel this opportunity?"
            data-testid="opportunity-cancel-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="opportunity-dialog-cancel">Keep opportunity</Button>
                <Button variant="primary" danger data-testid="opportunity-cancel-confirm">Cancel opportunity</Button>
              </>
            }
          >
            <div className="op-dialog">
              <p className="op-text">
                It will stop accepting proposals, and this cannot be undone. Everyone watching it and everyone who has
                submitted a proposal will be told it has been cancelled, and its author will be told separately.
              </p>
              <TextArea label="Note (optional)" maxLength={1000} description="Up to 1,000 characters." data-testid="opportunity-cancel-note-field" />
            </div>
          </AlertDialog>
        </Modal>
      </OpportunityPage>
    </SitePage>
  ),
};
