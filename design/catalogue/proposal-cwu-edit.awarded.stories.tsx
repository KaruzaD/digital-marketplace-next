import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@bcgov/design-system-react-components";
import { Details, Region, VENDOR } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-edit · awarded — the opportunity has been awarded to this proposal, so its score and rank are now shown
// to the vendor. A proposal that was passed over shows "Not awarded" with its score and rank in the same place (R-2.26,
// R-2.32, R-2.33)
const meta: Meta = { title: "proposals/proposal-cwu-edit/awarded", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

export const Awarded: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Code With Us proposal"
          program="code-with-us"
          status="Awarded"
          title="Build an accessible permit tracker"
        />
        <Details
          items={[
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m.", testId: "proposal-submitted-at" },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111", testId: "proposal-identifier" },
            { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" },
          ]}
        />
        <ProposalActions>
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
          <Region id="tab-result" title="Result" level={3}>
            <Details
              items={[
                { term: "Score", value: "87%", testId: "proposal-score" },
                { term: "Rank", value: "1 of 2", testId: "proposal-rank" },
              ]}
            />
          </Region>
          <CatalogueNote>
            The proponent, proposal, comments and attachments follow, as in the default story. They are trimmed here.
          </CatalogueNote>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
