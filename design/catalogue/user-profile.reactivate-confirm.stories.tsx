import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextField } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, AccountFacts, UserPage } from "./user-kit";

// user-profile · reactivate-confirm — an administrator asked to confirm reactivating an account they may reactivate
// (R-4.19, R-4.20). The page behind the dialog is trimmed; it is drawn whole in user-profile · deactivated-by-admin.
const meta: Meta = { title: "users/user-profile/reactivate-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ReactivateConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <AccountFacts type="Public sector employee" status="Inactive" />
        <div className="us-fields">
          <TextField label="Name" value="Test Public Servant" isReadOnly data-testid="name-field" />
        </div>
        <Actions>
          <Button variant="primary" data-testid="profile-reactivate-button">Reactivate account</Button>
        </Actions>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Reactivate this account?"
            data-testid="activation-modal"
            buttons={
              <>
                <Button variant="secondary" data-testid="activation-cancel-button">Cancel</Button>
                <Button variant="primary" data-testid="activation-confirm-button">Reactivate account</Button>
              </>
            }
          >
            <p className="op-text">
              Test Public Servant will be able to sign in again. They will be sent an email saying an administrator has reactivated their account.
            </p>
          </AlertDialog>
        </Modal>
      </UserPage>
    </SitePage>
  ),
};
