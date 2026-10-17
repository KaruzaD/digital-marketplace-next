import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · remove-member-confirm — the owner asked to confirm ending an active member's membership; it
// becomes inactive rather than erased, and the person stops counting towards the team (R-3.10). The whole Team members
// tab is drawn behind the dialog, as in organization-edit · team.
const meta: Meta = { title: "organizations/organization-edit/remove-member-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const RemoveMemberConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab />
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Remove Test Vendor Four from the team?"
            data-testid="organization-member-remove-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="organization-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" danger data-testid="organization-member-remove-confirm">
                  Remove from team
                </Button>
              </>
            }
          >
            <p className="op-text">
              Test Vendor Four will no longer be on Northwind Digital Co-operative’s team, and will stop counting towards its size and capabilities. They can be
              invited again later.
            </p>
          </AlertDialog>
        </Modal>
      </OrganizationPage>
    </SitePage>
  ),
};
