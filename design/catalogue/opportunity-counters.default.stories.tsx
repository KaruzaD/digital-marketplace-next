import type { Meta, StoryObj } from "@storybook/react-vite";
import { ADMIN, Details, OpportunityPage, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-counters · default — an administrator reads how many times an opportunity's public page has been
// opened (R-1.6). An opportunity never opened has no counter and reads as 0.
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "opportunities/opportunity-counters/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
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
              { term: "Asked by", value: "An administrator or public sector staff" },
            ]}
          />
        </Region>
        <Region id="opportunity-counters-answer" title="Answer">
          <Details
            items={[
              { term: "Views", value: "Illustrative: 12", testId: "opportunity-counters-view-count" },
              { term: "When there is no counter yet", value: "The answer leaves the counter out, which reads as 0." },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
