import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { DataTable, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · history-tab — the proposal's history, newest first, with who made each change, when, and any
// note. The score entered is recorded as a percentage (R-2.26, R-2.35)
const meta: Meta = { title: "proposals/proposal-cwu-view/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

const history = [
  { when: "October 7, 2026, 11:20 a.m.", entry: "Score entered: 87%", by: "Test Public Servant", note: "" },
  { when: "October 7, 2026, 11:20 a.m.", entry: "Evaluated", by: "Test Public Servant", note: "" },
  { when: "October 2, 2026, 4:00 p.m.", entry: "Under review", by: "System", note: "The opportunity closed." },
  { when: "September 15, 2026, 2:12 p.m.", entry: "Submitted", by: "Test Vendor", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Code With Us proposal"
          program="code-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Test Vendor</span>}
        />
        <ProposalActions>
          <Button variant="primary" data-testid="proposal-award-button">Award</Button>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <ProposalTabs
          base={base}
          current="history"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="History">
          <DataTable
            captionId="history-caption"
            caption="Every change of state and every score entered, newest first"
            columns={["Date", "Entry", "By", "Note"]}
            testId="proposal-history-table"
          >
            {history.map((h) => (
              <tr key={`${h.when}-${h.entry}`}>
                <td>{h.when}</td>
                <td>{h.entry}</td>
                <td>{h.by}</td>
                <td>{h.note}</td>
              </tr>
            ))}
          </DataTable>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
