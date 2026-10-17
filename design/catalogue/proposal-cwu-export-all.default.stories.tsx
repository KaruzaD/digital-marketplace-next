import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Checkbox } from "@bcgov/design-system-react-components";
import { Actions, Details, Panel, SectionTitle, STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-export-all · default — public sector staff or an administrator takes away every submitted proposal of a
// closed opportunity in one document, with the proponents named. Drafts are never included (R-2.25, R-2.38)
const meta: Meta = { title: "proposals/proposal-cwu-export-all/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const proposals = [
  {
    id: "export-item-1",
    proponent: "Test Vendor",
    status: "Under review",
    submitted: "September 15, 2026",
    text: "I will add a status page to the permit application that shows each stage in plain language.",
  },
  {
    id: "export-item-2",
    proponent: "Example Digital Ltd.",
    status: "Under review",
    submitted: "September 14, 2026",
    text: "Our team will rebuild the permit status view as an accessible, plain-language timeline.",
  },
];

export const Default: StoryObj = {
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
                  { term: "Status", value: p.status },
                  { term: "Submitted", value: p.submitted },
                ]}
              />
              <div className="op-region">
                <SectionTitle level={3} id={`${p.id}-proposal`}>
                  Proposal
                </SectionTitle>
                <p className="op-text">{p.text}</p>
              </div>
              <CatalogueNote>
                The proponent's details, additional comments and attachments follow, as in proposal-cwu-export-one. They are
                trimmed here.
              </CatalogueNote>
            </Panel>
          ))}
        </div>
      </ProposalPage>
    </SitePage>
  ),
};
