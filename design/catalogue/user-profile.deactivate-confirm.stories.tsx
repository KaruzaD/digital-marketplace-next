import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, UserPage } from "./user-kit";

// user-profile · deactivate-confirm — an administrator asked to confirm deactivating another person's account (R-4.30).
// The page behind the dialog is trimmed; it is drawn whole in user-profile · default.
const meta: Meta = { title: "users/user-profile/deactivate-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DeactivateConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Public sector employee" status="Active" />
        <div className="us-fields">
          <TextField label="Name" value="Test Public Servant" isReadOnly data-testid="name-field" />
        </div>
        <Actions>
          <Button variant="secondary" danger data-testid="profile-deactivate-button">Deactivate account</Button>
        </Actions>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Deactivate this account?"
            data-testid="activation-modal"
            buttons={
              <>
                <Button variant="secondary" data-testid="activation-cancel-button">Cancel</Button>
                <Button variant="primary" danger data-testid="activation-confirm-button">Deactivate account</Button>
              </>
            }
          >
            <p className="op-text">
              Test Public Servant will no longer be able to sign in. They will be sent an email saying an administrator has removed their access.
            </p>
          </AlertDialog>
        </Modal>
      </UserPage>
    </SitePage>
  ),
};
