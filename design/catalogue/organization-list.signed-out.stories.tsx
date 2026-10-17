import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./opportunity-kit";
import { OrganizationPage, OrganizationRows, Pagination, type ListedOrganization } from "./organization-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// organization-list · signed-out — a visitor who is not signed in (and, identically, public sector staff): legal
// names only, no owner or qualification columns, nothing to open and nothing to create (R-3.1, R-3.2, R-3.21)
const meta: Meta = { title: "organizations/organization-list/signed-out", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const organizations: ListedOrganization[] = [
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000204", name: "Aurora Data Collective", open: false },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000201", name: "Northwind Digital Co-operative", open: false },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000202", name: "Pacific Service Design Ltd.", open: false },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000205", name: "Tidewater Analytics Inc.", open: false },
];

export const SignedOut: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="organizations">
      <OrganizationPage>
        <PageTitle>Digital Marketplace Organizations</PageTitle>
        <OrganizationRows organizations={organizations} full={false} caption="Registered organizations by legal name." />
        <Pagination page={1} pages={2} />
      </OrganizationPage>
    </SitePage>
  ),
};
