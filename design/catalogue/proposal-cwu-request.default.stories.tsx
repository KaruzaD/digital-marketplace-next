import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-request · default — a signed-in vendor makes and submits a Code With Us proposal in one request, and the
// service accepts it. The proponent is an organization or an individual, each exactly as given (R-2.1, R-2.2).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "proposals/proposal-cwu-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <ProposalPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>A Code With Us proposal, by request</PageTitle>
        </div>
        <Region id="proposal-cwu-request-requests" title="Requests">
          <Details
            items={[
              {
                term: "Submit with an organization as proponent",
                value:
                  "Sent to /api/proposals/code-with-us, sending the opportunity, the organization, the proposal text and the additional comments, as a submission rather than a draft",
                testId: "proposal-cwu-request-submit-organization",
              },
              {
                term: "Submit with an individual as proponent",
                value:
                  "Sent to /api/proposals/code-with-us, sending the opportunity, the proposal text, the additional comments and the individual's legal name, email address, phone, street address, second address line, city, province, postal code and country, each exactly as given, as a submission rather than a draft",
                testId: "proposal-cwu-request-submit-individual",
              },
              { term: "Asked by", value: "The signed-in vendor" },
            ]}
          />
        </Region>
        <Region id="proposal-cwu-request-answer" title="Answer">
          <Details
            items={[
              { term: "Proposal accepted", value: "Yes: the service answers with the new proposal", testId: "proposal-cwu-request-accepted" },
              { term: "Proposal", value: "The new proposal's identifier, for its edit and view pages", testId: "proposal-cwu-request-proposal-id" },
              { term: "Status", value: "Submitted", testId: "proposal-cwu-request-status" },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
