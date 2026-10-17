import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Text } from "@bcgov/design-system-react-components";
import { Details, Region, STAFF } from "./opportunity-kit";
import { AlertTitle, Focused, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · wrong-stage — the service refused a team scenario score sent while the opportunity was still at
// the code challenge stage. The page offers no team scenario score at that stage: the tab says which stage the
// opportunity is at and that the proposal can be scored once it reaches the team scenario (R-2.28)
const meta: Meta = { title: "proposals/proposal-swu-view/wrong-stage", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const WrongStage: StoryObj = {
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
          current="team-scenario"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
            { key: "history", label: "History" },
          ]}
        />
        <Focused testId="proposal-wrong-stage-error">
          <InlineAlert variant="danger" role="alert">
            <AlertTitle>That score was not entered</AlertTitle>
            <Text elementType="p">The opportunity is not in the correct stage of evaluation to perform that action.</Text>
          </InlineAlert>
        </Focused>
        <Region id="tab-heading" title="Team scenario">
          <p className="op-text">
            This opportunity is at the code challenge stage. This proposal can be scored once the opportunity has reached the
            team scenario.
          </p>
          <Details items={[{ term: "Team scenario score", value: "Not yet scored" }]} />
          <div data-testid="proposal-score-actions" />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
