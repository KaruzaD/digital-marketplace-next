import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import { Button, Link, NumberField, Select, TextArea } from "@bcgov/design-system-react-components";
import { Fieldset, VENDOR } from "./opportunity-kit";
import { CreateHead, FormPart, ORGANIZATIONS, ProposalFormPage, TWU_OPPORTUNITY } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-create · default — a vendor bids for an organization they own or administer, naming team members
// against the opportunity's resources, each with an hourly rate. The estimated cost over the contract is shown as the
// rates change, and each resource question has its word limit stated (R-2.1, R-2.10, R-2.12, R-2.17, R-2.20, R-2.21)
const meta: Meta = { title: "proposals/proposal-twu-create/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const rate = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

// Illustrative only: the chosen organization's active members the team-member choice offers. Nobody already named is
// offered again, and nobody whose membership is still pending is offered.
const choices = [
  { id: "u-v-1", label: "Test Vendor" },
  { id: "u-v-4", label: "Test Designer" },
];

const resources = [
  { number: 1, legend: "Resource 1: Full stack developer, 100% of full time", member: "Test Developer One", rateId: "proposal-resource-1-rate-one", rate: 150 },
  { number: 2, legend: "Resource 2: Data professional, 50% of full time", member: "Test Developer Two", rateId: "proposal-resource-2-rate-two", rate: 140 },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Team With Us proposal" opportunity={TWU_OPPORTUNITY.title} />}
        intro={
          <>
            <p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>
            <p className="op-text">
              <Link href="/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301">View the opportunity</Link>
            </p>
          </>
        }
        summary={TWU_OPPORTUNITY}
        actions={
          <>
            <Button variant="primary" size="medium" data-testid="proposal-submit">Submit proposal</Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-draft">Save draft</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-organization" title="1. Organization">
          <Select
            id="proposal-organization"
            label="Organization"
            isRequired
            description="Organizations you own or administer. It must be a qualified supplier for Team With Us, and provide every service area this opportunity needs, before you submit."
            items={ORGANIZATIONS}
            defaultValue="org-1"
            data-testid="proposal-organization-field"
          />
        </FormPart>

        <FormPart id="form-team" title="2. Team">
          <p className="op-text">
            Name at least one team member against this opportunity's resources, with an hourly rate for each. Everyone you name
            must be an active member of the organization, and no one may be named twice.
          </p>
          {resources.map((resource) => (
            <Fieldset key={resource.number} legend={resource.legend}>
              <ul className="pp-rows" aria-label={`Resource ${resource.number} team`}>
                <li className="pp-row">
                  <span className="pp-row-name">{resource.member}</span>
                  <NumberField
                    id={resource.rateId}
                    label={`Hourly rate for ${resource.member}`}
                    isRequired
                    description="At least $1."
                    formatOptions={rate}
                    defaultValue={resource.rate}
                    data-testid="proposal-hourly-rate-field"
                  />
                  <Button
                    variant="tertiary"
                    size="small"
                    aria-label={`Remove ${resource.member} from resource ${resource.number}`}
                  >
                    Remove
                  </Button>
                </li>
              </ul>
              <div className="pp-cluster">
                <Select
                  label={`Team member to add to resource ${resource.number}`}
                  items={choices}
                  data-testid="proposal-team-member-choice"
                />
                <Button
                  variant="secondary"
                  aria-label={`Add team member to resource ${resource.number}`}
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
            Each hourly rate is applied at its resource's target allocation across the contract, from November 2, 2026 to October
            29, 2027. The total must not be more than the opportunity's maximum budget.
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
          </p>
          <p className="op-text">No attachments have been added.</p>
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
          You will be asked to accept the terms and conditions when you submit. You can withdraw a submitted proposal at any time.
        </p>
      </ProposalFormPage>
    </SitePage>
  ),
};
