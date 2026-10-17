import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · consensus-refused — finalising was refused because no proponent met every minimum score; the
// reason names the Challenge, the stage that actually follows (R-1.41, R-1.50, R-5.10)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/consensus-refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

export const ConsensusRefused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Resource questions: consensus"
          title="Data platform team"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="finalize-consensus-button">Finalize consensus scores</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        {/* Written out rather than with ManageTabs: the Resource questions and Evaluation panel tabs' addresses
            (?tab=resourceQuestions, ?tab=evaluationPanel) differ from their test IDs. */}
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            <li><Link href={`${base}?tab=summary`} aria-current="page" data-testid="opportunity-tab-summary">Summary</Link></li>
            <li><Link href={`${base}?tab=opportunity`} data-testid="opportunity-tab-opportunity">Opportunity</Link></li>
            <li><Link href={`${base}?tab=addenda`} data-testid="opportunity-tab-addenda">Addenda</Link></li>
            <li><Link href={`${base}?tab=history`} data-testid="opportunity-tab-history">History</Link></li>
            <li><Link href={`${base}?tab=proposals`} data-testid="opportunity-tab-proposals">Proposals</Link></li>
            <li><Link href={`${base}?tab=resourceQuestions`} data-testid="opportunity-tab-resource-questions">Resource questions</Link></li>
            <li><Link href={`${base}?tab=challenge`} data-testid="opportunity-tab-challenge">Challenge</Link></li>
            <li><Link href={`${base}?tab=evaluationPanel`} data-testid="opportunity-tab-evaluation-panel">Evaluation panel</Link></li>
            <li><Link href={`${base}?tab=consensus`} data-testid="opportunity-tab-consensus">Consensus</Link></li>
          </ul>
        </nav>
        <div tabIndex={-1} data-testid="advance-refused-message">
          <InlineAlert
            variant="danger"
            title="The consensus scores could not be finalized"
            description="You must have at least one proponent that can be screened into the Challenge."
            role="alert"
          />
        </div>
        <Region id="tab-heading" title="Summary">
          <p className="op-text">
            Finalizing records the agreed scores against each proponent and moves up to three proponents who met every minimum
            score into the challenge. It cannot be undone.
          </p>
          <Details
            items={[
              { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
              { term: "Last changed by", value: "Test Administrator", testId: "opportunity-last-changed-by" },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
