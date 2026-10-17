import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Details, ManageTabs, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · default — an administrator on a closed opportunity: the summary with its reporting counts,
// and Edit and Cancel opportunity offered (R-1.28, R-1.29, R-1.30, R-1.31, R-1.56)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit";

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Evaluation"
          title="Build an accessible permit tracker"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <ManageTabs
          base={base}
          current="summary"
          tabs={[
            { key: "summary", label: "Summary" },
            { key: "opportunity", label: "Opportunity" },
            { key: "addenda", label: "Addenda" },
            { key: "history", label: "History" },
            { key: "proposals", label: "Proposals" },
          ]}
        />
        <Region id="tab-heading" title="Summary">
          <Details
            items={[
              { term: "Proposal deadline", value: "September 11, 2026 at 4:00 p.m. Pacific time" },
              { term: "Reward", value: "$45,000" },
              { term: "Published", value: "August 14, 2026" },
              { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
              { term: "Last changed by", value: "Test Administrator", testId: "opportunity-last-changed-by" },
            ]}
          />
          <Region id="reporting-heading" title="Reporting" level={3}>
            <Details
              items={[
                { term: "Views", value: "342", testId: "reporting-views" },
                { term: "Watchers", value: "12", testId: "reporting-watchers" },
                { term: "Proposals submitted", value: "5", testId: "reporting-proposals" },
              ]}
            />
          </Region>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
