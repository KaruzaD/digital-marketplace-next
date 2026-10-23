import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-watch-request · refused — the person who created the opportunity asks to watch it and is refused under
// "opportunity" with the message R-1.5's note gives. A duplicate watch is refused the same way under "conflict"
// (its words are not stated; see DESIGN.md, opportunities gap 27).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "opportunities/opportunity-watch-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF}>
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
              { term: "Asked by", value: "The person who created the opportunity" },
            ]}
          />
        </Region>
        <Region id="opportunity-watch-answer" title="Answer">
          <Details
            items={[
              {
                term: "Outcome",
                value: "Refused (the criteria do not state the status)",
                testId: "opportunity-watch-request-refusal-status",
              },
              { term: "Filed under", value: "opportunity", testId: "opportunity-watch-request-refusal-reason" },
              {
                term: "Messages, in the order given",
                value: (
                  <ol className="op-list" data-testid="opportunity-watch-request-refusal-messages">
                    <li>You cannot subscribe to your own opportunity.</li>
                  </ol>
                ),
              },
              { term: "Watching, as the opportunity reports it", value: "No", testId: "opportunity-watch-request-watching" },
              { term: "What changed", value: "Nothing." },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
