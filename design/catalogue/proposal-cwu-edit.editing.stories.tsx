import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, Link, Radio, RadioGroup, TextArea, TextField } from "@bcgov/design-system-react-components";
import { Actions, Details, VENDOR } from "./opportunity-kit";
import { FormPart, ProposalFormPage, ProposalHead, ProposalTabs, type SummaryFacts } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-edit · editing — Edit was pressed on a draft. The Proposal tab becomes the create page's form, filled
// in, with the attachments already stored: each can be downloaded or removed, and more can be added. An invalid save is
// shown exactly as in proposal-cwu-create · invalid (R-2.12, R-2.13, R-2.14)
const meta: Meta = { title: "proposals/proposal-cwu-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000111";

// The opportunity this proposal is for, as the manage page's other stories give it. Test data.
const OPPORTUNITY: SummaryFacts = {
  program: "code-with-us",
  title: "Build an accessible permit tracker",
  closes: "October 2, 2026 at 4:00 p.m. Pacific time",
  facts: [],
  status: "Draft",
};

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalFormPage
        head={
          <>
            <ProposalHead
              eyebrow="Manage a Code With Us proposal"
              program="code-with-us"
              status="Draft"
              title="Build an accessible permit tracker"
            />
            <Details
              items={[
                { term: "Proposal ID", value: "3f8a2c10-6d4b-4e19-a7c5-000000000111", testId: "proposal-identifier" },
                { term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" },
              ]}
            />
            <ProposalTabs
              base={`${base}/edit`}
              current="proposal"
              tabs={[
                { key: "proposal", label: "Proposal" },
                { key: "history", label: "History" },
              ]}
            />
          </>
        }
        intro={<p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>}
        summary={OPPORTUNITY}
        actions={
          <>
            <Button type="submit" variant="primary" size="medium" data-testid="proposal-save-and-submit">
              Save changes and submit
            </Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-changes">Save changes</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel-edit">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-proponent" title="1. Proponent">
          <RadioGroup id="proposal-proponent-type" label="Who is submitting this proposal?" isRequired defaultValue="individual">
            <Radio value="individual" data-testid="proposal-proponent-individual">An individual</Radio>
            <Radio value="organization" data-testid="proposal-proponent-organization">An organization</Radio>
          </RadioGroup>
          <TextField id="proposal-legal-name" label="Legal name" isRequired defaultValue="Test Vendor" data-testid="proposal-legal-name-field" />
          <div className="pf-pair">
            <TextField
              id="proposal-email"
              label="Email address"
              type="email"
              isRequired
              defaultValue="test.vendor@example.com"
              data-testid="proposal-email-field"
            />
            <TextField id="proposal-phone" label="Phone number (optional)" type="tel" data-testid="proposal-phone-field" />
          </div>
          <TextField id="proposal-street" label="Street address" isRequired defaultValue="100 Example Street" data-testid="proposal-street-field" />
          <TextField id="proposal-street-2" label="Street address line 2 (optional)" data-testid="proposal-street-2-field" />
          <div className="pf-pair">
            <TextField id="proposal-city" label="City" isRequired defaultValue="Victoria" data-testid="proposal-city-field" />
            <TextField id="proposal-region" label="Province or state" isRequired defaultValue="BC" data-testid="proposal-region-field" />
          </div>
          <div className="pf-pair">
            <TextField id="proposal-postal" label="Postal code" isRequired defaultValue="V8W 0A0" data-testid="proposal-postal-field" />
            <TextField id="proposal-country" label="Country" isRequired defaultValue="Canada" data-testid="proposal-country-field" />
          </div>
        </FormPart>

        <FormPart id="form-proposal" title="2. Proposal">
          <TextArea
            id="proposal-text"
            label="Proposal"
            isRequired
            maxLength={10000}
            description="Between 1 and 10,000 characters."
            defaultValue="I will add a status page to the permit application that shows each stage in plain language."
            data-testid="proposal-text-field"
          />
          <TextArea
            id="proposal-comments"
            label="Additional comments (optional)"
            maxLength={10000}
            description="Up to 10,000 characters."
            defaultValue="I am available to start on the assignment date."
            data-testid="proposal-comments-field"
          />
        </FormPart>

        <FormPart id="form-attachments" title="3. Attachments">
          <p className="op-text">
            Anyone who can read this proposal can read its attachments. Attachments are checked even when you save a draft.
            Removing an attachment stops it being readable through this proposal once you save.
          </p>
          <ul className="pp-rows" data-testid="attachment-list">
            <li className="pp-row" data-testid="attachment-existing-row">
              <TextField
                label="Attachment name"
                value="Delivery plan.pdf"
                isReadOnly
                description="Already stored, so its name cannot be changed."
                data-testid="attachment-existing-name"
              />
              <Actions>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000901?type=blob" data-testid="attachment-download-link">
                  Download Delivery plan.pdf
                </Link>
                <Button variant="secondary" size="small" aria-label="Remove Delivery plan.pdf" data-testid="attachment-remove-button">
                  Remove
                </Button>
              </Actions>
            </li>
          </ul>
          <div id="attachment-size-limit" data-testid="attachment-size-limit">
            <p className="op-note">Any type of file, up to 10 MB each.</p>
          </div>
          <div className="pf-attach">
            <FileTrigger>
              <Button variant="secondary" aria-describedby="attachment-size-limit" data-testid="attachment-add-button">
                Add attachment
              </Button>
            </FileTrigger>
          </div>
        </FormPart>

        <p className="op-text">
          Save changes keeps this proposal as a draft. Save changes and submit asks you to accept the terms and conditions.
        </p>
      </ProposalFormPage>
    </SitePage>
  ),
};
