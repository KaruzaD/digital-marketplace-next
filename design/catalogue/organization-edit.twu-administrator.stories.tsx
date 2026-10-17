import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { Actions, Region } from "./opportunity-kit";
import { ManagementTop, ORG_ID, OrganizationPage, Requirements } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-edit · twu-administrator — a service administrator on the Team With Us qualification tab, the only
// person offered Edit service areas (R-3.26, R-3.28)
// Service area names are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "organizations/organization-edit/twu-administrator", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TwuAdministrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
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
            <ul className="op-list">
              <li data-testid="organization-service-area">Full stack developer</li>
              <li data-testid="organization-service-area">Data professional</li>
            </ul>
            <Actions>
              <Button variant="secondary" data-testid="organization-edit-service-areas-button">
                Edit service areas
              </Button>
            </Actions>
          </Region>
          <Region id="terms-heading" title="Terms and conditions" level={3}>
            <p className="op-text">The Team With Us terms and conditions have not been accepted for this organization.</p>
            <p className="op-text">
              <Link href={`/organizations/${ORG_ID}/team-with-us-terms-and-conditions`} data-testid="organization-view-twu-terms-link">
                Read the Team With Us terms and conditions
              </Link>
            </p>
          </Region>
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
