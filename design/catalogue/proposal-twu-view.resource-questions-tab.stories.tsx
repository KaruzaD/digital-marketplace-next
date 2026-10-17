import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup } from "@bcgov/design-system-react-components";
import { DataTable, Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · resource-questions-tab — the proposal's responses to the resource questions. Staff may enter the
// resource question scores here, and screen the proposal in to or out of the challenge. Finalizing the panel's agreed
// scores moves the top proposals meeting every minimum on by itself (R-2.7, R-2.28, R-2.29)
const meta: Meta = {
  title: "proposals/proposal-twu-view/resource-questions-tab",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

export const ResourceQuestionsTab: StoryObj = {
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
          current="resource-questions"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "resource-questions", label: "Resource questions", query: "resourceQuestions" },
            { key: "challenge", label: "Challenge" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Resource questions">
          <p className="op-text">
            This opportunity is at the resource questions stage. Only proposals meeting every question's minimum score can move
            on to the challenge.
          </p>
          <DataTable captionId="questions-caption" caption="Responses and scores" columns={["Question", "Response", "Score"]}>
            <tr>
              <td>1. Describe your experience building data pipelines for health data.</td>
              <td>Our team has built and run the ingestion pipelines for two provincial registries.</td>
              <td>Not yet scored</td>
            </tr>
          </DataTable>
          <div data-testid="proposal-score-actions">
            <Button variant="primary" data-testid="proposal-score-resource-questions">Enter resource question scores</Button>
          </div>
          <ButtonGroup ariaLabel="Resource question actions">
            <Button variant="secondary" data-testid="proposal-screen-in">Screen in to challenge</Button>
            <Button variant="secondary" data-testid="proposal-screen-out">Screen out from challenge</Button>
          </ButtonGroup>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
