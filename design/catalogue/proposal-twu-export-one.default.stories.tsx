import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-export-one · default — a printable copy of one proposal as its vendor sees it, naming the organization.
// Staff see the same copy once the proposal has reached the challenge (R-2.37)
const meta: Meta = { title: "proposals/proposal-twu-export-one/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <Actions>
          <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311/edit">
            Back to the proposal
          </Link>
          <Button variant="secondary">Print</Button>
        </Actions>
        <article className="op-regions" aria-labelledby="export-title" data-testid="proposal-export-document">
          <ProposalHead
            eyebrow="Team With Us proposal"
            program="team-with-us"
            status="Submitted"
            statusTestId={null}
            title={<span id="export-title">Data platform team</span>}
          />
          <Details
            items={[
              { term: "Proponent", value: "Example Digital Ltd.", testId: "proposal-proponent-name" },
              { term: "Submitted", value: "September 15, 2026 at 2:12 p.m." },
              { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000311" },
            ]}
          />
          <Region id="export-team" title="Team">
            <ul className="op-list">
              <li>Full stack developer, 100% of full time: Test Developer One, $150.00 an hour</li>
              <li>Data professional, 50% of full time: Test Developer Two, $140.00 an hour</li>
            </ul>
            <p className="op-text">Bid: $220.00 an hour, each rate weighted by its resource's target allocation.</p>
          </Region>
          <Region id="export-questions" title="Resource questions">
            <Region id="export-question-1" title="Question 1" level={3}>
              <p className="op-text">Describe your experience building data pipelines for health data.</p>
              <p className="op-text">
                Our team has built and run the ingestion pipelines for two provincial registries, with privacy reviews at
                each release.
              </p>
            </Region>
          </Region>
          <Region id="export-attachments" title="Attachments">
            <ul className="op-list">
              <li>Team profiles.pdf</li>
            </ul>
          </Region>
        </article>
      </ProposalPage>
    </SitePage>
  ),
};
