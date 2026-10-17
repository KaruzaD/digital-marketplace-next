import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { DataTable, Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · team-questions-tab — the proposal's responses to the team questions, each with the consensus
// score the evaluation panel agreed. The panel's agreed scores are finalized on the opportunity's Consensus tab, which
// the evaluation domain designs; only proposals meeting every question's minimum score move on (R-2.21, R-2.29)
const meta: Meta = { title: "proposals/proposal-swu-view/team-questions-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const responses = [
  {
    question: "1. Describe how your team would approach user research for the renewal service.",
    response: "We would start with the renewal staff and the ten most common reasons a renewal is returned.",
    score: "17 of 20",
  },
  {
    question: "2. Describe a time your team replaced a legacy system without interrupting service.",
    response: "We moved a permit service to a new platform in stages, running both side by side for six weeks.",
    score: "16 of 20",
  },
];

export const TeamQuestionsTab: StoryObj = {
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
          current="team-questions"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Team questions">
          <p className="op-text">
            Question scores are agreed by the evaluation panel on the opportunity's{" "}
            <Link href="/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit?tab=consensus">Consensus tab</Link>. Only
            proposals meeting every question's minimum score move on to the code challenge.
          </p>
          <DataTable captionId="questions-caption" caption="Responses and consensus scores" columns={["Question", "Response", "Score"]}>
            {responses.map((r) => (
              <tr key={r.question}>
                <td>{r.question}</td>
                <td>{r.response}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
