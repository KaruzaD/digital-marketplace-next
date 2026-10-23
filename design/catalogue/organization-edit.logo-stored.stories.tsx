import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArchiveRegion, ManagementTop, OrganizationPage, OrganizationTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · logo-stored — the owner on the Organization tab after saving a logo: the form is closed and the
// stored logo is shown at its stored size, read from the address the service gives it (R-8.13, R-8.28). It is the
// default story with a logo in place of "No logo has been added."
const meta: Meta = { title: "organizations/organization-edit/logo-stored", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const LogoStored: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu twu />
        <OrganizationTab canEdit storedLogo />
        <ArchiveRegion />
      </OrganizationPage>
    </SitePage>
  ),
};
