import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./opportunity-kit";
import { CreateForm, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-create · invalid — the legal name was left blank and the contact email is "not-an-email"; each field
// says what is wrong as the person leaves it, the list before the buttons repeats them, and Create stays
// unavailable. The optional fields are empty and raise nothing (R-3.22)
const meta: Meta = { title: "organizations/organization-create/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <PageTitle>Create Organization</PageTitle>
        <p className="op-text">You will be the organization’s owner. Fields not marked “(optional)” are required.</p>
        <CreateForm
          values={{
            street: "100 Example Street",
            city: "Victoria",
            region: "British Columbia",
            mailCode: "V0V 0V0",
            country: "Canada",
            contactName: "Test Vendor One",
            contactEmail: "not-an-email",
          }}
          errors={{
            legalName: "Enter the organization’s legal name",
            contactEmail: "Enter an email address in a valid format, like name@example.com",
          }}
          problems={[
            { field: "legalName", text: "Legal name: enter the organization’s legal name" },
            { field: "contactEmail", text: "Contact email address: enter an email address in a valid format, like name@example.com" },
          ]}
        />
      </OrganizationPage>
    </SitePage>
  ),
};
