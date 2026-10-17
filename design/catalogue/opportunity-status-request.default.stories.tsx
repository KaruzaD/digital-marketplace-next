import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, Details, OpportunityPage, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-status-request · default — an administrator asks for a change on the program's permitted path (here a
// draft to published) and the service accepts it; the stored status is read afresh afterwards (R-1.20).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "opportunities/opportunity-status-request/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = {
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
                value: "An update to /api/opportunities/sprint-with-us/:opportunityId sending the operation that leads to PUBLISHED",
                testId: "opportunity-status-request-change",
              },
              { term: "Asked by", value: "An administrator" },
            ]}
          />
        </Region>
        <Region id="opportunity-status-answer" title="Answer">
          <Details
            items={[
              { term: "Outcome", value: "Accepted: the opportunity is returned", testId: "opportunity-status-request-accepted" },
              { term: "Status, read afresh afterwards", value: "PUBLISHED", testId: "opportunity-status-request-stored-status" },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
