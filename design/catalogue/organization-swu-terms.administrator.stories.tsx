import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Actions } from "./opportunity-kit";
import { ORG_NAME, TermsPage } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-swu-terms · administrator — a service administrator reading the terms of an organization that has not
// accepted them: they are not offered Accept, because acceptance is the organization's own act (R-3.27)
const meta: Meta = { title: "organizations/organization-swu-terms/administrator", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Administrator: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <TermsPage
        program="Sprint With Us"
        notice={<p className="op-text">{ORG_NAME} has not accepted these terms. Only the organization’s own people can accept them.</p>}
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
