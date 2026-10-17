import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, OpportunityPage, PageTitle, Region, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-history-request · default — the opportunity's author or an administrator adds a private note, with a
// file, by request; the service accepts it, and reading the opportunity back carries the history with the note (R-1.33).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "opportunities/opportunity-history-request/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF}>
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
                value:
                  "An update to /api/opportunities/code-with-us/:opportunityId asking to add a note of up to 1,000 characters, with the identifiers of stored files to attach",
                testId: "opportunity-history-request-add-note",
              },
              { term: "Asked by", value: "The opportunity’s author or an administrator" },
            ]}
          />
        </Region>
        <Region id="opportunity-history-answer" title="Answer">
          <Details
            items={[
              { term: "Outcome", value: "Accepted: the opportunity is returned", testId: "opportunity-history-request-accepted" },
              { term: "History included", value: "Yes", testId: "opportunity-history-request-history-shown" },
              {
                term: "History, newest first",
                value: (
                  <ol className="op-list" data-testid="opportunity-history-request-entries">
                    <li>
                      NOTE_ADDED · “Confirmed the budget with the finance office.” · Test Public Servant · September 21,
                      2026, 10:00 a.m. · budget-approval.pdf (illustrative record)
                    </li>
                    <li>Published · Test Administrator · September 10, 2026, 11:05 a.m.</li>
                    <li>Draft · Test Public Servant · September 8, 2026, 3:30 p.m.</li>
                  </ol>
                ),
              },
            ]}
          />
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
