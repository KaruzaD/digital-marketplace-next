import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { DataTable, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · history-tab — the vendor reads the history of a proposal they wrote: every change of state and
// every score, newest first, with who made it and any note. The proposal has been passed over, so its scores may be
// shown (R-2.9, R-2.32, R-2.35)
const meta: Meta = { title: "proposals/proposal-swu-edit/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const history = [
  { when: "November 10, 2026, 4:05 p.m.", entry: "Not awarded", by: "Test Administrator", note: "" },
  { when: "November 3, 2026, 3:10 p.m.", entry: "Price score calculated: 95.65%", by: "System", note: "" },
  { when: "November 3, 2026, 3:10 p.m.", entry: "Team scenario score entered: 79%", by: "Test Public Servant", note: "" },
  { when: "October 27, 2026, 1:45 p.m.", entry: "Code challenge score entered: 81%", by: "Test Public Servant", note: "" },
  { when: "October 22, 2026, 9:30 a.m.", entry: "Under review: code challenge", by: "Test Public Servant", note: "Consensus scores finalized." },
  { when: "October 16, 2026, 4:00 p.m.", entry: "Under review: team questions", by: "System", note: "The opportunity closed." },
  { when: "October 10, 2026, 2:12 p.m.", entry: "Submitted", by: "Test Vendor", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Sprint With Us proposal"
          program="sprint-with-us"
          status="Not awarded"
          title="Modernize the licence renewal service"
        />
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <ProposalTabs
          base={`${base}/edit`}
          current="history"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "scoresheet", label: "Scoresheet" },
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
