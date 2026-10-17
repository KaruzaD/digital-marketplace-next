import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { UnsubscribeSettings } from "./notification-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// notification-unsubscribe-landing · default — a signed-in vendor arrived from the Unsubscribe offer at the end of an
// email announcing a new opportunity. Their own notification settings open with the question already asked, naming
// the address of whoever is signed in, not whoever the email was sent to (R-6.6, R-6.7). Nothing changes until
// Unsubscribe is pressed. The page behind the dialog is drawn whole.
const meta: Meta = { title: "notifications/notification-unsubscribe-landing/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

// The dialog is portalled by Modal and laid out by the design system.
export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UnsubscribeSettings subscribed>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="warning"
            title="Stop emails about new opportunities?"
            data-testid="unsubscribe-modal"
            buttons={
              <>
                <Button variant="secondary" data-testid="unsubscribe-cancel-button">Keep receiving them</Button>
                <Button variant="primary" data-testid="unsubscribe-confirm-button">Unsubscribe</Button>
              </>
            }
          >
            <p className="op-text">
              You are signed in as Test Vendor One. <span data-testid="unsubscribe-confirmation-address">vendor1@example.com</span> will
              no longer be emailed when new opportunities are posted.
            </p>
            <p className="op-text">You can turn these emails back on at any time from this page.</p>
          </AlertDialog>
        </Modal>
      </UnsubscribeSettings>
    </SitePage>
  ),
};
