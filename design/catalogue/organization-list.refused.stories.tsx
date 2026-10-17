import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { PageTitle } from "./opportunity-kit";
import { OrganizationPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";

// organization-list · refused — the service answered the list request with "not permitted". It is shown as a
// refusal and never as an empty table, so the two answers cannot be mistaken for each other. Which request is
// refused, and for whom, is not stated by any criterion: see DESIGN.md, organizations gap 1. Drawn for public sector
// staff, whom R-3.20 refuses the organizations one may act for.
const meta: Meta = { title: "organizations/organization-list/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT} current="organizations">
      <OrganizationPage>
        <PageTitle>Digital Marketplace Organizations</PageTitle>
        <div data-testid="organization-list-refused">
          <InlineAlert
            variant="danger"
            role="alert"
            title="You are not permitted to see these organizations"
            description="Only a signed-in vendor can see the organizations they act for."
          />
        </div>
      </OrganizationPage>
    </SitePage>
  ),
};
