import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, Text, TextArea } from "@bcgov/design-system-react-components";
import { Stack } from "./layout";
import { ADMIN, ActionBar, OpportunityHead, OpportunityPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · cancel-confirm — an administrator asked to confirm cancelling an opportunity in evaluation,
// with an optional note (R-1.28, R-1.36)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/cancel-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const CancelConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Team questions: individual evaluation"
          title="Modernize the licence renewal service"
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
            <Stack gap="medium">
              <Text elementType="p">
                It will stop accepting proposals, and this cannot be undone. Everyone watching it and everyone who has submitted
                a proposal will be told it has been cancelled, and its author will be told separately.
              </Text>
              <TextArea label="Note (optional)" maxLength={1000} description="Up to 1,000 characters." data-testid="opportunity-cancel-note-field" />
            </Stack>
          </AlertDialog>
        </Modal>
      </OpportunityPage>
    </SitePage>
  ),
};
