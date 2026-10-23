import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { TermsBroadcastPage } from "./notification-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// notification-terms-broadcast · notify-confirm — the administrator pressed "Notify vendors of updated terms". The
// question says what will happen before anything does; nothing is withdrawn or sent until "Notify vendors" is pressed
// (R-6.23: "chooses to notify vendors and confirms"). The page behind the dialog is drawn whole, as in
// notification-terms-broadcast · default.
const meta: Meta = { title: "notifications/notification-terms-broadcast/notify-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

// The dialog is portalled by Modal and laid out by the design system.
export const NotifyConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <TermsBroadcastPage>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="warning"
            title="Notify vendors that the terms have changed?"
            data-testid="notify-vendors-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="notify-vendors-cancel-button">Cancel</Button>
                <Button variant="primary" data-testid="notify-vendors-confirm-button">Notify vendors</Button>
              </>
            }
          >
            <p className="op-text">
              Every vendor's acceptance of the terms and conditions will be withdrawn, and each active vendor will be emailed
              asking them to read and accept the new terms.
            </p>
            <p className="op-text">Withdrawn acceptances cannot be restored. Each vendor has to accept the new terms themselves.</p>
          </AlertDialog>
        </Modal>
      </TermsBroadcastPage>
    </SitePage>
  ),
};
