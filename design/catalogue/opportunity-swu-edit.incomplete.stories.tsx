import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { ActionBar, Details, OpportunityHead, OpportunityPage, Region, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · incomplete — the author submitted an incomplete draft for review and is told it is
// incomplete, not which field is missing (R-1.21)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/incomplete", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit";

// The Evaluation panel tab's address (?tab=evaluationPanel) differs from its test ID's suffix, so the tabs are written
// in ManageTabs' markup here rather than with ManageTabs.
const tabs = [
  { tab: "summary", testId: "opportunity-tab-summary", label: "Summary" },
  { tab: "opportunity", testId: "opportunity-tab-opportunity", label: "Opportunity" },
  { tab: "history", testId: "opportunity-tab-history", label: "History" },
  { tab: "evaluationPanel", testId: "opportunity-tab-evaluation-panel", label: "Evaluation panel" },
];

export const Incomplete: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Draft"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="opportunity-submit-for-review">Submit for review</Button>
          <Button variant="secondary" danger data-testid="opportunity-delete-button">Delete</Button>
        </ActionBar>
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.tab}>
                <Link href={`${base}?tab=${t.tab}`} aria-current={t.tab === "summary" ? "page" : undefined} data-testid={t.testId}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div tabIndex={-1} data-testid="opportunity-incomplete-message">
          <InlineAlert
            variant="danger"
            title="This opportunity is incomplete"
            description="It could not be submitted for review. Edit the opportunity, complete and save the form, and then submit it again."
            role="alert"
          />
        </div>
        <Region id="tab-heading" title="Summary">
          <Details
            items={[
              { term: "Proposal deadline", value: "October 16, 2026 at 4:00 p.m. Pacific time" },
              { term: "Total maximum budget", value: "Not entered" },
              { term: "Published", value: "Not yet published" },
              { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
              { term: "Last changed by", value: "Test Public Servant", testId: "opportunity-last-changed-by" },
            ]}
          />
          <p className="op-note">Views, watchers and proposals are counted once the opportunity is published.</p>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
