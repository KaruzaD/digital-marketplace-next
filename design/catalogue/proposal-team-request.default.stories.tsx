import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-team-request · default — a signed-in vendor makes and submits a Sprint With Us or Team With Us proposal in one
// request, its team given by account, and the service accepts it (R-2.17, R-2.18).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "proposals/proposal-team-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <ProposalPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>A team proposal, by request</PageTitle>
        </div>
        <Region id="proposal-team-request-requests" title="Request">
          <Details
            items={[
              {
                term: "Submit a team proposal",
                value:
                  "Sent to /api/proposals/<program>, program being sprint-with-us or team-with-us. For Team With Us: the opportunity, the organization, the team as member, resource and hourly rate, and an answer to each resource question by order. For Sprint With Us: the opportunity, the organization, each phase given with its members, scrum master and proposed cost, an answer to each team question by order, and any references. Sent as a submission rather than a draft.",
                testId: "proposal-team-request-submit",
              },
              { term: "Asked by", value: "The signed-in vendor, for an organization they may submit for" },
            ]}
          />
        </Region>
        <Region id="proposal-team-request-answer" title="Answer">
          <Details
            items={[
              { term: "Proposal accepted", value: "Yes: the service answers with the new proposal", testId: "proposal-team-request-accepted" },
              { term: "Proposal", value: "The new proposal's identifier, for its edit and view pages", testId: "proposal-team-request-proposal-id" },
              { term: "Status", value: "Submitted", testId: "proposal-team-request-status" },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
