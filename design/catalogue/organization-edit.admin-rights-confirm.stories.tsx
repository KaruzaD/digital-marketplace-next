import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Checkbox, Modal } from "@bcgov/design-system-react-components";
import { ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · admin-rights-confirm — the owner giving an active member administrator rights must first
// confirm the statement of what those rights allow; the confirm button waits for it (R-3.12). The whole Team members
// tab is drawn behind the dialog, as in organization-edit · team.
const meta: Meta = { title: "organizations/organization-edit/admin-rights-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AdminRightsConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab />
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Give Test Vendor Four administrator rights?"
            data-testid="organization-admin-rights-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="organization-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" isDisabled aria-describedby="admin-rights-hint" data-testid="organization-admin-rights-confirm">
                  Give administrator rights
                </Button>
              </>
            }
          >
            <div className="og-body">
              <p className="op-text">[Statement of what an organization administrator may do, supplied by the service.]</p>
              <Checkbox data-testid="organization-admin-terms-checkbox">I have read this statement and confirm it</Checkbox>
              <p id="admin-rights-hint" className="op-note">
                Confirm the statement to give administrator rights.
              </p>
            </div>
          </AlertDialog>
        </Modal>
      </OrganizationPage>
    </SitePage>
  ),
};
