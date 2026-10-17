import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { ADMIN, Actions, Details, Region } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · evaluated — every stage has a score, so the price score and the weighted total are shown, the
// proposal is ranked among the other fully evaluated proposals, and it may be awarded (R-2.30, R-2.31, R-2.33)
const meta: Meta = { title: "proposals/proposal-swu-view/evaluated", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

export const Evaluated: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
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
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000211", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Scores">
          <Details
            items={[
              { term: "Team questions", value: "82.50%", testId: "proposal-questions-score" },
              { term: "Code challenge", value: "90%", testId: "proposal-challenge-score" },
              { term: "Team scenario", value: "88%", testId: "proposal-scenario-score" },
              { term: "Price", value: "95.65%", testId: "proposal-price-score" },
              { term: "Total", value: "88.41%", testId: "proposal-total-score" },
              { term: "Rank", value: <span data-testid="proposal-rank">1st</span> },
            ]}
          />
          <p className="op-note">
            The total combines each stage's score in the proportions the opportunity states. The price score is this
            proposal's share of the lowest bid still in contention.
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
            { key: "team-questions", label: "Team questions", query: "teamQuestions" },
            { key: "code-challenge", label: "Code challenge", query: "codeChallenge" },
            { key: "team-scenario", label: "Team scenario", query: "teamScenario" },
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
