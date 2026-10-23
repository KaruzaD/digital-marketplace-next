import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { NotificationsPage } from "./user-profile-sections";

// user-profile-self-notifications · unsubscribe-confirm — arrived from a message's unsubscribe link; the question names
// the address that would stop receiving notices, and nothing changes until confirmed (R-4.29)
const meta: Meta = { title: "users/user-profile-self-notifications/unsubscribe-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const UnsubscribeConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <NotificationsPage base="/users/me" tabs={false}>
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
            <p className="op-text">vendor1@example.com will no longer be emailed when new opportunities are posted.</p>
          </AlertDialog>
        </Modal>
      </NotificationsPage>
    </SitePage>
  ),
};
