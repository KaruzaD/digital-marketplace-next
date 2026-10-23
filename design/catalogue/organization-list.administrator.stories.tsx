import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./opportunity-kit";
import { OrganizationPage, OrganizationRows, Pagination, type ListedOrganization } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-list · administrator — a service administrator sees every organization's owner, team size and both
// qualification marks, and may open any of them; not being a vendor, they are not offered Create (R-3.1, R-3.2, R-3.3, R-3.21)
const meta: Meta = { title: "organizations/organization-list/administrator", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const organizations: ListedOrganization[] = [
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000204", name: "Aurora Data Collective", open: true, details: { owner: "Test Vendor Five", size: 1, swu: false, twu: false } },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000201", name: "Northwind Digital Co-operative", open: true, details: { owner: "Test Vendor One", size: 3, swu: true, twu: false } },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000202", name: "Pacific Service Design Ltd.", open: true, details: { owner: "Test Vendor Two", size: 2, swu: false, twu: true } },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000205", name: "Tidewater Analytics Inc.", open: true, details: { owner: "Test Vendor Six", size: 4, swu: true, twu: true } },
];

export const Administrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <OrganizationPage>
        <PageTitle>Digital Marketplace Organizations</PageTitle>
        <OrganizationRows organizations={organizations} full caption="Registered organizations by legal name. Archived organizations are not listed." />
        <Pagination page={2} pages={2} />
      </OrganizationPage>
    </SitePage>
  ),
};
