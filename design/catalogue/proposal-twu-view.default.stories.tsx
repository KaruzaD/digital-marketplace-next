import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, DataTable, Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · default — the opportunity's author, after closing, while the resource questions are under review.
// The proponent is shown only by its anonymous name, and every stage score is still to come. Disqualify is offered at
// every stage (R-2.5, R-2.25, R-2.34, R-2.37)
const meta: Meta = { title: "proposals/proposal-twu-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

const team = [
  { resource: "Full stack developer, 100% of full time", member: "Test Developer One", rate: "$150.00" },
  { resource: "Data professional, 50% of full time", member: "Test Developer Two", rate: "$140.00" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Under review: resource questions"
          title={<span data-testid="proposal-proponent-name">Proponent 1</span>}
        />
        <Details
          items={[
            {
              term: "Opportunity",
              value: (
                <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit">Data platform team</Link>
              ),
            },
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m." },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000311", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Resource questions", value: "Not yet scored", testId: "proposal-questions-score" },
              { term: "Challenge", value: "Not yet scored", testId: "proposal-challenge-score" },
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
            { key: "resource-questions", label: "Resource questions", query: "resourceQuestions" },
            { key: "challenge", label: "Challenge" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <Region id="tab-organization" title="Organization" level={3}>
            <p className="op-text">Withheld from evaluators until the proposal reaches the challenge.</p>
          </Region>
          <Region id="tab-team" title="Team" level={3}>
            <DataTable
              captionId="team-caption"
              caption="Team members, by the resource each is named against"
              columns={["Resource", "Team member", "Hourly rate"]}
            >
              {team.map((t) => (
                <tr key={t.member}>
                  <td>{t.resource}</td>
                  <td>{t.member}</td>
                  <td>{t.rate}</td>
                </tr>
              ))}
            </DataTable>
            <p className="op-text">Bid: $220.00 an hour, each rate weighted by its resource's target allocation.</p>
          </Region>
          <Region id="tab-attachments" title="Attachments" level={3}>
            <ul className="op-list">
              <li>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000921?type=blob" data-testid="attachment-download-link">
                  Download Team profiles.pdf
                </Link>
              </li>
            </ul>
          </Region>
          <p className="op-note">The responses to the resource questions are on the Resource questions tab.</p>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
