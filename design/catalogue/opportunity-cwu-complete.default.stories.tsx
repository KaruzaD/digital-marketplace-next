import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./marketplace";
import { ADMIN, Details, OpportunityHead, OpportunityPage, Panel, Region, statusColour } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-complete · default — an administrator reads the opportunity, its addenda, its history and every
// proposal as one continuous document (R-1.40)
const meta: Meta = { title: "opportunities/opportunity-cwu-complete/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "p1", proponent: "Example Digital Co-operative", status: "Awarded", score: "91.50%" },
  { id: "p2", proponent: "Test Vendor One", status: "Not awarded", score: "84.25%" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Code With Us opportunity report"
          program="code-with-us"
          status="Awarded"
          title="Build an accessible permit tracker"
          titleId="report-title"
        />
        <article className="op-region" aria-labelledby="report-title" data-testid="opportunity-full-report">
          <Region id="report-opportunity" title="Opportunity">
            <Details
              items={[
                { term: "Status", value: <Label colour={statusColour("Awarded")}>Awarded</Label> },
                { term: "Reward", value: "$45,000" },
                { term: "Proposal deadline", value: "October 2, 2026 at 4:00 p.m. Pacific time" },
                { term: "Published", value: "September 10, 2026" },
                { term: "Created by", value: "Test Public Servant" },
              ]}
            />
            <p className="op-text">
              The ministry runs an online permit application that tells applicants little about where their application
              stands. This opportunity adds a status page that works with a keyboard and a screen reader.
            </p>
          </Region>
          <Region id="report-addenda" title="Addenda">
            <p className="op-text">September 20, 2026: The kick-off meeting will be held by video, not in person.</p>
          </Region>
          <Region id="report-history" title="History">
            <ul className="op-list">
              <li>October 30, 2026: Awarded, by Test Administrator</li>
              <li>October 21, 2026: Processing. Moved automatically because all proposals have been evaluated.</li>
              <li>October 2, 2026: Evaluation. This opportunity has closed.</li>
              <li>September 10, 2026: Published, by Test Administrator</li>
            </ul>
          </Region>
          <Region id="report-proposals" title="Proposals">
            {proposals.map((p) => (
              <Panel as="article" level={3} key={p.id} id={`report-${p.id}`} title={p.proponent}>
                <p className="op-text">
                  Status: {p.status}. Score: {p.score}.
                </p>
                <p className="op-text">[The proposal as submitted, in full.]</p>
              </Panel>
            ))}
          </Region>
        </article>
      </OpportunityPage>
    </SitePage>
  ),
};
