import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Link, Modal } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-profile-self-legal · accept-terms-confirm — the vendor is asked to agree to the updated terms (R-4.16). The page
// behind the dialog is trimmed; it is drawn whole in user-profile-self-legal · terms-updated.
const meta: Meta = { title: "users/user-profile-self-legal/accept-terms-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AcceptTermsConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Policies, Terms &amp; Agreements</PageTitle>
        <Actions>
          <Button variant="primary" data-testid="legal-accept-updated-terms-button">Review and agree to the updated terms</Button>
        </Actions>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Agree to the updated terms and conditions?"
            data-testid="legal-accept-terms-modal"
            buttons={
              <>
                <Button variant="secondary">Not now</Button>
                <Button variant="primary" data-testid="legal-accept-terms-confirm-button">I agree</Button>
              </>
            }
          >
            <p className="op-text">
              By agreeing, you confirm you have read and agree to the{" "}
              <Link href="/content/terms-and-conditions">Digital Marketplace terms and conditions</Link>. The date and time you agree will be recorded on your account.
            </p>
          </AlertDialog>
        </Modal>
      </UserPage>
    </SitePage>
  ),
};
