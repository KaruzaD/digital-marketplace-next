import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-history-request · withheld — a reader who is neither the author nor an administrator (a vendor, or
// nobody signed in) reads the opportunity; the answer is the opportunity as usual with no history at all (R-1.33).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "opportunities/opportunity-history-request/withheld",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Withheld: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <OpportunityPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>An opportunity’s history, by request</PageTitle>
        </div>
        <Region id="opportunity-history-request" title="Request">
          <Details
            items={[
              { term: "Read the opportunity", value: "A request to /api/opportunities/code-with-us/:opportunityId" },
              { term: "Asked by", value: "A vendor, or nobody signed in" },
            ]}
          />
        </Region>
        <Region id="opportunity-history-answer" title="Answer">
          <Details
            items={[
              { term: "History included", value: "No", testId: "opportunity-history-request-history-shown" },
              {
                term: "History, newest first",
                value: "None: no note and no attachment is in the answer.",
                testId: "opportunity-history-request-entries",
              },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
