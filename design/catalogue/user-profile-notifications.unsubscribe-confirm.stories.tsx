import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";
import { NotificationsPage } from "./user-profile-sections";

// user-profile-notifications · unsubscribe-confirm — arrived from a message's unsubscribe link; nothing changes until confirmed (R-4.29)
const meta: Meta = { title: "users/user-profile-notifications/unsubscribe-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const UnsubscribeConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <NotificationsPage base="/users/0b6f2c1e-5a7d-4c3e-9f10-000000000003" tabs={false}>
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
