import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link, NumberField, Select, Text, TextArea } from "@bcgov/design-system-react-components";
import { Fieldset, VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  CatalogueNote,
  CreateHead,
  Focused,
  FormPart,
  GroupError,
  ORGANIZATIONS,
  ProposalFormPage,
  TWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-create · invalid — submitted with problems: an organization that does not provide a service area the
// opportunity needs, an hourly rate below $1, the same person named twice, and an empty response. A proposal with no
// team members is refused with "Name at least one team member." in the Team section's place (R-2.17, R-2.18, R-2.20,
// R-2.21)
const meta: Meta = { title: "proposals/proposal-twu-create/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const rate = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

// Illustrative only: the chosen organization's active members the team-member choice offers. Nobody whose membership is
// still pending is offered.
const choices = [
  { id: "u-v-1", label: "Test Vendor" },
  { id: "u-v-4", label: "Test Designer" },
];

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Team With Us proposal" opportunity={TWU_OPPORTUNITY.title} />}
        messages={
          <Focused>
            <InlineAlert variant="danger" role="alert">
              <AlertTitle>This proposal has 4 problems</AlertTitle>
              <ul className="pp-errors">
                <li data-testid="field-error">
                  <Link href="#proposal-organization">Organization: the selected organization does not satisfy this opportunity's service areas</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-resource-1-rate-one">Resource 1: enter an hourly rate of at least $1</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-resource-2-rate-one">Resource 2: Please select unique team members.</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-question-1">Question 1: enter a response</Link>
                </li>
              </ul>
            </InlineAlert>
          </Focused>
        }
        intro={
          <>
            <p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>
            <CatalogueNote>The cost and the attachments are as in the default story and are trimmed here.</CatalogueNote>
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
            isInvalid
            errorMessage="The selected organization does not satisfy this opportunity's service areas."
            data-testid="proposal-organization-field"
          />
          <GroupError id="proposal-service-area-message" testId="proposal-service-area-error">
            Example Digital Ltd. does not provide Data professional, which resource 2 needs.
          </GroupError>
        </FormPart>

        <FormPart id="form-team" title="2. Team">
          <p className="op-text">
            Name at least one team member against this opportunity's resources, with an hourly rate for each. Everyone you name
            must be an active member of the organization, and no one may be named twice.
          </p>
          <Fieldset legend="Resource 1: Full stack developer, 100% of full time">
            <ul className="pp-rows" aria-label="Resource 1 team">
              <li className="pp-row">
                <span className="pp-row-name">Test Developer One</span>
                <NumberField
                  id="proposal-resource-1-rate-one"
                  label="Hourly rate for Test Developer One"
                  isRequired
                  description="At least $1."
                  formatOptions={rate}
                  defaultValue={0}
                  isInvalid
                  errorMessage="Enter an hourly rate of at least $1"
                  data-testid="proposal-hourly-rate-field"
                />
                <Button variant="tertiary" size="small" aria-label="Remove Test Developer One from resource 1">
                  Remove
                </Button>
              </li>
            </ul>
            <div className="pp-cluster">
              <Select label="Team member to add to resource 1" items={choices} data-testid="proposal-team-member-choice" />
              <Button variant="secondary" aria-label="Add team member to resource 1" data-testid="proposal-add-team-member">
                Add team member
              </Button>
            </div>
          </Fieldset>
          <Fieldset legend="Resource 2: Data professional, 50% of full time">
            <ul className="pp-rows" aria-label="Resource 2 team">
              <li className="pp-row">
                <span className="pp-row-name">Test Developer Two</span>
                <NumberField
                  id="proposal-resource-2-rate-two"
                  label="Hourly rate for Test Developer Two"
                  isRequired
                  description="At least $1."
                  formatOptions={rate}
                  defaultValue={140}
                  data-testid="proposal-hourly-rate-field"
                />
                <Button variant="tertiary" size="small" aria-label="Remove Test Developer Two from resource 2">
                  Remove
                </Button>
              </li>
              <li className="pp-row">
                <span className="pp-row-name">Test Developer One</span>
                <div className="pp-row-error">
                  <Text elementType="p" size="small" color="danger">
                    Please select unique team members.
                  </Text>
                </div>
                <NumberField
                  id="proposal-resource-2-rate-one"
                  label="Hourly rate for Test Developer One"
                  isRequired
                  description="At least $1."
                  formatOptions={rate}
                  defaultValue={140}
                  data-testid="proposal-hourly-rate-field"
                />
                <Button variant="tertiary" size="small" aria-label="Remove Test Developer One from resource 2">
                  Remove
                </Button>
              </li>
            </ul>
            <div className="pp-cluster">
              <Select label="Team member to add to resource 2" items={choices} data-testid="proposal-team-member-choice" />
              <Button variant="secondary" aria-label="Add team member to resource 2" data-testid="proposal-add-team-member">
                Add team member
              </Button>
            </div>
          </Fieldset>
        </FormPart>

        <FormPart id="form-questions" title="4. Resource questions">
          <Fieldset legend="Question 1">
            <p className="op-text">Describe your experience building data pipelines for health data.</p>
            <TextArea
              id="proposal-question-1"
              label="Response to question 1"
              isRequired
              description="Up to 300 words."
              defaultValue=""
              isInvalid
              errorMessage="Enter a response to question 1"
              data-testid="proposal-question-response-field"
            />
            <div role="status">
              <p className="op-note">0 of 300 words</p>
            </div>
          </Fieldset>
        </FormPart>
      </ProposalFormPage>
    </SitePage>
  ),
};
