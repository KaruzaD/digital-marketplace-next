import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, DataTable, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-edit · default — the vendor's own submitted proposal, before the deadline. They may edit it or withdraw
// it. There is no Scoresheet tab and no score or rank until the opportunity is awarded or the proposal is passed over
// (R-2.20, R-2.23, R-2.24, R-2.30, R-2.32, R-2.37)
const meta: Meta = { title: "proposals/proposal-twu-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

const team = [
  { resource: "Full stack developer, 100% of full time", member: "Test Developer One", rate: "$150.00" },
  { resource: "Data professional, 50% of full time", member: "Test Developer Two", rate: "$140.00" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Team With Us proposal"
          program="team-with-us"
          status="Submitted"
          title="Data platform team"
        />
        <Details
          items={[
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m.", testId: "proposal-submitted-at" },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000311", testId: "proposal-identifier" },
            { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" },
            { term: "Proposal deadline", value: "October 2, 2026 at 4:00 p.m. Pacific time" },
          ]}
        />
        <Actions>
          <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301">View the opportunity</Link>
          <Link href={`${base}/export`} data-testid="proposal-export-link">Printable copy</Link>
        </Actions>
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <ProposalTabs
          base={`${base}/edit`}
          current="proposal"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <Region id="tab-organization" title="Organization" level={3}>
            <Details items={[{ term: "Legal name", value: "Example Digital Ltd.", testId: "proposal-organization" }]} />
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
            <p className="op-text">Estimated cost over the contract: $412,500 of the $900,000 maximum budget.</p>
          </Region>
          <Region id="tab-questions" title="Resource questions" level={3}>
            <ol className="op-list">
              <li>
                <div className="op-region">
                  <p className="op-text">Describe your experience building data pipelines for health data.</p>
                  <p className="op-text">
                    Response: Our team has built and run the ingestion pipelines for two provincial registries, with privacy
                    reviews at each release.
                  </p>
                </div>
              </li>
            </ol>
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
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
