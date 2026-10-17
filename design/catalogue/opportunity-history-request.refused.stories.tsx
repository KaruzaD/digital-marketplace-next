import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-history-request · refused — somebody who is neither the author nor an administrator asks to add a note,
// and the service refuses it; the history is unchanged (R-1.33). The refusal's status and words are not stated in the
// criteria (see DESIGN.md, opportunities gap 28).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "opportunities/opportunity-history-request/refused",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Refused: StoryObj = {
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
              {
                term: "Add a note",
                value: "An update to /api/opportunities/code-with-us/:opportunityId asking to add a note",
                testId: "opportunity-history-request-add-note",
              },
              { term: "Asked by", value: "A vendor" },
            ]}
          />
        </Region>
        <Region id="opportunity-history-answer" title="Answer">
          <Details
            items={[
              {
                term: "Outcome",
                value: "Refused (the criteria do not state the status)",
                testId: "opportunity-history-request-refusal-status",
              },
              {
                term: "Messages, in the order given",
                value: (
                  <ol className="op-list" data-testid="opportunity-history-request-refusal-messages">
                    <li>The service’s permission message (its words are not stated)</li>
                  </ol>
                ),
              },
              { term: "What changed", value: "Nothing: no note is added to the history." },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
