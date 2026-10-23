import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, DataTable, Details, OpportunityHead, OpportunityPage, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · history-tab — every change of state and every event, including a private note the service
// accepted by request; no screen offers a way to add one (R-1.4, R-1.30, R-1.32, R-1.33)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit";

// The Evaluation panel tab's address (?tab=evaluationPanel) differs from its test ID's suffix, so the tabs are written
// in ManageTabs' markup here rather than with ManageTabs.
const tabs = [
  { tab: "summary", testId: "opportunity-tab-summary", label: "Summary" },
  { tab: "opportunity", testId: "opportunity-tab-opportunity", label: "Opportunity" },
  { tab: "addenda", testId: "opportunity-tab-addenda", label: "Addenda" },
  { tab: "history", testId: "opportunity-tab-history", label: "History" },
  { tab: "evaluationPanel", testId: "opportunity-tab-evaluation-panel", label: "Evaluation panel" },
];

const history = [
  { when: "September 21, 2026, 10:00 a.m.", entry: "Note", by: "Test Public Servant", note: "Confirmed the budget with the finance office. Attachment: budget-approval.pdf" },
  { when: "September 20, 2026, 9:12 a.m.", entry: "Addendum added", by: "Test Public Servant", note: "" },
  { when: "September 12, 2026, 2:40 p.m.", entry: "Edited", by: "Test Administrator", note: "" },
  { when: "September 10, 2026, 11:05 a.m.", entry: "Published", by: "Test Administrator", note: "" },
  { when: "September 8, 2026, 3:30 p.m.", entry: "Submitted for review", by: "Test Public Servant", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Published"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.tab}>
                <Link href={`${base}?tab=${t.tab}`} aria-current={t.tab === "history" ? "page" : undefined} data-testid={t.testId}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Region id="tab-heading" title="History" testId="opportunity-history-section">
          <DataTable
            captionId="history-caption"
            caption="Every change of state and every event, newest first"
            columns={["Date", "Entry", "By", "Note"]}
          >
            {history.map((h) => (
              <tr key={h.when}>
                <td>{h.when}</td>
                <td>{h.entry}</td>
                <td>{h.by}</td>
                <td>{h.note}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
