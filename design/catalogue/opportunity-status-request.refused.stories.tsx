import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, Details, OpportunityPage, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-status-request · refused — an administrator asks to move an awarded opportunity back to published, a
// change off the permitted path; the service refuses it and the stored status is unchanged (R-1.20). The refusal's
// status and words are not stated in the criteria (see DESIGN.md, opportunities gap 28).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "opportunities/opportunity-status-request/refused",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <OpportunityPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>An opportunity status change, by request</PageTitle>
        </div>
        <Region id="opportunity-status-request" title="Request">
          <Details
            items={[
              {
                term: "Change the status",
                value:
                  "An update to /api/opportunities/code-with-us/:opportunityId sending the operation that leads to PUBLISHED, for an opportunity already awarded",
                testId: "opportunity-status-request-change",
              },
              { term: "Asked by", value: "An administrator" },
            ]}
          />
        </Region>
        <Region id="opportunity-status-answer" title="Answer">
          <Details
            items={[
              {
                term: "Outcome",
                value: "Refused (the criteria do not state the status)",
                testId: "opportunity-status-request-refusal-status",
              },
              {
                term: "Messages, in the order given",
                value: (
                  <ol className="op-list" data-testid="opportunity-status-request-refusal-messages">
                    <li>The service’s general permission message (its words are not stated)</li>
                  </ol>
                ),
              },
              { term: "Status, read afresh afterwards", value: "AWARDED", testId: "opportunity-status-request-stored-status" },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
