import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, Details, PageTitle, Region } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-evaluation-request · refused — a team scenario score is sent for a proposal already carried into the team
// scenario while the Sprint With Us opportunity is still at its code challenge, and the service refuses it (R-2.28).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "proposals/proposal-evaluation-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <ProposalPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>A stage score, by request</PageTitle>
        </div>
        <Region id="proposal-evaluation-request-requests" title="Requests">
          <Details
            items={[
              {
                term: "Score the team scenario",
                value:
                  "Sent to /api/proposals/sprint-with-us/<proposal>, sending a score out of 100 for the team scenario, while the opportunity is still at its code challenge",
                testId: "proposal-evaluation-request-score-team-scenario",
              },
              {
                term: "Score the code challenge",
                value: "Sent to /api/proposals/sprint-with-us/<proposal>, sending a score out of 100 for the code challenge",
                testId: "proposal-evaluation-request-score-code-challenge",
              },
              {
                term: "Score the challenge",
                value: "Sent to /api/proposals/team-with-us/<proposal>, sending a score out of 100 for the challenge",
                testId: "proposal-evaluation-request-score-challenge",
              },
              { term: "Asked by", value: "Whoever is signed in; the administrator may score any stage the opportunity stands at" },
            ]}
          />
        </Region>
        <Region id="proposal-evaluation-request-answer" title="Answer">
          <Details
            items={[
              { term: "Score accepted", value: "No", testId: "proposal-evaluation-request-accepted" },
              {
                term: "Refusal status",
                value: "Refused (the criteria do not state the status)",
                testId: "proposal-evaluation-request-refusal-status",
              },
              {
                term: "Messages, in the service's order",
                value: (
                  <ol className="op-list" data-testid="proposal-evaluation-request-refusal-messages">
                    <li>The opportunity is not in the correct stage of evaluation to perform that action.</li>
                  </ol>
                ),
              },
              { term: "What changed", value: "Nothing. No score is recorded." },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
