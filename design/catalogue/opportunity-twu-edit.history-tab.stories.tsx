import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, DataTable, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · history-tab — every change of state and every event. Team With Us offers no private note, so
// there is no note form here (R-1.4, R-1.30, R-1.32, R-1.33; see DESIGN.md, gaps)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

const history = [
  { when: "September 20, 2026, 9:12 a.m.", entry: "Addendum added", by: "Test Public Servant" },
  { when: "September 12, 2026, 2:40 p.m.", entry: "Edited", by: "Test Administrator" },
  { when: "September 10, 2026, 11:05 a.m.", entry: "Published", by: "Test Administrator" },
  { when: "September 8, 2026, 3:30 p.m.", entry: "Submitted for review", by: "Test Public Servant" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Published"
          title="Data platform team"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        {/* Written out rather than with ManageTabs: the Evaluation panel tab's address (?tab=evaluationPanel) differs
            from its test ID (opportunity-tab-evaluation-panel). */}
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            <li><Link href={`${base}?tab=summary`} data-testid="opportunity-tab-summary">Summary</Link></li>
            <li><Link href={`${base}?tab=opportunity`} data-testid="opportunity-tab-opportunity">Opportunity</Link></li>
            <li><Link href={`${base}?tab=addenda`} data-testid="opportunity-tab-addenda">Addenda</Link></li>
            <li><Link href={`${base}?tab=history`} aria-current="page" data-testid="opportunity-tab-history">History</Link></li>
            <li><Link href={`${base}?tab=evaluationPanel`} data-testid="opportunity-tab-evaluation-panel">Evaluation panel</Link></li>
          </ul>
        </nav>
        <Region id="tab-heading" title="History" testId="opportunity-history-section">
          <DataTable
            captionId="history-caption"
            caption="Every change of state and every event, newest first"
            columns={["Date", "Entry", "By"]}
          >
            {history.map((h) => (
              <tr key={h.when}>
                <td>{h.when}</td>
                <td>{h.entry}</td>
                <td>{h.by}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
