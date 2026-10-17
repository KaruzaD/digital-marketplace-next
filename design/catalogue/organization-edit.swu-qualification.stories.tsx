import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import { Region } from "./opportunity-kit";
import { ManagementTop, ORG_ID, OrganizationPage, Requirements } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · swu-qualification — the owner on the Sprint With Us qualification tab: two active members who
// between them hold every capability, but the terms not yet accepted, so the organization is not qualified (R-3.25)
const meta: Meta = { title: "organizations/organization-edit/swu-qualification", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SwuQualification: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="swu-qualification" />
        <Region id="tab-heading" title="Sprint With Us qualification">
          <div data-testid="organization-not-qualified-notice">
            <InlineAlert
              variant="info"
              title="This organization is not qualified for Sprint With Us"
              description="It can propose on Sprint With Us opportunities once every requirement below is met."
            />
          </div>
          <Requirements
            label="Sprint With Us requirements"
            items={[
              { testId: "organization-swu-requirement-two-members", met: true, text: "At least two active team members" },
              { testId: "organization-swu-requirement-all-capabilities", met: true, text: "Active team members between them hold every capability" },
              { testId: "organization-swu-requirement-terms-accepted", met: false, text: "Sprint With Us terms and conditions accepted" },
            ]}
          />
          <p className="op-text">Invited people who have not yet accepted do not count towards team size or capabilities.</p>
          <Region id="terms-heading" title="Terms and conditions" level={3}>
            <p className="op-text">The Sprint With Us terms and conditions have not been accepted for this organization.</p>
            <p className="op-text">
              <Link href={`/organizations/${ORG_ID}/sprint-with-us-terms-and-conditions`} data-testid="organization-view-swu-terms-link">
                Read and accept the Sprint With Us terms and conditions
              </Link>
            </p>
          </Region>
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
