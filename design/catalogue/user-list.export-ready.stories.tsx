import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, Dialog, Heading, Modal, TextField } from "@bcgov/design-system-react-components";
import { look } from "./marketplace";
import { PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, UserPage } from "./user-kit";

// user-list · export-ready — at least one account type and one field chosen, export available (R-4.32). The list
// behind the dialog is drawn in user-list · default.
const meta: Meta = { title: "users/user-list/export-ready", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ExportReady: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>Digital Marketplace Users</PageTitle>
        <div className="us-toolbar">
          <TextField type="search" label="Search by name" data-testid="user-list-search" />
          <Button variant="secondary" data-testid="contact-list-open-export">Export contact list</Button>
        </div>
        <Modal isOpen isDismissable>
          <Dialog isCloseable data-testid="contact-list-modal">
            <div className="us-dialog">
              <Heading level={2} slot="title" style={look.section}>Export contact list</Heading>
              <p className="op-text">The file lists active accounts only.</p>
              <CheckboxGroup
                label="Account types"
                description="Administrators are included with public sector employees."
                isRequired
                defaultValue={["public-sector", "vendor"]}
              >
                <Checkbox value="public-sector" data-testid="contact-list-user-type">Public sector employees</Checkbox>
                <Checkbox value="vendor" data-testid="contact-list-user-type">Vendors</Checkbox>
              </CheckboxGroup>
              <CheckboxGroup label="Fields" isRequired defaultValue={["email", "organization-name"]}>
                <Checkbox value="first-name" data-testid="contact-list-field">First name</Checkbox>
                <Checkbox value="last-name" data-testid="contact-list-field">Last name</Checkbox>
                <Checkbox value="email" data-testid="contact-list-field">Email address</Checkbox>
                <Checkbox value="organization-name" data-testid="contact-list-field">Organization name</Checkbox>
              </CheckboxGroup>
              <ButtonGroup alignment="end" ariaLabel="Export actions">
                <Button variant="secondary" data-testid="contact-list-cancel-button">Cancel</Button>
                <Button variant="primary" data-testid="contact-list-export-button">Export</Button>
              </ButtonGroup>
            </div>
          </Dialog>
        </Modal>
      </UserPage>
    </SitePage>
  ),
};
