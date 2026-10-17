import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { OrganizationPage } from "./organization-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// organization-list · loading — the page of organizations has not arrived yet (R-3.1). Anyone may browse the list, so
// it is drawn for a visitor.
const meta: Meta = { title: "organizations/organization-list/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="organizations">
      <OrganizationPage>
        <PageTitle>Digital Marketplace Organizations</PageTitle>
        <Waiting label="Loading organizations" />
      </OrganizationPage>
    </SitePage>
  ),
};
