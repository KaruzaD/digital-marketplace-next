import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, InlineAlert, Link, NumberField, Select, TextArea, TextField } from "@bcgov/design-system-react-components";
import { Actions, Fieldset, SectionTitle, VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  Focused,
  FormPart,
  ORGANIZATIONS,
  ProposalFormPage,
  ProposalHead,
  ProposalTabs,
  TWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-edit · organization-locked — a submitted proposal was edited to name a different organization, and the
// save was refused. The field's description said so beforehand; the refusal is its error. On a draft or a withdrawn
// proposal the same change is accepted (R-2.22)
const meta: Meta = { title: "proposals/proposal-twu-edit/organization-locked", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000311";

const rate = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

// Illustrative only: the chosen organization's active members the team-member choice offers. Only active members are
// offered, and nobody already named is offered again.
const choices = [
  { id: "u-v-1", label: "Test Vendor" },
  { id: "u-v-4", label: "Test Designer" },
];

const resources = [
  { n: 1, legend: "Resource 1: Full stack developer, 100% of full time", member: "Test Developer One", id: "proposal-resource-1-rate-one", rate: 150 },
  { n: 2, legend: "Resource 2: Data professional, 50% of full time", member: "Test Developer Two", id: "proposal-resource-2-rate-two", rate: 140 },
];

export const OrganizationLocked: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalFormPage
        head={
          <>
            <ProposalHead eyebrow="Manage a Team With Us proposal" program="team-with-us" status="Submitted" title="Data platform team" />
            <ProposalTabs
              base={`${base}/edit`}
              current="proposal"
              tabs={[
                { key: "proposal", label: "Proposal" },
                { key: "history", label: "History" },
              ]}
            />
            <SectionTitle id="tab-heading">Proposal</SectionTitle>
          </>
        }
        messages={
          <Focused>
            <InlineAlert variant="danger" role="alert">
              <AlertTitle>Your changes have 1 problem</AlertTitle>
              <ul className="pp-errors">
                <li data-testid="field-error">
                  <Link href="#proposal-organization">
                    Organization: Organization cannot be changed once the proposal has been submitted
                  </Link>
                </li>
              </ul>
            </InlineAlert>
          </Focused>
        }
        summary={{ ...TWU_OPPORTUNITY, status: "Submitted" }}
        actions={
          <>
            <Button variant="primary" size="medium" data-testid="proposal-save-changes">Save changes</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel-edit">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-organization" title="1. Organization">
          <Select
            id="proposal-organization"
            label="Organization"
            isRequired
            description="It cannot be changed while the proposal is submitted. Withdraw the proposal first to change it."
            items={ORGANIZATIONS}
            defaultValue="org-2"
            isInvalid
            errorMessage="Organization cannot be changed once the proposal has been submitted"
            data-testid="proposal-organization-field"
          />
        </FormPart>

        <FormPart id="form-team" title="2. Team">
          <p className="op-text">
            Name at least one team member against this opportunity's resources, with an hourly rate for each. Everyone you name
            must be an active member of the organization, and no one may be named twice.
          </p>
          {resources.map((resource) => (
            <Fieldset key={resource.n} legend={resource.legend}>
              <ul className="pp-rows" aria-label={`Resource ${resource.n} team`}>
                <li className="pp-row">
                  <span className="pp-row-name">{resource.member}</span>
                  <NumberField
                    id={resource.id}
                    label={`Hourly rate for ${resource.member}`}
                    isRequired
                    description="At least $1."
                    formatOptions={rate}
                    defaultValue={resource.rate}
                    data-testid="proposal-hourly-rate-field"
                  />
                  <Button variant="tertiary" size="small" aria-label={`Remove ${resource.member} from resource ${resource.n}`}>
                    Remove
                  </Button>
                </li>
              </ul>
              <div className="pp-cluster">
                <Select
                  label={`Team member to add to resource ${resource.n}`}
                  items={choices}
                  data-testid="proposal-team-member-choice"
                />
                <Button
                  variant="secondary"
                  aria-label={`Add team member to resource ${resource.n}`}
                  data-testid="proposal-add-team-member"
                >
                  Add team member
                </Button>
              </div>
            </Fieldset>
          ))}
        </FormPart>

        <FormPart id="form-cost" title="3. Cost">
          <p className="op-text">
            Each hourly rate is applied at its resource's target allocation across the contract, from November 2, 2026 to
            October 29, 2027. The total must not be more than the opportunity's maximum budget.
          </p>
          <div role="status">
            <p className="op-text">Estimated cost over the contract: $412,500 of the $900,000 maximum budget.</p>
          </div>
        </FormPart>

        <FormPart id="form-questions" title="4. Resource questions">
          <Fieldset legend="Question 1">
            <p className="op-text">Describe your experience building data pipelines for health data.</p>
            <TextArea
              id="proposal-question-1"
              label="Response to question 1"
              isRequired
              description="Up to 300 words."
              defaultValue="Our team has built and run the ingestion pipelines for two provincial registries."
              data-testid="proposal-question-response-field"
            />
            <div role="status">
              <p className="op-note">13 of 300 words</p>
            </div>
          </Fieldset>
        </FormPart>

        <FormPart id="form-attachments" title="5. Attachments">
          <p className="op-text">
            Anyone who can read this proposal can read its attachments. Attachments are checked even when you save a draft.
            Removing an attachment stops it being readable through this proposal once you save.
          </p>
          <ul className="pp-rows" data-testid="attachment-list">
            <li className="pp-row" data-testid="attachment-existing-row">
              <TextField
                label="Attachment name"
                value="Team profiles.pdf"
                isReadOnly
                description="Already stored, so its name cannot be changed."
                data-testid="attachment-existing-name"
              />
              <Actions>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000921?type=blob" data-testid="attachment-download-link">
                  Download Team profiles.pdf
                </Link>
                <Button variant="secondary" size="small" aria-label="Remove Team profiles.pdf" data-testid="attachment-remove-button">
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
      </ProposalFormPage>
    </SitePage>
  ),
};
