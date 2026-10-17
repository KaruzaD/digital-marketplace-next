import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · default — an administrator on a closed opportunity in individual evaluation: the summary with
// its reporting counts, every stage tab, and Edit and Cancel opportunity offered (R-1.28, R-1.29, R-1.30, R-1.56, R-5.34)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Resource questions: individual evaluation"
          title="Data platform team"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
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
        <Region id="tab-heading" title="Summary">
          <Details
            items={[
              { term: "Proposal deadline", value: "September 11, 2026 at 4:00 p.m. Pacific time" },
              { term: "Maximum budget", value: "$900,000" },
              { term: "Published", value: "August 14, 2026" },
              { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
              { term: "Last changed by", value: "Test Administrator", testId: "opportunity-last-changed-by" },
            ]}
          />
          <Region id="reporting-heading" title="Reporting" level={3}>
            <Details
              items={[
                { term: "Views", value: "276", testId: "reporting-views" },
                { term: "Watchers", value: "9", testId: "reporting-watchers" },
                { term: "Proposals submitted", value: "4", testId: "reporting-proposals" },
              ]}
            />
          </Region>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
