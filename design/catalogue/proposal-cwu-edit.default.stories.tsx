import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Link } from "@bcgov/design-system-react-components";
import { Actions, Details, Region, VENDOR } from "./opportunity-kit";
import { ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-edit · default — the vendor's own submitted proposal, before the deadline. They may edit it or withdraw
// it, and no score or rank is shown until the opportunity is awarded (R-2.23, R-2.24, R-2.32, R-2.37)
const meta: Meta = { title: "proposals/proposal-cwu-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Code With Us proposal"
          program="code-with-us"
          status="Submitted"
          title="Build an accessible permit tracker"
        />
        <Details
          items={[
            { term: "Submitted", value: "September 15, 2026 at 2:12 p.m.", testId: "proposal-submitted-at" },
            { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111", testId: "proposal-identifier" },
            { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" },
            { term: "Proposal deadline", value: "October 2, 2026 at 4:00 p.m. Pacific time" },
          ]}
        />
        <Actions>
          <Link href="/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101">View the opportunity</Link>
          <Link href={`${base}/export`} data-testid="proposal-export-link">Printable copy</Link>
        </Actions>
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <ProposalTabs
          base={`${base}/edit`}
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
