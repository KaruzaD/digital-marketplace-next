import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, OpportunityHead, OpportunityPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · publish-confirm — an administrator who pressed Publish on an opportunity under review is asked
// to confirm (R-1.22, R-1.23, R-1.34)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/publish-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const PublishConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Under review"
          title="Build an accessible permit tracker"
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="opportunity-publish">Publish</Button>
          <Button variant="secondary" danger data-testid="opportunity-delete-button">Delete</Button>
        </ActionBar>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Publish this opportunity?"
            data-testid="opportunity-publish-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="opportunity-dialog-cancel">Cancel</Button>
                <Button variant="primary" data-testid="opportunity-publish-confirm">Publish opportunity</Button>
              </>
            }
          >
            <p className="op-text">
              Everyone will be able to read it and send proposals until its proposal deadline. Everyone who has asked to hear
              about new opportunities will be emailed, and its author will be sent a confirmation.
            </p>
          </AlertDialog>
        </Modal>
      </OpportunityPage>
    </SitePage>
  ),
};
