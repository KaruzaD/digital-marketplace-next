import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditForm, ManagementTop, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · logo-refused — the owner chose "northwind.gif" through the chooser's "all files" option and
// saved. The logo is refused because its name does not end in .jpg, .jpeg or .png (R-8.30); a file whose name is
// allowed but whose content is not a JPEG or PNG image is refused in the same place (R-8.21). Nothing is stored, the
// stored logo is kept, the form stays open with what was typed, and focus moves to the message. The picker is the files
// domain's image picker with "Logo" in place of "Profile picture".
const meta: Meta = { title: "organizations/organization-edit/logo-refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const LogoRefused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="organization" swu twu />
        <EditForm refusedLogo="northwind.gif" />
      </OrganizationPage>
    </SitePage>
  ),
};
