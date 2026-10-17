import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link, NumberField, Radio, RadioGroup, Select, Text, TextArea } from "@bcgov/design-system-react-components";
import { Fieldset, VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  CatalogueNote,
  CreateHead,
  Focused,
  FormPart,
  GroupError,
  ProposalFormPage,
  ProposalStatus,
  SWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-create · invalid — submitted with problems: a team member who is not an active member (shown as
// pending), a phase with no scrum master chosen, a phase over its budget, a capability no one covers, a total over the
// opportunity's budget, and a response over its word limit. Each is named where it happens and in the summary (R-2.18,
// R-2.19, R-2.21)
const meta: Meta = { title: "proposals/proposal-swu-create/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;

// Illustrative only: the chosen organization's people the team-member choice offers in each phase. A person whose
// invitation is still unanswered is offered marked pending (R-2.18); nobody already named in the phase is offered again.
const prototypeChoices = [
  { id: "u-v-2", label: "Test Developer One" },
  { id: "u-v-4", label: "Test Designer" },
];
const implementationChoices = [
  { id: "u-v-3", label: "Test Developer Two (membership pending)" },
  { id: "u-v-4", label: "Test Designer" },
];

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Sprint With Us proposal" opportunity={SWU_OPPORTUNITY.title} />}
        messages={
          <Focused id="proposal-error-summary">
            <InlineAlert variant="danger" role="alert">
              <AlertTitle>This proposal has 6 problems</AlertTitle>
              <ul className="pp-errors">
                <li data-testid="field-error">
                  <Link href="#proposal-prototype-team">Prototype phase: Test Developer Two is not an active member of the organization</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-implementation-scrum-error">Implementation phase: choose a scrum master</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-implementation-cost">Implementation phase: the proposed cost is more than the phase maximum of $850,000</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-capabilities-error">Capabilities: no one on your teams covers Security engineering</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-cost-error">Cost: the total proposed cost is more than the maximum budget of $1,200,000</Link>
                </li>
                <li data-testid="field-error">
                  <Link href="#proposal-question-2">Question 2: the response is longer than 500 words</Link>
                </li>
              </ul>
            </InlineAlert>
          </Focused>
        }
        intro={
          <>
            <p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>
            <CatalogueNote>
              The organization, references and attachments are as in the default story and are trimmed here.
            </CatalogueNote>
          </>
        }
        summary={SWU_OPPORTUNITY}
        actions={
          <>
            <Button
              variant="primary"
              size="medium"
              isDisabled
              aria-describedby="proposal-error-summary"
              data-testid="proposal-submit"
            >
              Submit proposal
            </Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-draft">Save draft</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-team" title="2. Team">
          <p className="op-text">
            Name a team for each phase this opportunity has, and choose one scrum master in each. Everyone you name must be an
            active member of the organization.
          </p>

          <Fieldset legend="Prototype phase" testId="proposal-phase-team">
            <p className="op-note">November 2, 2026 to January 29, 2027. Maximum budget $400,000.</p>
            <ul className="pp-rows" id="proposal-prototype-team" aria-label="Prototype phase team">
              <li className="pp-row">
                <span className="pp-row-name">Test Vendor</span>
                <Button variant="tertiary" size="small" aria-label="Remove Test Vendor from the prototype phase">
                  Remove
                </Button>
              </li>
              <li className="pp-row">
                <span className="pp-row-name">
                  Test Developer Two
                  <ProposalStatus testId="proposal-pending-team-member">Membership pending</ProposalStatus>
                </span>
                <Button variant="tertiary" size="small" aria-label="Remove Test Developer Two from the prototype phase">
                  Remove
                </Button>
                <div className="pp-row-error">
                  <Text elementType="p" size="small" color="danger">
                    User is not an active member of the organization.
                  </Text>
                </div>
              </li>
            </ul>
            <RadioGroup label="Scrum master for the prototype phase" isRequired defaultValue="Test Vendor" orientation="vertical">
              <Radio value="Test Vendor" data-testid="proposal-scrum-master">Test Vendor</Radio>
              <Radio value="Test Developer Two" data-testid="proposal-scrum-master">Test Developer Two</Radio>
            </RadioGroup>
            <div className="pp-cluster">
              <Select
                label="Team member to add to the prototype phase"
                items={prototypeChoices}
                data-testid="proposal-team-member-choice"
              />
              <Button variant="secondary" aria-label="Add team member to the prototype phase" data-testid="proposal-add-team-member">
                Add team member
              </Button>
            </div>
            <div data-testid="proposal-phase-requirements">
              <Text elementType="p" size="small">
                This phase&rsquo;s team is incomplete. Every member must be a confirmed member of the organization, not pending.
              </Text>
            </div>
            <div data-testid="proposal-cost">
              <NumberField
                id="proposal-prototype-cost"
                label="Proposed cost for the prototype phase"
                isRequired
                description="Up to the phase's maximum budget of $400,000."
                formatOptions={currency}
                defaultValue={300000}
                data-testid="proposal-phase-cost-field"
              />
            </div>
          </Fieldset>

          <Fieldset legend="Implementation phase" testId="proposal-phase-team">
            <p className="op-note">February 1, 2027 to September 30, 2027. Maximum budget $850,000.</p>
            <ul className="pp-rows" id="proposal-implementation-team" aria-label="Implementation phase team">
              <li className="pp-row">
                <span className="pp-row-name">Test Vendor</span>
                <Button variant="tertiary" size="small" aria-label="Remove Test Vendor from the implementation phase">
                  Remove
                </Button>
              </li>
              <li className="pp-row">
                <span className="pp-row-name">Test Developer One</span>
                <Button variant="tertiary" size="small" aria-label="Remove Test Developer One from the implementation phase">
                  Remove
                </Button>
              </li>
            </ul>
            <RadioGroup
              label="Scrum master for the implementation phase"
              isRequired
              isInvalid
              orientation="vertical"
              aria-describedby="proposal-implementation-scrum-error"
            >
              <Radio value="Test Vendor" data-testid="proposal-scrum-master">Test Vendor</Radio>
              <Radio value="Test Developer One" data-testid="proposal-scrum-master">Test Developer One</Radio>
            </RadioGroup>
            <GroupError id="proposal-implementation-scrum-error">Choose a scrum master for the implementation phase.</GroupError>
            <div className="pp-cluster">
              <Select
                label="Team member to add to the implementation phase"
                items={implementationChoices}
                data-testid="proposal-team-member-choice"
              />
              <Button
                variant="secondary"
                aria-label="Add team member to the implementation phase"
                data-testid="proposal-add-team-member"
              >
                Add team member
              </Button>
            </div>
            <div data-testid="proposal-phase-requirements">
              <Text elementType="p" size="small">
                This phase&rsquo;s team is incomplete. Not yet held: Security engineering.
              </Text>
            </div>
            <div data-testid="proposal-cost">
              <NumberField
                id="proposal-implementation-cost"
                label="Proposed cost for the implementation phase"
                isRequired
                description="Up to the phase's maximum budget of $850,000."
                formatOptions={currency}
                defaultValue={1000000}
                isInvalid
                errorMessage="Please enter a Proposed Cost less than or equal to 850,000."
                data-testid="proposal-phase-cost-field"
              />
            </div>
          </Fieldset>
        </FormPart>

        <FormPart id="form-capabilities" title="3. Capabilities">
          <p className="op-text">Between them, your phase teams must cover every capability this opportunity requires.</p>
          <ul className="op-list">
            <li>Agile coaching: covered</li>
            <li>Backend development: covered</li>
            <li>Frontend development: covered</li>
            <li>User research: covered</li>
            <li>Security engineering: not covered</li>
          </ul>
          <GroupError id="proposal-capabilities-error" testId="proposal-capability-gap-error">
            No one on your teams covers Security engineering. Add a team member who does.
          </GroupError>
        </FormPart>

        <FormPart id="form-cost" title="4. Cost">
          <div role="status" data-testid="proposal-cost">
            <p className="op-text">Total proposed cost: $1,300,000 of the $1,200,000 maximum budget.</p>
            <GroupError id="proposal-cost-error" testId="proposal-budget-exceeded-error">
              The proposed cost exceeds the maximum budget for this opportunity.
            </GroupError>
          </div>
        </FormPart>

        <FormPart id="form-questions" title="5. Team questions">
          <Fieldset legend="Question 1">
            <p className="op-text">Describe how your team would approach user research for the renewal service.</p>
            <TextArea
              id="proposal-question-1"
              label="Response to question 1"
              isRequired
              description="Up to 300 words."
              defaultValue="We would start with the renewal staff and the ten most common reasons a renewal is returned."
              data-testid="proposal-question-response-field"
            />
            <div role="status">
              <p className="op-note">18 of 300 words</p>
            </div>
          </Fieldset>
          <Fieldset legend="Question 2">
            <p className="op-text">Describe a time your team replaced a legacy system without interrupting service.</p>
            <TextArea
              id="proposal-question-2"
              label="Response to question 2"
              isRequired
              description="Up to 500 words."
              defaultValue="We moved a permit service to a new platform in stages, running both side by side for six weeks. (The rest of this illustrative 612-word response is not shown.)"
              isInvalid
              errorMessage="Shorten the response to 500 words or fewer. It is 612 words."
              data-testid="proposal-question-response-field"
            />
            <div role="status">
              <p className="op-note">612 of 500 words</p>
            </div>
          </Fieldset>
        </FormPart>
      </ProposalFormPage>
    </SitePage>
  ),
};
