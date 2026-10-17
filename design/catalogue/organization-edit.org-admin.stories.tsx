import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementTop, OrganizationPage, OrganizationTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_TWO } from "./user-kit";

// organization-edit · org-admin — a member the owner made an administrator, who is not the owner: the profile is
// read-only and neither Edit nor Archive is offered (R-3.3, R-3.18)
const meta: Meta = { title: "organizations/organization-edit/org-admin", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const OrgAdmin: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_TWO} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu />
        <OrganizationTab canEdit={false} />
      </OrganizationPage>
    </SitePage>
  ),
};
