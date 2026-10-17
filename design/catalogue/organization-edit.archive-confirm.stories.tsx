import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { ArchiveRegion, ManagementTop, OrganizationPage, OrganizationTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-edit · archive-confirm — a service administrator asked to confirm archiving an organization they do
// not own; the dialog says what archiving does and that the owner will be emailed (R-3.6, R-3.24). The whole
// Organization tab is drawn behind the dialog.
const meta: Meta = { title: "organizations/organization-edit/archive-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ArchiveConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" />
        <OrganizationTab canEdit />
        <ArchiveRegion />
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Archive Northwind Digital Co-operative?"
            data-testid="organization-archive-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="organization-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" danger data-testid="organization-archive-confirm">
                  Archive organization
                </Button>
              </>
            }
          >
            <div className="og-body">
              <p className="op-text">
                It will no longer appear in the organization list or in its members’ lists of organizations, and it cannot be used on proposals. Its records and
                memberships are kept.
              </p>
              <p className="op-text">Test Vendor One, the owner, will be emailed that an administrator has archived it.</p>
            </div>
          </AlertDialog>
        </Modal>
      </OrganizationPage>
    </SitePage>
  ),
};
