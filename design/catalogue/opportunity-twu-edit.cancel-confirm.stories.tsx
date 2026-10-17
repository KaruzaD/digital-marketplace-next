import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextArea } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, OpportunityHead, OpportunityPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · cancel-confirm — an administrator asked to confirm cancelling an opportunity in evaluation,
// with an optional note (R-1.28, R-1.36)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/cancel-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const CancelConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Resource questions: individual evaluation"
          title="Data platform team"
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
