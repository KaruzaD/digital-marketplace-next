import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import { Region } from "./opportunity-kit";
import { ManagementTop, ORG_ID, OrganizationPage, Requirements } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · twu-qualification — the owner on the Team With Us qualification tab: approved for one service
// area, terms not yet accepted, so not qualified; the owner is shown the approved areas and offered no way to change
// them (R-3.26, R-3.28)
// Service area names are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "organizations/organization-edit/twu-qualification", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TwuQualification: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="twu-qualification" />
        <Region id="tab-heading" title="Team With Us qualification">
          <div data-testid="organization-not-qualified-notice">
            <InlineAlert
              variant="info"
              title="This organization is not qualified for Team With Us"
              description="It can propose on Team With Us opportunities once every requirement below is met."
            />
          </div>
          <Requirements
            label="Team With Us requirements"
            items={[
              { testId: "organization-twu-requirement-service-area", met: true, text: "Approved for at least one service area" },
              { testId: "organization-twu-requirement-terms-accepted", met: false, text: "Team With Us terms and conditions accepted" },
            ]}
          />
          <Region id="areas-heading" title="Approved service areas" level={3}>
            <p className="op-text">Only an administrator can change which service areas an organization is approved for.</p>
            <ul className="op-list">
              <li data-testid="organization-service-area">Full stack developer</li>
            </ul>
          </Region>
          <Region id="terms-heading" title="Terms and conditions" level={3}>
            <p className="op-text">The Team With Us terms and conditions have not been accepted for this organization.</p>
            <p className="op-text">
              <Link href={`/organizations/${ORG_ID}/team-with-us-terms-and-conditions`} data-testid="organization-view-twu-terms-link">
                Read and accept the Team With Us terms and conditions
              </Link>
            </p>
          </Region>
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
