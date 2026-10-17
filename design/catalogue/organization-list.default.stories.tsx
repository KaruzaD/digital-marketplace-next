import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle } from "./opportunity-kit";
import { OrganizationPage, OrganizationRows, Pagination, type ListedOrganization } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-list · default — a signed-in vendor browsing registered organizations; owner, team size and
// qualification are filled in only for the organizations they own or administer (R-3.1, R-3.2, R-3.21)
const meta: Meta = { title: "organizations/organization-list/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

// Test Vendor One owns Northwind and administers Pacific; the other two rows are somebody else's.
const organizations: ListedOrganization[] = [
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000204", name: "Aurora Data Collective", open: false },
  {
    id: "4a9e1c20-6d3b-4f1a-8e2c-000000000201",
    name: "Northwind Digital Co-operative",
    open: true,
    details: { owner: "Test Vendor One", size: 3, swu: true, twu: false },
  },
  {
    id: "4a9e1c20-6d3b-4f1a-8e2c-000000000202",
    name: "Pacific Service Design Ltd.",
    open: true,
    details: { owner: "Test Vendor Two", size: 2, swu: false, twu: true },
  },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000205", name: "Tidewater Analytics Inc.", open: false },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <PageTitle>Digital Marketplace Organizations</PageTitle>
        <Actions>
          <Link href="/organizations/create" isButton buttonVariant="primary" data-testid="organization-create-link">
            Create organization
          </Link>
          <Link href="/users/me?tab=organizations" isButton buttonVariant="secondary" data-testid="organization-list-my-organizations">
            My organizations
          </Link>
        </Actions>
        <OrganizationRows
          organizations={organizations}
          full
          caption="Registered organizations by legal name. Owner, team size and qualification are shown only for organizations you own or administer."
        />
        <Pagination page={1} pages={2} />
      </OrganizationPage>
    </SitePage>
  ),
};
