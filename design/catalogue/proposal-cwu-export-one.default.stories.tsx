import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-export-one · default — a printable copy of one proposal, for anyone entitled to read it: its vendor, or
// staff once the opportunity has closed. It is one continuous document with nothing to expand, so it reads and prints
// whole (R-2.37)
const meta: Meta = { title: "proposals/proposal-cwu-export-one/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <Actions>
          <Link href="/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111/edit">
            Back to the proposal
          </Link>
          <Button variant="secondary">Print</Button>
        </Actions>
        <article className="op-regions" aria-labelledby="export-title" data-testid="proposal-export-document">
          <ProposalHead
            eyebrow="Code With Us proposal"
            program="code-with-us"
            status="Submitted"
            statusTestId={null}
            title={<span id="export-title">Build an accessible permit tracker</span>}
          />
          <Details
            items={[
              { term: "Proponent", value: "Test Vendor", testId: "proposal-proponent-name" },
              { term: "Submitted", value: "September 15, 2026 at 2:12 p.m." },
              { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111" },
            ]}
          />
          <Region id="export-proponent" title="Proponent">
            <Details
              items={[
                { term: "Proponent type", value: "Individual" },
                { term: "Email address", value: "test.vendor@example.com" },
                { term: "Address", value: "100 Example Street, Victoria, BC V8W 0A0, Canada" },
              ]}
            />
          </Region>
          <Region id="export-text" title="Proposal text">
            <p className="op-text">
              I will add a status page to the permit application that shows each stage in plain language, built with the
              ministry's existing React front end and tested with a screen reader at each step.
            </p>
          </Region>
          <Region id="export-comments" title="Additional comments">
            <p className="op-text">I am available to start on the assignment date.</p>
          </Region>
          <Region id="export-attachments" title="Attachments">
            <ul className="op-list">
              <li>Delivery plan.pdf</li>
            </ul>
          </Region>
        </article>
      </ProposalPage>
    </SitePage>
  ),
};
