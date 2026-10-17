import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · evaluated — the proposal has been scored, so it is evaluated, it has a rank among the other
// evaluated proposals, and it may be awarded. When every proposal still in contention is evaluated, the opportunity
// moves to processing on its own (R-2.26, R-2.27, R-2.31, R-2.33)
const meta: Meta = { title: "proposals/proposal-cwu-view/evaluated", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

export const Evaluated: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Code With Us proposal"
          program="code-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Test Vendor</span>}
        />
        <Details
          items={[
            {
              term: "Opportunity",
              value: (
                <Link href="/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit">
                  Build an accessible permit tracker
                </Link>
              ),
            },
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m." },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Score">
          <Details
            items={[
              { term: "Score", value: "87%", testId: "proposal-score" },
              { term: "Rank", value: "1 of 2", testId: "proposal-rank" },
            ]}
          />
        </Region>
        <Actions>
          <Link href={`${base}/export`} data-testid="proposal-export-link">Printable copy</Link>
        </Actions>
        <ProposalActions>
          <Button variant="primary" data-testid="proposal-award-button">Award</Button>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <ProposalTabs
          base={base}
          current="proposal"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <CatalogueNote>The proposal is shown as in the default story and is trimmed here.</CatalogueNote>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
