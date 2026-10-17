import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementTop, OrganizationPage, SaveStatus, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-edit · team-administrator — a service administrator on the Team members tab: they alone may approve
// a pending invitation on the invited person's behalf, and they alone are offered Change owner, because the
// organization has members besides its owner (R-3.9, R-3.11, R-3.12, R-3.13, R-3.14)
// Capability names are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "organizations/organization-edit/team-administrator", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TeamAdministrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab asAdministrator />
        <SaveStatus />
      </OrganizationPage>
    </SitePage>
  ),
};
