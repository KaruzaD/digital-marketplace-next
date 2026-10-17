import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · loading — the organization has not arrived yet, so its name is not known and the surface
// title stands in as the H1 (R-3.3). Drawn for the owner.
const meta: Meta = { title: "organizations/organization-edit/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <PageTitle>Edit Organization</PageTitle>
        <Waiting label="Loading organization" />
      </OrganizationPage>
    </SitePage>
  ),
};
