import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Region } from "./opportunity-kit";
import { ManagementTop, ORG_ID, OrganizationPage, Requirements } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · swu-qualified — every Sprint With Us requirement met: the qualified badge appears beside the
// organization's name, and the tab states when the terms were accepted (R-3.25, R-3.27)
const meta: Meta = { title: "organizations/organization-edit/swu-qualified", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SwuQualified: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="swu-qualification" swu />
        <Region id="tab-heading" title="Sprint With Us qualification">
          <p className="op-text">This organization is qualified to propose on Sprint With Us opportunities.</p>
          <Requirements
            label="Sprint With Us requirements"
            items={[
              { testId: "organization-swu-requirement-two-members", met: true, text: "At least two active team members" },
              { testId: "organization-swu-requirement-all-capabilities", met: true, text: "Active team members between them hold every capability" },
              { testId: "organization-swu-requirement-terms-accepted", met: true, text: "Sprint With Us terms and conditions accepted" },
            ]}
          />
          <Region id="terms-heading" title="Terms and conditions" level={3}>
            <p className="op-text" data-testid="organization-swu-terms-accepted-on">
              Accepted on September 1, 2026 at 10:30 a.m.
            </p>
            <p className="op-text">
              <Link href={`/organizations/${ORG_ID}/sprint-with-us-terms-and-conditions`} data-testid="organization-view-swu-terms-link">
                Read the Sprint With Us terms and conditions
              </Link>
            </p>
          </Region>
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
