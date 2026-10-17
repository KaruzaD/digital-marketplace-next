import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-request · refused — a vendor who already holds a proposal on the opportunity sends a second one, and the
// service refuses it; no second proposal is created (R-2.2). A refused request leaves nothing behind.
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "proposals/proposal-cwu-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
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
                  "Sent to /api/proposals/code-with-us, sending the opportunity, the proposal text, the additional comments and the individual's details, each exactly as given, for an opportunity the vendor already has a proposal on",
                testId: "proposal-cwu-request-submit-individual",
              },
              { term: "Asked by", value: "The signed-in vendor" },
            ]}
          />
        </Region>
        <Region id="proposal-cwu-request-answer" title="Answer">
          <Details
            items={[
              { term: "Proposal accepted", value: "No", testId: "proposal-cwu-request-accepted" },
              {
                term: "Refusal status",
                value: "Refused (the criteria do not state the status)",
                testId: "proposal-cwu-request-refusal-status",
              },
              {
                term: "Messages, by field",
                value: (
                  <ul className="op-list" data-testid="proposal-cwu-request-refusal-by-field">
                    <li>
                      The field the service reports it against: “You already have a proposal for this opportunity.” (the
                      criteria do not name the field)
                    </li>
                  </ul>
                ),
              },
              {
                term: "Messages, in the service's order",
                value: (
                  <ol className="op-list" data-testid="proposal-cwu-request-refusal-messages">
                    <li>You already have a proposal for this opportunity.</li>
                  </ol>
                ),
              },
              { term: "What changed", value: "Nothing. No second proposal is created." },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
