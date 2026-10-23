import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · default — an administrator on a closed opportunity in individual evaluation: the summary with
// its reporting counts, every stage tab, and Edit and Cancel opportunity offered (R-1.28, R-1.29, R-1.30, R-1.56, R-5.34)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/default", parameters: { viewport: { options: WIDTHS } } };
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

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Team questions: individual evaluation"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
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
        <Region id="tab-heading" title="Summary">
          <Details
            items={[
              { term: "Proposal deadline", value: "September 11, 2026 at 4:00 p.m. Pacific time" },
              { term: "Total maximum budget", value: "$1,200,000" },
              { term: "Published", value: "August 14, 2026" },
              { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
              { term: "Last changed by", value: "Test Administrator", testId: "opportunity-last-changed-by" },
            ]}
          />
          <Region id="reporting-heading" title="Reporting" level={3}>
            <Details
              items={[
                { term: "Views", value: "518", testId: "reporting-views" },
                { term: "Watchers", value: "21", testId: "reporting-watchers" },
                { term: "Proposals submitted", value: "6", testId: "reporting-proposals" },
              ]}
            />
          </Region>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
