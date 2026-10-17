import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Actions } from "./opportunity-kit";
import { ORG_NAME, TermsPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-swu-terms · accepted — the terms have been accepted for this organization: the date is stated and
// Accept is not offered again (R-3.27)
const meta: Meta = { title: "organizations/organization-swu-terms/accepted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Accepted: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <TermsPage
        program="Sprint With Us"
        notice={
          <p className="op-text" data-testid="organization-terms-accepted-on">
            {ORG_NAME} accepted these terms on September 1, 2026 at 10:30 a.m.
          </p>
        }
      >
        <Actions>
          <Button variant="secondary" data-testid="organization-terms-cancel">
            Back to the organization
          </Button>
        </Actions>
      </TermsPage>
    </SitePage>
  ),
};
