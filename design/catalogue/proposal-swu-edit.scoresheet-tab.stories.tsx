import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · scoresheet-tab — the opportunity was awarded to another proponent, so this proposal is not
// awarded and the Scoresheet tab appears: each stage's score, the price score, the weighted total, the rank, and the
// anonymous name evaluators saw (R-2.5, R-2.30, R-2.31, R-2.32, R-2.33)
const meta: Meta = { title: "proposals/proposal-swu-edit/scoresheet-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const ScoresheetTab: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Sprint With Us proposal"
          program="sprint-with-us"
          status="Not awarded"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000211", testId: "proposal-identifier" },
            { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" },
          ]}
        />
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <ProposalTabs
          base={`${base}/edit`}
          current="scoresheet"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "scoresheet", label: "Scoresheet" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Scoresheet">
          <p className="op-text">
            During evaluation, evaluators saw this proposal as <span data-testid="proposal-anonymous-name">Proponent 2</span>.
          </p>
          <Details
            items={[
              { term: "Team questions", value: "76.50%" },
              { term: "Code challenge", value: "81%" },
              { term: "Team scenario", value: "79%" },
              { term: "Price", value: "95.65%" },
              { term: "Total", value: "82.14%", testId: "proposal-total-score" },
              { term: "Rank", value: "2 of 3", testId: "proposal-rank" },
            ]}
          />
          <p className="op-note">
            The total combines each stage's score in the proportions the opportunity states. The price score is this
            proposal's share of the lowest bid still in contention.
          </p>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
