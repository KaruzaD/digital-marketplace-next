import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, Actions, Details, Region } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · evaluated — every stage has a score, so the price score and the weighted total are shown, the
// proposal is ranked among the other fully evaluated proposals, and it may be awarded (R-2.30, R-2.31, R-2.33)
const meta: Meta = { title: "proposals/proposal-twu-view/evaluated", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

export const Evaluated: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <Details
          items={[
            {
              term: "Opportunity",
              value: (
                <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit">Data platform team</Link>
              ),
            },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000311", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Resource questions", value: "84%", testId: "proposal-questions-score" },
              { term: "Challenge", value: "85%", testId: "proposal-challenge-score" },
              { term: "Price", value: "100%", testId: "proposal-price-score" },
              { term: "Total", value: "88.10%", testId: "proposal-total-score" },
              { term: "Rank", value: <span data-testid="proposal-rank">1st</span> },
            ]}
          />
          <p className="op-note">
            The total combines each stage's score in the proportions the opportunity states. The price score is this
            proposal's share of the lowest bid still in contention, where a bid is each hourly rate weighted by its resource's
            target allocation.
          </p>
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
            { key: "resource-questions", label: "Resource questions", query: "resourceQuestions" },
            { key: "challenge", label: "Challenge" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <CatalogueNote>The proposal is shown as in the default story, now naming the organization. It is trimmed here.</CatalogueNote>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
