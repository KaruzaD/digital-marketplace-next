import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, DataTable, Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · default — the opportunity's author, after closing, while the team questions are under review.
// The proponent is shown only by its anonymous name, and every stage score is still to come. Disqualify is offered at
// every stage (R-2.5, R-2.25, R-2.34, R-2.37)
const meta: Meta = { title: "proposals/proposal-swu-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const phases = [
  {
    name: "Prototype phase",
    cost: "$300,000",
    team: [
      { member: "Test Vendor", scrum: "Yes", capabilities: "Agile coaching, User research" },
      { member: "Test Developer One", scrum: "No", capabilities: "Frontend development, Backend development" },
    ],
  },
  {
    name: "Implementation phase",
    cost: "$850,000",
    team: [
      { member: "Test Vendor", scrum: "Yes", capabilities: "Agile coaching" },
      { member: "Test Developer One", scrum: "No", capabilities: "Frontend development, Backend development" },
      { member: "Test Designer", scrum: "No", capabilities: "User research, Security engineering" },
    ],
  },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Under review: team questions"
          title={<span data-testid="proposal-proponent-name">Proponent 1</span>}
        />
        <Details
          items={[
            {
              term: "Opportunity",
              value: (
                <Link href="/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit">
                  Modernize the licence renewal service
                </Link>
              ),
            },
            { term: "Submitted", value: "October 10, 2026 at 2:12 p.m." },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000211", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Team questions", value: "Not yet scored", testId: "proposal-questions-score" },
              { term: "Code challenge", value: "Not yet scored", testId: "proposal-challenge-score" },
              { term: "Team scenario", value: "Not yet scored", testId: "proposal-scenario-score" },
              { term: "Price", value: "Not yet calculated", testId: "proposal-price-score" },
              { term: "Total", value: "Not yet calculated", testId: "proposal-total-score" },
              {
                term: "Rank",
                value: (
                  <>
                    <span data-testid="proposal-rank" />
                    Not yet ranked
                  </>
                ),
              },
            ]}
          />
        </Region>
        <Actions>
          <Link href={`${base}/export`} data-testid="proposal-export-link">Printable copy</Link>
        </Actions>
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <ProposalTabs
          base={base}
          current="proposal"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <Region id="tab-organization" title="Organization" level={3}>
            <p className="op-text">Withheld from evaluators until the proposal reaches the code challenge.</p>
          </Region>
          <Region id="tab-team" title="Team" level={3}>
            {phases.map((phase, i) => (
              <div key={phase.name} className="op-region">
                <DataTable
                  captionId={`team-caption-${i}`}
                  caption={`${phase.name} team`}
                  columns={["Team member", "Scrum master", "Capabilities"]}
                >
                  {phase.team.map((t) => (
                    <tr key={t.member}>
                      <td>{t.member}</td>
                      <td>{t.scrum}</td>
                      <td>{t.capabilities}</td>
                    </tr>
                  ))}
                </DataTable>
                <p className="op-text">{phase.name} proposed cost: {phase.cost}</p>
              </div>
            ))}
            <p className="op-text">Total proposed cost: $1,150,000 of the $1,200,000 maximum budget.</p>
          </Region>
          <Region id="tab-references" title="References" level={3}>
            <p className="op-text">Test Reference One, test.reference@example.com</p>
          </Region>
          <Region id="tab-attachments" title="Attachments" level={3}>
            <ul className="op-list">
              <li>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000911?type=blob" data-testid="attachment-download-link">
                  Download Delivery approach.pdf
                </Link>
              </li>
            </ul>
          </Region>
          <p className="op-note">The responses to the team questions are on the Team questions tab.</p>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
