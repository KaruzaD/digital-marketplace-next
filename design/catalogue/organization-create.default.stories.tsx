import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./opportunity-kit";
import { CreateForm, OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-create · default — a vendor who has accepted the terms opens a blank registration form; Create stays
// unavailable, with the reason stated, until every required field is valid (R-3.2, R-3.22, R-3.23)
const meta: Meta = { title: "organizations/organization-create/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <PageTitle>Create Organization</PageTitle>
        <p className="op-text">You will be the organization’s owner. Fields not marked “(optional)” are required.</p>
        <CreateForm />
      </OrganizationPage>
    </SitePage>
  ),
};
