import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./opportunity-kit";
import { CreateForm, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-create · ready — every required field is valid and the optional ones are left empty, so Create is
// available; creating makes the vendor the owner and opens the new organization's page (R-3.22, R-3.23)
const meta: Meta = { title: "organizations/organization-create/ready", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Ready: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <PageTitle>Create Organization</PageTitle>
        <p className="op-text">You will be the organization’s owner. Fields not marked “(optional)” are required.</p>
        <CreateForm
          ready
          values={{
            legalName: "Northwind Digital Co-operative",
            street: "100 Example Street",
            city: "Victoria",
            region: "British Columbia",
            mailCode: "V0V 0V0",
            country: "Canada",
            contactName: "Test Vendor One",
            contactEmail: "vendor1@example.com",
          }}
        />
      </OrganizationPage>
    </SitePage>
  ),
};
