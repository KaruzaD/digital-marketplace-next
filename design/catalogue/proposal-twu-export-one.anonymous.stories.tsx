import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-export-one · anonymous — the opportunity's author opens the printable copy while the proposal is still
// under review on its resource questions, so the proponent is named only as "Proponent 1" and the organization is
// withheld. Once the proposal reaches the challenge the staff copy names the organization (R-2.5, R-2.37)
const meta: Meta = { title: "proposals/proposal-twu-export-one/anonymous", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Anonymous: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <Actions>
          <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311">
            Back to the proposal
          </Link>
          <Button variant="secondary">Print</Button>
        </Actions>
        <article className="op-regions" aria-labelledby="export-title" data-testid="proposal-export-document">
          <ProposalHead
            eyebrow="Team With Us proposal"
            program="team-with-us"
            status="Under review: resource questions"
            statusTestId={null}
            title={<span id="export-title">Data platform team</span>}
          />
          <Details
            items={[
              { term: "Proponent", value: "Proponent 1", testId: "proposal-proponent-name" },
              { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000311" },
            ]}
          />
          <p className="op-text">The proponent's name is withheld from evaluators until the proposal reaches the challenge.</p>
          <CatalogueNote>
            The Team, Resource questions and Attachments sections follow as in the default story, with the organization
            withheld. They are trimmed here.
          </CatalogueNote>
        </article>
      </ProposalPage>
    </SitePage>
  ),
};
