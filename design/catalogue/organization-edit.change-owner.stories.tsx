import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Dialog, Heading, Modal, Select } from "@bcgov/design-system-react-components";
import { look } from "./marketplace";
import { DialogBody, ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-edit · change-owner — a service administrator transferring ownership; only active members are offered,
// so the pending invitee is not in the list, and the previous owner becomes an ordinary member (R-3.13). The whole
// Team members tab is drawn behind the dialog, as in organization-edit · team-administrator.
const meta: Meta = { title: "organizations/organization-edit/change-owner", parameters: { viewport: { options: WIDTHS } } };
export default meta;

// Test Vendor Three's invitation is still pending, so they are not a choice.
const activeMembers = [
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000004", label: "Test Vendor Two" },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000007", label: "Test Vendor Four" },
];

export const ChangeOwner: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab asAdministrator />
        <Modal isOpen isDismissable>
          <Dialog isCloseable data-testid="organization-change-owner-dialog">
            <DialogBody>
              <Heading level={2} slot="title" style={look.section}>
                Change owner
              </Heading>
              <p className="op-text">
                Test Vendor One, the current owner, will become an ordinary member. Only members who have accepted their invitation can be chosen.
              </p>
              <Select label="New owner" isRequired items={activeMembers} data-testid="organization-new-owner-field" />
              <ButtonGroup alignment="end" ariaLabel="Change owner actions">
                <Button variant="secondary" data-testid="organization-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" data-testid="organization-change-owner-confirm">
                  Change owner
                </Button>
              </ButtonGroup>
            </DialogBody>
          </Dialog>
        </Modal>
      </OrganizationPage>
    </SitePage>
  ),
};
