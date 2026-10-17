import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditForm, ManagementTop, NORTHWIND, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · editing — the owner editing the profile; the contact phone number is saved with every other
// field, and clearing it removes the stored number (R-3.18, R-3.19, R-3.22)
const meta: Meta = { title: "organizations/organization-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu />
        <EditForm values={{ ...NORTHWIND, contactPhone: "250-555-0199" }} />
      </OrganizationPage>
    </SitePage>
  ),
};
