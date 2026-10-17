import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · team-scenario-tab — the proposal was screened in to the team scenario. Entering the last team
// scenario score also calculates every proposal's price score and makes this one fully evaluated (R-2.28, R-2.30)
const meta: Meta = { title: "proposals/proposal-swu-view/team-scenario-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const TeamScenarioTab: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Under review: team scenario"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Team questions", value: "82.50%", testId: "proposal-questions-score" },
              { term: "Code challenge", value: "90%", testId: "proposal-challenge-score" },
              { term: "Team scenario", value: "Not yet scored", testId: "proposal-scenario-score" },
              { term: "Price", value: "Not yet calculated", testId: "proposal-price-score" },
              { term: "Total", value: "Not yet calculated", testId: "proposal-total-score" },
              {
                term: "Rank",
                value: (
                  <>
                    <span data-testid="proposal-rank" />
                    Not yet ranked
                  </>
                ),
              },
            ]}
          />
        </Region>
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <ProposalTabs
          base={base}
          current="team-scenario"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Team scenario">
          <p className="op-text">
            This opportunity is at the team scenario stage. When the last team scenario score is entered, each proposal's
            price score is calculated.
          </p>
          <Details items={[{ term: "Team scenario score", value: "Not yet scored" }]} />
          <div data-testid="proposal-score-actions">
            <Button variant="primary" data-testid="proposal-score-team-scenario">Enter team scenario score</Button>
          </div>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
