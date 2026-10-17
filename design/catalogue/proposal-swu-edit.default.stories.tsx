import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, DataTable, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalStatus, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · default — the vendor's own submitted proposal, before the deadline. They may edit it or withdraw
// it. There is no Scoresheet tab and no score or rank until the opportunity is awarded or the proposal is passed over
// (R-2.18, R-2.23, R-2.24, R-2.32, R-2.37)
const meta: Meta = { title: "proposals/proposal-swu-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const phases = [
  {
    name: "Prototype phase",
    cost: "$300,000",
    team: [
      { member: "Test Vendor", scrum: "Yes", membership: "Active", capabilities: "Agile coaching, User research" },
      { member: "Test Developer One", scrum: "No", membership: "Active", capabilities: "Frontend development, Backend development" },
    ],
  },
  {
    name: "Implementation phase",
    cost: "$850,000",
    team: [
      { member: "Test Vendor", scrum: "Yes", membership: "Active", capabilities: "Agile coaching" },
      { member: "Test Developer One", scrum: "No", membership: "Active", capabilities: "Frontend development, Backend development" },
      { member: "Test Designer", scrum: "No", membership: "Active", capabilities: "User research, Security engineering" },
    ],
  },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Sprint With Us proposal"
          program="sprint-with-us"
          status="Submitted"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[
            { term: "Submitted", value: "October 10, 2026 at 2:12 p.m.", testId: "proposal-submitted-at" },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000211", testId: "proposal-identifier" },
            { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" },
            { term: "Proposal deadline", value: "October 16, 2026 at 4:00 p.m. Pacific time" },
          ]}
        />
        <Actions>
          <Link href="/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201">View the opportunity</Link>
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
            {phases.map((phase, i) => (
              <div key={phase.name} className="op-region">
                <DataTable
                  captionId={`team-caption-${i}`}
                  caption={`${phase.name} team`}
                  columns={["Team member", "Scrum master", "Membership", "Capabilities"]}
                >
                  {phase.team.map((t) => (
                    <tr key={t.member}>
                      <td>{t.member}</td>
                      <td>{t.scrum}</td>
                      <td>
                        <ProposalStatus bare>{t.membership}</ProposalStatus>
                      </td>
                      <td>{t.capabilities}</td>
                    </tr>
                  ))}
                </DataTable>
                <p className="op-text">{phase.name} proposed cost: {phase.cost}</p>
              </div>
            ))}
            <p className="op-text">Total proposed cost: $1,150,000 of the $1,200,000 maximum budget.</p>
          </Region>
          <Region id="tab-questions" title="Team questions" level={3}>
            <ol className="op-list">
              <li>
                <div className="op-region">
                  <p className="op-text">Describe how your team would approach user research for the renewal service.</p>
                  <p className="op-text">
                    Response: We would start with the renewal staff and the ten most common reasons a renewal is returned, then
                    test each change with applicants who use assistive technology.
                  </p>
                </div>
              </li>
              <li>
                <div className="op-region">
                  <p className="op-text">Describe a time your team replaced a legacy system without interrupting service.</p>
                  <p className="op-text">
                    Response: We moved a permit service to a new platform in stages, running both side by side for six weeks.
                  </p>
                </div>
              </li>
            </ol>
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
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
