import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup } from "@bcgov/design-system-react-components";
import { Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · code-challenge-tab — the proposal reached the code challenge, so the proponent is now named. Staff
// enter its code challenge score here, and screen it in to or out of the team scenario (R-2.28, R-2.37)
const meta: Meta = { title: "proposals/proposal-swu-view/code-challenge-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const CodeChallengeTab: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Under review: code challenge"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Team questions", value: "82.50%", testId: "proposal-questions-score" },
              { term: "Code challenge", value: "Not yet scored", testId: "proposal-challenge-score" },
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
          current="code-challenge"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Code challenge">
          <p className="op-text">This opportunity is at the code challenge stage.</p>
          <Details
            items={[
              { term: "Code challenge score", value: "Not yet scored" },
              { term: "Screened in to the team scenario", value: "No" },
            ]}
          />
          <div data-testid="proposal-score-actions">
            <Button variant="primary" data-testid="proposal-score-code-challenge">Enter code challenge score</Button>
          </div>
          <ButtonGroup ariaLabel="Code challenge actions">
            <Button variant="secondary" data-testid="proposal-screen-in">Screen in to team scenario</Button>
            <Button variant="secondary" data-testid="proposal-screen-out">Screen out from team scenario</Button>
          </ButtonGroup>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
