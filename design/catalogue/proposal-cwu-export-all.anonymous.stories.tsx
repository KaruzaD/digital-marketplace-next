import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, Details, Panel, SectionTitle, STAFF } from "./opportunity-kit";
import { ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-export-all · anonymous — the same document with "Name proponents anonymously" ticked: each proponent is
// named "Proponent 1", "Proponent 2" and so on, and their names and contact details are withheld (R-2.38)
const meta: Meta = { title: "proposals/proposal-cwu-export-all/anonymous", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  {
    id: "export-item-1",
    proponent: "Proponent 1",
    status: "Under review",
    submitted: "September 15, 2026",
    text: "I will add a status page to the permit application that shows each stage in plain language.",
  },
  {
    id: "export-item-2",
    proponent: "Proponent 2",
    status: "Under review",
    submitted: "September 14, 2026",
    text: "Our team will rebuild the permit status view as an accessible, plain-language timeline.",
  },
];

export const Anonymous: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Export all Code With Us proposals"
          program="code-with-us"
          title="Build an accessible permit tracker"
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
                  { term: "Status", value: p.status },
                  { term: "Submitted", value: p.submitted },
                ]}
              />
              <p className="op-text">The proponent's name and contact details are withheld in this document.</p>
              <div className="op-region">
                <SectionTitle level={3} id={`${p.id}-proposal`}>
                  Proposal
                </SectionTitle>
                <p className="op-text">{p.text}</p>
              </div>
            </Panel>
          ))}
        </div>
      </ProposalPage>
    </SitePage>
  ),
};
