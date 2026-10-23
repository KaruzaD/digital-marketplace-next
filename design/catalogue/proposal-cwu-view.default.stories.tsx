import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, STAFF } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · default — the opportunity's author, after the opportunity has closed, on a proposal under review.
// They may enter its one score or disqualify it, and take away a printable copy (R-2.25, R-2.26, R-2.34, R-2.37)
const meta: Meta = { title: "proposals/proposal-cwu-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Code With Us proposal"
          program="code-with-us"
          status="Under review"
          title={<span data-testid="proposal-proponent-name">Test Vendor</span>}
        />
        <Details
          items={[
            {
              term: "Opportunity",
              value: (
                <Link href="/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit">
                  Build an accessible permit tracker
                </Link>
              ),
            },
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m." },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111", testId: "proposal-identifier" },
          ]}
        />
        <Region id="scores-heading" title="Score">
          <Details items={[{ term: "Score", value: "Not yet scored", testId: "proposal-score" }]} />
        </Region>
        <Actions>
          <Link href={`${base}/export`} data-testid="proposal-export-link">Printable copy</Link>
        </Actions>
        <ProposalActions>
          <Button variant="primary" data-testid="proposal-enter-score">Enter score</Button>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <ProposalTabs
          base={base}
          current="proposal"
          tabs={[
            { key: "proposal", label: "Proposal" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Proposal">
          <Region id="tab-proponent" title="Proponent" level={3}>
            <Details
              items={[
                { term: "Proponent type", value: "Individual" },
                { term: "Legal name", value: "Test Vendor" },
                { term: "Email address", value: "test.vendor@example.com" },
                { term: "Address", value: "100 Example Street, Victoria, BC V8W 0A0, Canada" },
              ]}
            />
          </Region>
          <Region id="tab-text" title="Proposal text" level={3}>
            <p className="op-text">
              I will add a status page to the permit application that shows each stage in plain language, built with the
              ministry's existing React front end and tested with a screen reader at each step.
            </p>
          </Region>
          <Region id="tab-comments" title="Additional comments" level={3}>
            <p className="op-text">I am available to start on the assignment date.</p>
          </Region>
          <Region id="tab-attachments" title="Attachments" level={3}>
            <ul className="op-list">
              <li>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000901?type=blob" data-testid="attachment-download-link">
                  Download Delivery plan.pdf
                </Link>
              </li>
            </ul>
          </Region>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
