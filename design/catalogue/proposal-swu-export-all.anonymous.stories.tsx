import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, Details, Panel, STAFF } from "./opportunity-kit";
import { ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-export-all · anonymous — the same document with "Name proponents anonymously" ticked: each proponent is
// named by its anonymous name and the organization is withheld (R-2.5, R-2.38)
const meta: Meta = { title: "proposals/proposal-swu-export-all/anonymous", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  { id: "export-item-1", proponent: "Proponent 1", submitted: "October 10, 2026", cost: "$1,150,000" },
  { id: "export-item-2", proponent: "Proponent 2", submitted: "October 9, 2026", cost: "$1,100,000" },
  { id: "export-item-3", proponent: "Proponent 3", submitted: "October 8, 2026", cost: "$1,190,000" },
];

export const Anonymous: StoryObj = {
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
          <Checkbox defaultSelected data-testid="proposal-export-anonymous-toggle">Name proponents anonymously</Checkbox>
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
              <p className="op-text">The organization is withheld in this document.</p>
            </Panel>
          ))}
        </div>
      </ProposalPage>
    </SitePage>
  ),
};
