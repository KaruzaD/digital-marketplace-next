import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, Details, Panel, STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-export-all · default — public sector staff or an administrator takes away every submitted proposal of a
// closed opportunity in one document, with the proponents named. Drafts are never included (R-2.25, R-2.38)
const meta: Meta = { title: "proposals/proposal-twu-export-all/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "export-item-1", proponent: "Example Digital Ltd.", submitted: "September 15, 2026", bid: "$220.00 an hour" },
  { id: "export-item-2", proponent: "Sample Software Co-op", submitted: "September 14, 2026", bid: "$235.00 an hour" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead eyebrow="Export all Team With Us proposals" program="team-with-us" title="Data platform team" />
        <p className="op-text">Every submitted proposal you are entitled to see, in one document. Drafts are never included.</p>
        <Actions>
          <Checkbox data-testid="proposal-export-anonymous-toggle">Name proponents anonymously</Checkbox>
          <Button variant="secondary">Print</Button>
        </Actions>
        <div className="op-regions" data-testid="proposal-export-document">
          {proposals.map((p) => (
            <Panel
              key={p.id}
              as="article"
              id={p.id}
              testId="proposal-export-item"
              title={<span data-testid="proposal-proponent-name">{p.proponent}</span>}
            >
              <Details
                items={[
                  { term: "Status", value: "Under review: resource questions" },
                  { term: "Submitted", value: p.submitted },
                  { term: "Bid", value: p.bid },
                ]}
              />
              <CatalogueNote>
                The team, resource question responses and attachments follow, as in proposal-twu-export-one. They are trimmed
                here.
              </CatalogueNote>
            </Panel>
          ))}
        </div>
      </ProposalPage>
    </SitePage>
  ),
};
