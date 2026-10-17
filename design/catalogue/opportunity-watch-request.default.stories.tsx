import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-watch-request · default — a signed-in person asks to watch an opportunity somebody else created and
// the service accepts; asking to stop watching is the same request in reverse (R-1.5).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "opportunities/opportunity-watch-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <OpportunityPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>Watch an opportunity, by request</PageTitle>
        </div>
        <Region id="opportunity-watch-request" title="Request">
          <Details
            items={[
              {
                term: "Watch an opportunity",
                value: "A request to /api/subscribers/code-with-us asking to watch, naming the opportunity’s identifier",
                testId: "opportunity-watch-request-watch",
              },
              {
                term: "Stop watching an opportunity",
                value: "A request to /api/subscribers/code-with-us asking to stop watching, naming the opportunity’s identifier",
                testId: "opportunity-watch-request-stop",
              },
              { term: "Asked by", value: "A signed-in person who did not create the opportunity" },
            ]}
          />
        </Region>
        <Region id="opportunity-watch-answer" title="Answer">
          <Details
            items={[
              { term: "Outcome", value: "Accepted: the subscription is returned", testId: "opportunity-watch-request-accepted" },
              { term: "Watching, as the opportunity reports it", value: "Yes", testId: "opportunity-watch-request-watching" },
              {
                term: "What changed",
                value: "The person now watches the opportunity and is told of its addenda and cancellation.",
              },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
