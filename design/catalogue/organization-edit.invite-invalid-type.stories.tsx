import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · invite-invalid-type — the service refused an invitation that named a membership type other
// than member or owner. The screen itself only ever sends "member", so this is how the refusal is shown when a
// request carries another type (R-3.17). The refusal is the first thing in the Team members tab.
const meta: Meta = { title: "organizations/organization-edit/invite-invalid-type", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const InviteInvalidType: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab
          alert={
            <div data-testid="organization-invalid-membership-type-error">
              <InlineAlert
                variant="danger"
                role="alert"
                title="The invitation was not sent: invalid membership type"
                description="An invitation can only be for a member or an owner. Administrator rights are given after the person has joined."
              />
            </div>
          }
        />
      </OrganizationPage>
    </SitePage>
  ),
};
