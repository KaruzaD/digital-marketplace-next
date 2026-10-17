import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, Details, PageTitle, Region } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-evaluation-request · default — a stage score for one Sprint With Us or Team With Us proposal is sent to the
// service directly, while the opportunity stands at that stage, and the service accepts it (R-2.28).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "proposals/proposal-evaluation-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
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
                value: "Sent to /api/proposals/sprint-with-us/<proposal>, sending a score out of 100 for the team scenario",
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
              { term: "Score accepted", value: "Yes: the service answers with the proposal", testId: "proposal-evaluation-request-accepted" },
              {
                term: "Status",
                value: "The proposal's status as the service answers it (the criteria do not name it)",
                testId: "proposal-evaluation-request-status",
              },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
