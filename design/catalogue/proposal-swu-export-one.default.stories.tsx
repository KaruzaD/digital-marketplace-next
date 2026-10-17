import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-export-one · default — a printable copy of one proposal as its vendor sees it, naming the organization.
// Staff see the same copy once the proposal has reached the code challenge (R-2.37)
const meta: Meta = { title: "proposals/proposal-swu-export-one/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <Actions>
          <Link href="/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211/edit">
            Back to the proposal
          </Link>
          <Button variant="secondary">Print</Button>
        </Actions>
        <article className="op-regions" aria-labelledby="export-title" data-testid="proposal-export-document">
          <ProposalHead
            eyebrow="Sprint With Us proposal"
            program="sprint-with-us"
            status="Submitted"
            statusTestId={null}
            title={<span id="export-title">Modernize the licence renewal service</span>}
          />
          <Details
            items={[
              { term: "Proponent", value: "Example Digital Ltd.", testId: "proposal-proponent-name" },
              { term: "Submitted", value: "October 10, 2026 at 2:12 p.m." },
              { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000211" },
            ]}
          />
          <Region id="export-team" title="Team">
            <Region id="export-team-prototype" title="Prototype phase" level={3}>
              <ul className="op-list">
                <li>Test Vendor, scrum master: Agile coaching, User research</li>
                <li>Test Developer One: Frontend development, Backend development</li>
              </ul>
              <p className="op-text">Proposed cost: $300,000</p>
            </Region>
            <Region id="export-team-implementation" title="Implementation phase" level={3}>
              <ul className="op-list">
                <li>Test Vendor, scrum master: Agile coaching</li>
                <li>Test Developer One: Frontend development, Backend development</li>
                <li>Test Designer: User research, Security engineering</li>
              </ul>
              <p className="op-text">Proposed cost: $850,000</p>
            </Region>
            <p className="op-text">Total proposed cost: $1,150,000 of the $1,200,000 maximum budget.</p>
          </Region>
          <Region id="export-questions" title="Team questions">
            <Region id="export-question-1" title="Question 1" level={3}>
              <p className="op-text">Describe how your team would approach user research for the renewal service.</p>
              <p className="op-text">
                We would start with the renewal staff and the ten most common reasons a renewal is returned, then test each
                change with applicants who use assistive technology.
              </p>
            </Region>
            <Region id="export-question-2" title="Question 2" level={3}>
              <p className="op-text">Describe a time your team replaced a legacy system without interrupting service.</p>
              <p className="op-text">We moved a permit service to a new platform in stages, running both side by side for six weeks.</p>
            </Region>
          </Region>
          <Region id="export-references" title="References">
            <p className="op-text">Test Reference One, test.reference@example.com</p>
          </Region>
          <Region id="export-attachments" title="Attachments">
            <ul className="op-list">
              <li>Delivery approach.pdf</li>
            </ul>
          </Region>
        </article>
      </ProposalPage>
    </SitePage>
  ),
};
