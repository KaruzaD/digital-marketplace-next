import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Text } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import { AlertTitle, CatalogueNote, Focused, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-edit · submit-refused — a withdrawn proposal the vendor tried to submit again after the deadline. The
// service refuses it and it stays withdrawn. A submission refused because the organization is not qualified or lacks a
// service area appears in the same place (R-2.15, R-2.17, R-2.23)
const meta: Meta = { title: "proposals/proposal-twu-edit/submit-refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SubmitRefused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead eyebrow="Manage a Team With Us proposal" program="team-with-us" status="Withdrawn" title="Data platform team" />
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="primary" data-testid="proposal-submit">Submit proposal</Button>
        </ProposalActions>
        <Focused testId="proposal-submit-refused-message">
          <InlineAlert variant="danger" role="alert">
            <AlertTitle>Your proposal was not submitted</AlertTitle>
            <Text elementType="p">This opportunity is no longer accepting proposals.</Text>
          </InlineAlert>
        </Focused>
        <CatalogueNote>The rest of the page is as in the default story and is trimmed here.</CatalogueNote>
      </ProposalPage>
    </SitePage>
  ),
};
