import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArchiveRegion, ManagementTop, OrganizationPage, OrganizationTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · default — the owner on the Organization tab of an organization qualified for both programs:
// the profile read-only, with Edit and Archive offered (R-3.3, R-3.6, R-3.18, R-3.25, R-3.26)
const meta: Meta = { title: "organizations/organization-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu twu />
        <OrganizationTab canEdit />
        <ArchiveRegion />
      </OrganizationPage>
    </SitePage>
  ),
};
