import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Dialog, Heading, Modal, TextField } from "@bcgov/design-system-react-components";
import { look } from "./marketplace";
import { Actions } from "./opportunity-kit";
import { DialogBody, ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · invite-open — the owner inviting two people at once by email address; each invitation is sent
// as an ordinary membership and waits, pending, until the person accepts (R-3.7, R-3.8, R-3.17). The whole Team
// members tab is drawn behind the dialog, as in organization-edit · team.
const meta: Meta = { title: "organizations/organization-edit/invite-open", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const InviteOpen: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab />
        <Modal isOpen isDismissable>
          <Dialog isCloseable data-testid="organization-invite-dialog">
            <DialogBody>
              <Heading level={2} slot="title" style={look.section}>
                Add team members
              </Heading>
              <p className="op-text">
                Each person is emailed an invitation and joins the team as a member once they accept. Only people with a vendor account can be invited. Anyone not
                yet registered is emailed an invitation to sign up instead.
              </p>
              <TextField label="Email address 1" type="email" isRequired defaultValue="vendor4@example.com" data-testid="organization-invite-email-field" />
              <TextField label="Email address 2" type="email" defaultValue="vendor5@example.com" data-testid="organization-invite-email-field" />
              <Actions>
                <Button variant="tertiary" data-testid="organization-invite-add-email">
                  Add another email address
                </Button>
              </Actions>
              <ButtonGroup alignment="end" ariaLabel="Invitation actions">
                <Button variant="secondary" data-testid="organization-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" data-testid="organization-invite-submit">
                  Send invitations
                </Button>
              </ButtonGroup>
            </DialogBody>
          </Dialog>
        </Modal>
      </OrganizationPage>
    </SitePage>
  ),
};
