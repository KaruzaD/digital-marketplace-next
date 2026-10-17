import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { DataTable, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-edit · history-tab — the vendor reads the history of a proposal they wrote: every change of state and
// every score, newest first, with who made it and any note. The proposal has been passed over, so its score may be
// shown (R-2.9, R-2.32, R-2.35)
const meta: Meta = { title: "proposals/proposal-cwu-edit/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

const history = [
  { when: "October 9, 2026, 4:05 p.m.", entry: "Not awarded", by: "Test Administrator", note: "" },
  { when: "October 7, 2026, 11:20 a.m.", entry: "Score entered: 78%", by: "Test Public Servant", note: "" },
  { when: "October 7, 2026, 11:20 a.m.", entry: "Evaluated", by: "Test Public Servant", note: "" },
  { when: "October 2, 2026, 4:00 p.m.", entry: "Under review", by: "System", note: "The opportunity closed." },
  { when: "September 15, 2026, 2:12 p.m.", entry: "Submitted", by: "Test Vendor", note: "" },
  { when: "September 12, 2026, 10:30 a.m.", entry: "Draft created", by: "Test Vendor", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Code With Us proposal"
          program="code-with-us"
          status="Not awarded"
          title="Build an accessible permit tracker"
        />
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <ProposalTabs
          base={`${base}/edit`}
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
