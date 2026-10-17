import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup } from "@bcgov/design-system-react-components";
import { ORG_NAME, TermsPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-twu-terms · default — the owner reading the Team With Us terms for an organization that has not
// accepted them, with Accept offered (R-3.26, R-3.27)
const meta: Meta = { title: "organizations/organization-twu-terms/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <TermsPage program="Team With Us">
        <div className="og-body">
          <p className="op-text">By accepting, you agree to these terms on behalf of {ORG_NAME}. They are accepted once for the organization.</p>
          <ButtonGroup ariaLabel="Terms actions">
            <Button variant="primary" data-testid="organization-accept-terms-button">
              Accept terms and conditions
            </Button>
            <Button variant="secondary" data-testid="organization-terms-cancel">
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      </TermsPage>
    </SitePage>
  ),
};
