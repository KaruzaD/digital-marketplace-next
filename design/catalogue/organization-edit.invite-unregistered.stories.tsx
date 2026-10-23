import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { ManagementTop, OrganizationPage, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · invite-unregistered — an invited address belongs to nobody registered: no pending membership
// is created, the address is emailed an invitation to sign up, and the owner is warned, by address (R-3.30). The
// warning is the first thing in the Team members tab.
const meta: Meta = { title: "organizations/organization-edit/invite-unregistered", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const InviteUnregistered: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab
          alert={
            <div data-testid="organization-invite-unregistered">
              <InlineAlert
                variant="warning"
                role="alert"
                title="newperson@example.com is not registered with the Digital Marketplace"
                description="They have been emailed an invitation to sign up. They are not on your team."
              />
            </div>
          }
        />
      </OrganizationPage>
    </SitePage>
  ),
};
