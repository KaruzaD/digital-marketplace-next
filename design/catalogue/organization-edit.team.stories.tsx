import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementTop, OrganizationPage, SaveStatus, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · team — the owner on the Team members tab: one invitation still pending, which does not count
// towards team size or capabilities; administrator rights can be given or withdrawn on any active member but the
// owner and oneself (R-3.7, R-3.10, R-3.11, R-3.12, R-3.14, R-3.34)
// Capability names are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "organizations/organization-edit/team", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Team: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab />
        <SaveStatus />
      </OrganizationPage>
    </SitePage>
  ),
};
