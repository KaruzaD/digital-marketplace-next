import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · team-scenario-refused — starting the team scenario was refused because a proponent in the
// code challenge is neither scored nor disqualified (R-1.42)
const meta: Meta = {
  title: "opportunities/opportunity-swu-edit/team-scenario-refused",
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

export const TeamScenarioRefused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Code challenge"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="start-team-scenario-button">Start team scenario</Button>
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
            title="The team scenario could not be started"
            description="All proponents must be scored first. Score or disqualify every proponent in the code challenge, and at least one must remain screened in."
            role="alert"
          />
        </div>
        <Region id="tab-heading" title="Summary">
          <p className="op-text">
            The team scenario can start once every proponent in the code challenge has been scored or disqualified and at least
            one remains screened in.
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
