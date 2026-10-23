import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementTop, OrganizationPage, PageAlert, TeamTab } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · invite-refused — two invitations refused: one person already has a membership (pending) here,
// and the other is public sector staff, whom only vendors may be (R-3.8). The refusal is the first thing in the Team
// members tab, above the team as organization-edit · team draws it.
const meta: Meta = { title: "organizations/organization-edit/invite-refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const InviteRefused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="team" />
        <TeamTab
          alert={
            <PageAlert testId="organization-invite-refused" variant="danger" role="alert" title="2 invitations were not sent">
              <ul className="og-errors">
                <li>vendor3@example.com: this person is already a member of the organization.</li>
                <li>gov@example.com: only people with a vendor account can be invited.</li>
              </ul>
            </PageAlert>
          }
        />
      </OrganizationPage>
    </SitePage>
  ),
};
