import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditForm, ManagementTop, NORTHWIND, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · invalid — the owner cleared the city and typed a malformed website; each field says what is
// wrong, the list before the buttons repeats it, and Save stays unavailable until both are fixed (R-3.22)
const meta: Meta = { title: "organizations/organization-edit/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu />
        <EditForm
          values={{ ...NORTHWIND, website: "northwind", city: "" }}
          errors={{
            website: "Enter the full website address, like https://example.com, or leave it blank",
            city: "Enter the city",
          }}
          problems={[
            { field: "website", text: "Website: enter the full website address, like https://example.com, or leave it blank" },
            { field: "city", text: "City: enter the city" },
          ]}
        />
      </OrganizationPage>
    </SitePage>
  ),
};
