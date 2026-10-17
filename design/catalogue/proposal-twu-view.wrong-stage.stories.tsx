import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert } from "@bcgov/design-system-react-components";
import { Details, Region, STAFF } from "./opportunity-kit";
import { AlertTitle, Focused, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · wrong-stage — a challenge score was sent while the opportunity was still at the resource
// questions stage, and the service refused it. The page offers no challenge score at that stage, and the tab says which
// stage the opportunity is at (R-2.28)
const meta: Meta = { title: "proposals/proposal-twu-view/wrong-stage", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

export const WrongStage: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Under review: resource questions"
          title={<span data-testid="proposal-proponent-name">Proponent 1</span>}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Resource questions", value: "Not yet scored", testId: "proposal-questions-score" },
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
        <Focused testId="proposal-wrong-stage-error">
          <InlineAlert variant="danger" role="alert">
            <AlertTitle>That score was not entered</AlertTitle>
            <p className="op-text">The opportunity is not in the correct stage of evaluation to perform that action.</p>
          </InlineAlert>
        </Focused>
        <Region id="tab-heading" title="Challenge">
          <p className="op-text">
            This opportunity is at the resource questions stage. This proposal can be scored once the opportunity has reached
            the challenge.
          </p>
          <Details items={[{ term: "Challenge score", value: "Not yet scored" }]} />
          <div data-testid="proposal-score-actions" />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
