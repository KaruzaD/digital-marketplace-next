import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, VENDOR } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · draft — the vendor's draft. It may be edited, submitted or deleted, and it has no submitted time.
// Only a draft offers Delete (R-2.4, R-2.12)
const meta: Meta = { title: "proposals/proposal-swu-edit/draft", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const Draft: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Sprint With Us proposal"
          program="sprint-with-us"
          status="Draft"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[
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
          <Button variant="primary" data-testid="proposal-submit">Submit proposal</Button>
          <Button variant="secondary" danger data-testid="proposal-delete-button">Delete</Button>
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
          <CatalogueNote>
            The proposal is shown as in the default story, with any blank field shown as "Not entered yet". It is trimmed here.
          </CatalogueNote>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
