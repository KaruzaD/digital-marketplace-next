import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, ManageTabs, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · under-review — an administrator on an opportunity under review: Edit, Publish and Delete are
// offered (R-1.20, R-1.22, R-1.30, R-1.53)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/under-review", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit";

export const UnderReview: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Under review"
          title="Build an accessible permit tracker"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="primary" data-testid="opportunity-publish">Publish</Button>
          <Button variant="secondary" danger data-testid="opportunity-delete-button">Delete</Button>
        </ActionBar>
        <ManageTabs
          base={base}
          current="summary"
          tabs={[
            { key: "summary", label: "Summary" },
            { key: "opportunity", label: "Opportunity" },
            { key: "addenda", label: "Addenda" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Summary">
          <Details
            items={[
              { term: "Proposal deadline", value: "October 2, 2026 at 4:00 p.m. Pacific time" },
              { term: "Reward", value: "$45,000" },
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
