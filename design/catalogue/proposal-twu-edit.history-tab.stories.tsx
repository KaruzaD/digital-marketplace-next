import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { DataTable, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-edit · history-tab — the vendor reads the history of a proposal they wrote: every change of state and
// every score, newest first, with who made it and any note. The proposal has been awarded, so its scores may be shown
// (R-2.9, R-2.32, R-2.35)
const meta: Meta = { title: "proposals/proposal-twu-edit/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

const history = [
  { when: "October 27, 2026, 4:05 p.m.", entry: "Awarded", by: "Test Administrator", note: "" },
  { when: "October 20, 2026, 3:10 p.m.", entry: "Price score calculated: 100%", by: "System", note: "" },
  { when: "October 20, 2026, 3:10 p.m.", entry: "Challenge score entered: 85%", by: "Test Public Servant", note: "" },
  { when: "October 12, 2026, 9:30 a.m.", entry: "Under review: challenge", by: "Test Public Servant", note: "Consensus scores finalized." },
  { when: "October 2, 2026, 4:00 p.m.", entry: "Under review: resource questions", by: "System", note: "The opportunity closed." },
  { when: "September 15, 2026, 2:12 p.m.", entry: "Submitted", by: "Test Vendor", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead eyebrow="Manage a Team With Us proposal" program="team-with-us" status="Awarded" title="Data platform team" />
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
