import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · consensus-refused — finalising was refused because a consensus is still unsubmitted, and the
// reason is named (R-1.41, R-1.50, R-5.13)
const meta: Meta = {
  title: "opportunities/opportunity-swu-edit/consensus-refused",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit";

// The tabs' addresses use the service's tab names (?tab=teamQuestions), which differ from their test IDs' suffixes, so
// they are written in ManageTabs' markup here rather than with ManageTabs.
const tabs = [
  { tab: "summary", testId: "opportunity-tab-summary", label: "Summary" },
  { tab: "opportunity", testId: "opportunity-tab-opportunity", label: "Opportunity" },
  { tab: "addenda", testId: "opportunity-tab-addenda", label: "Addenda" },
  { tab: "history", testId: "opportunity-tab-history", label: "History" },
  { tab: "proposals", testId: "opportunity-tab-proposals", label: "Proposals" },
  { tab: "teamQuestions", testId: "opportunity-tab-team-questions", label: "Team questions" },
  { tab: "codeChallenge", testId: "opportunity-tab-code-challenge", label: "Code challenge" },
  { tab: "teamScenario", testId: "opportunity-tab-team-scenario", label: "Team scenario" },
  { tab: "evaluationPanel", testId: "opportunity-tab-evaluation-panel", label: "Evaluation panel" },
  { tab: "consensus", testId: "opportunity-tab-consensus", label: "Consensus" },
];

export const ConsensusRefused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Team questions: consensus"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="finalize-consensus-button">Finalize consensus scores</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.tab}>
                <Link href={`${base}?tab=${t.tab}`} aria-current={t.tab === "summary" ? "page" : undefined} data-testid={t.testId}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div tabIndex={-1} data-testid="advance-refused-message">
          <InlineAlert
            variant="danger"
            title="The consensus scores could not be finalized"
            description="Not all consensuses have been submitted."
            role="alert"
          />
        </div>
        <Region id="tab-heading" title="Summary">
          <p className="op-text">
            Finalizing records the agreed scores against each proponent and moves up to four proponents who met every minimum
            score into the code challenge. It cannot be undone.
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
