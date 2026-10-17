import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./marketplace";
import { ADMIN, Details, OpportunityHead, OpportunityPage, Panel, Region, statusColour } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-complete · default — an administrator reads the opportunity, its addenda, its history and every
// proposal as one continuous document (R-1.40); proponents are named because the opportunity has been awarded
const meta: Meta = { title: "opportunities/opportunity-twu-complete/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "p1", proponent: "Example Digital Co-operative", status: "Awarded", score: "86.00%" },
  { id: "p2", proponent: "Sample Software Ltd.", status: "Not awarded", score: "79.75%" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Team With Us opportunity report"
          program="team-with-us"
          status="Awarded"
          title="Data platform team"
          titleId="report-title"
        />
        <article className="op-region" aria-labelledby="report-title" data-testid="opportunity-full-report">
          <Region id="report-opportunity" title="Opportunity">
            <Details
              items={[
                { term: "Status", value: <Label colour={statusColour("Awarded")}>Awarded</Label> },
                { term: "Maximum budget", value: "$900,000" },
                { term: "Proposal deadline", value: "September 11, 2026 at 4:00 p.m. Pacific time" },
                { term: "Published", value: "August 14, 2026" },
                { term: "Created by", value: "Test Public Servant" },
              ]}
            />
            <p className="op-text">Resources: full stack developer, 100% of full time; data professional, 50% of full time.</p>
            <p className="op-text">Scoring weights: resource questions 30%, challenge 40%, price 30%.</p>
          </Region>
          <Region id="report-addenda" title="Addenda">
            <p className="op-text">August 25, 2026: Interviews for the challenge will be held by video.</p>
          </Region>
          <Region id="report-history" title="History">
            <ul className="op-list">
              <li>October 20, 2026: Awarded, by Test Administrator</li>
              <li>October 13, 2026: Processing. Moved automatically because all proposals have been evaluated.</li>
              <li>September 28, 2026: Challenge. Consensus scores finalized.</li>
              <li>September 11, 2026: Resource questions: individual evaluation. This opportunity has closed.</li>
              <li>August 14, 2026: Published, by Test Administrator</li>
            </ul>
          </Region>
          <Region id="report-proposals" title="Proposals">
            {proposals.map((p) => (
              <Panel as="article" level={3} key={p.id} id={`report-${p.id}`} title={p.proponent}>
                <p className="op-text">
                  Status: {p.status}. Total score: {p.score}.
                </p>
                <p className="op-text">[The proposal as submitted, with its scores at each stage.]</p>
              </Panel>
            ))}
          </Region>
        </article>
      </OpportunityPage>
    </SitePage>
  ),
};
