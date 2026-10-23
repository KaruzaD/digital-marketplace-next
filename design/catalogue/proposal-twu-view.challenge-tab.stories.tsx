import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · challenge-tab — the proposal reached the challenge, so the proponent is now named. Staff enter its
// challenge score here. Entering the last challenge score also calculates every proposal's price score (R-2.28, R-2.30,
// R-2.37)
const meta: Meta = { title: "proposals/proposal-twu-view/challenge-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

export const ChallengeTab: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Under review: challenge"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Resource questions", value: "84%", testId: "proposal-questions-score" },
              { term: "Challenge", value: "Not yet scored", testId: "proposal-challenge-score" },
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
          current="challenge"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "resource-questions", label: "Resource questions", query: "resourceQuestions" },
            { key: "challenge", label: "Challenge" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Challenge">
          <p className="op-text">
            This opportunity is at the challenge stage. When the last challenge score is entered, each proposal's price score
            is calculated.
          </p>
          <Details items={[{ term: "Challenge score", value: "Not yet scored" }]} />
          <div data-testid="proposal-score-actions">
            <Button variant="primary" data-testid="proposal-score-challenge">Enter challenge score</Button>
          </div>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
