import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-counters · refused — a vendor, or a request with no session, asks for an opportunity's view count and is
// refused as not permitted.
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "opportunities/opportunity-counters/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <OpportunityPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>An opportunity’s view count, by request</PageTitle>
        </div>
        <Region id="opportunity-counters-request" title="Request">
          <Details
            items={[
              {
                term: "Read the view count",
                value: "/api/counters?counters=opportunity.code-with-us.<opportunity identifier>.views",
              },
              { term: "Asked by", value: "A vendor, or a request with no session" },
            ]}
          />
        </Region>
        <Region id="opportunity-counters-answer" title="Answer">
          <Details
            items={[
              { term: "Outcome", value: "Refused: not permitted", testId: "opportunity-counters-refused" },
              { term: "What changed", value: "Nothing. No count is given." },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
