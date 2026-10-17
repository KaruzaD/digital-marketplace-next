import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { AccountFacts, UserPage, VENDOR_ONE } from "./user-kit";

// user-profile-self · deactivate-confirm — a person asked to confirm deactivating their own account (R-4.9, R-4.5). The
// page behind the dialog is trimmed; it is drawn whole in user-profile-self · default.
const meta: Meta = { title: "users/user-profile-self/deactivate-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeactivateConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Vendor" />
        <div className="us-fields">
          <TextField label="Name" value="Test Vendor One" isReadOnly data-testid="name-field" />
        </div>
        <Actions>
          <Button variant="secondary" danger data-testid="profile-deactivate-button">Deactivate account</Button>
        </Actions>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Deactivate your account?"
            data-testid="activation-modal"
            buttons={
              <>
                <Button variant="secondary" data-testid="activation-cancel-button">Cancel</Button>
                <Button variant="primary" danger data-testid="activation-confirm-button">Deactivate my account</Button>
              </>
            }
          >
            <p className="op-text">
              You will be signed out straight away. Your account will be kept, and you can reactivate it at any time by signing in again.
            </p>
          </AlertDialog>
        </Modal>
      </UserPage>
    </SitePage>
  ),
};
