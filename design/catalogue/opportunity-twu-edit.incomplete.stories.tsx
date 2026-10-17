import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { ActionBar, Details, OpportunityHead, OpportunityPage, Region, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · incomplete — the author submitted an incomplete draft for review and is told it is
// incomplete, not which field is missing (R-1.21)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/incomplete", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

export const Incomplete: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Draft"
          title="Data platform team"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="opportunity-submit-for-review">Submit for review</Button>
          <Button variant="secondary" danger data-testid="opportunity-delete-button">Delete</Button>
        </ActionBar>
        {/* Written out rather than with ManageTabs: the Evaluation panel tab's address (?tab=evaluationPanel) differs
            from its test ID (opportunity-tab-evaluation-panel). */}
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            <li><Link href={`${base}?tab=summary`} aria-current="page" data-testid="opportunity-tab-summary">Summary</Link></li>
            <li><Link href={`${base}?tab=opportunity`} data-testid="opportunity-tab-opportunity">Opportunity</Link></li>
            <li><Link href={`${base}?tab=history`} data-testid="opportunity-tab-history">History</Link></li>
            <li><Link href={`${base}?tab=evaluationPanel`} data-testid="opportunity-tab-evaluation-panel">Evaluation panel</Link></li>
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
              { term: "Proposal deadline", value: "October 2, 2026 at 4:00 p.m. Pacific time" },
              { term: "Maximum budget", value: "Not entered" },
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
