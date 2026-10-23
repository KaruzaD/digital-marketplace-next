import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, Details, Panel, STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-export-all · default — public sector staff or an administrator takes away every submitted proposal of a
// closed opportunity in one document, with the proponents named. Drafts are never included (R-2.25, R-2.38)
const meta: Meta = { title: "proposals/proposal-swu-export-all/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "export-item-1", proponent: "Example Digital Ltd.", submitted: "October 10, 2026", cost: "$1,150,000" },
  { id: "export-item-2", proponent: "Sample Software Co-op", submitted: "October 9, 2026", cost: "$1,100,000" },
  { id: "export-item-3", proponent: "Placeholder Code Works", submitted: "October 8, 2026", cost: "$1,190,000" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Export all Sprint With Us proposals"
          program="sprint-with-us"
          title="Modernize the licence renewal service"
        />
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
                  { term: "Status", value: "Under review: team questions" },
                  { term: "Submitted", value: p.submitted },
                  { term: "Total proposed cost", value: p.cost },
                ]}
              />
              <CatalogueNote>
                The team, team question responses, references and attachments follow, as in proposal-swu-export-one. They are
                trimmed here.
              </CatalogueNote>
            </Panel>
          ))}
        </div>
      </ProposalPage>
    </SitePage>
  ),
};
