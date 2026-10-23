import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { DataTable, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · history-tab — every change of stage and every score, newest first, with who did it, when, and
// any note, including the calculated price score (R-2.30, R-2.35)
const meta: Meta = { title: "proposals/proposal-swu-view/history-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const history = [
  { when: "November 3, 2026, 3:10 p.m.", entry: "Price score calculated: 95.65%", by: "System", note: "" },
  { when: "November 3, 2026, 3:10 p.m.", entry: "Team scenario score entered: 88%", by: "Test Public Servant", note: "" },
  { when: "October 30, 2026, 10:15 a.m.", entry: "Under review: team scenario", by: "Test Public Servant", note: "Screened in." },
  { when: "October 27, 2026, 1:45 p.m.", entry: "Code challenge score entered: 90%", by: "Test Public Servant", note: "" },
  { when: "October 22, 2026, 9:30 a.m.", entry: "Under review: code challenge", by: "Test Public Servant", note: "Consensus scores finalized." },
  { when: "October 16, 2026, 4:00 p.m.", entry: "Under review: team questions", by: "System", note: "The opportunity closed." },
  { when: "October 10, 2026, 2:12 p.m.", entry: "Submitted", by: "Test Vendor", note: "" },
];

export const HistoryTab: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
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
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
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
