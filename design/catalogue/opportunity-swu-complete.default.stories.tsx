import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./marketplace";
import { ADMIN, Details, OpportunityHead, OpportunityPage, Panel, Region, statusColour } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-complete · default — an administrator reads the opportunity, its addenda, its history and every
// proposal as one continuous document (R-1.40); proponents are named because the opportunity has been awarded
const meta: Meta = { title: "opportunities/opportunity-swu-complete/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "p1", proponent: "Example Digital Co-operative", status: "Awarded", score: "88.40%" },
  { id: "p2", proponent: "Sample Software Ltd.", status: "Not awarded", score: "81.10%" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Sprint With Us opportunity report"
          program="sprint-with-us"
          status="Awarded"
          title="Modernize the licence renewal service"
          titleId="report-title"
        />
        <article className="op-region" aria-labelledby="report-title" data-testid="opportunity-full-report">
          <Region id="report-opportunity" title="Opportunity">
            <Details
              items={[
                { term: "Status", value: <Label colour={statusColour("Awarded")}>Awarded</Label> },
                { term: "Total maximum budget", value: "$1,200,000" },
                { term: "Proposal deadline", value: "October 16, 2026 at 4:00 p.m. Pacific time" },
                { term: "Published", value: "September 10, 2026" },
                { term: "Created by", value: "Test Public Servant" },
              ]}
            />
            <p className="op-text">
              Phases: prototype, November 2, 2026 to January 29, 2027; implementation, February 1, 2027 to September 30,
              2027.
            </p>
            <p className="op-text">Scoring weights: team questions 30%, code challenge 30%, team scenario 20%, price 20%.</p>
          </Region>
          <Region id="report-addenda" title="Addenda">
            <p className="op-text">September 20, 2026: The kick-off meeting will be held by video, not in person.</p>
          </Region>
          <Region id="report-history" title="History">
            <ul className="op-list">
              <li>December 4, 2026: Awarded, by Test Administrator</li>
              <li>November 27, 2026: Processing. Moved automatically because all proposals have been evaluated.</li>
              <li>November 13, 2026: Team scenario, by Test Public Servant</li>
              <li>November 2, 2026: Code challenge. Consensus scores finalized.</li>
              <li>October 16, 2026: Team questions: individual evaluation. This opportunity has closed.</li>
              <li>September 10, 2026: Published, by Test Administrator</li>
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
