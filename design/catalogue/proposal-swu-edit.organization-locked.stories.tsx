import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import {
  Button,
  InlineAlert,
  Link,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Text,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import { Actions, Fieldset, SectionTitle, VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  Focused,
  FormPart,
  ORGANIZATIONS,
  ProposalFormPage,
  ProposalHead,
  ProposalTabs,
  SWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · organization-locked — a submitted proposal was edited to name a different organization, and the
// save was refused. The field's description said so beforehand; the refusal is its error. On a draft or a withdrawn
// proposal the same change is accepted (R-2.22)
const meta: Meta = { title: "proposals/proposal-swu-edit/organization-locked", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000211";

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;

// Illustrative only: the chosen organization's people the team-member choice offers. A person whose invitation is
// still unanswered is offered marked pending (R-2.18); nobody already named in the phase is offered again.
const choices = [
  { id: "u-v-3", label: "Test Developer Two" },
  { id: "u-v-5", label: "Test Candidate (membership pending)" },
];

const phases = [
  {
    key: "prototype",
    legend: "Prototype phase",
    dates: "November 2, 2026 to January 29, 2027. Maximum budget $400,000.",
    members: ["Test Vendor", "Test Developer One"],
    scrum: "Test Vendor",
    capabilities: "Agile coaching, User research, Frontend development and Backend development: held.",
    cost: 300000,
    max: "$400,000",
  },
  {
    key: "implementation",
    legend: "Implementation phase",
    dates: "February 1, 2027 to September 30, 2027. Maximum budget $850,000.",
    members: ["Test Vendor", "Test Developer One", "Test Designer"],
    scrum: "Test Vendor",
    capabilities: "Agile coaching, Backend development, Frontend development, User research and Security engineering: held.",
    cost: 850000,
    max: "$850,000",
  },
];

export const OrganizationLocked: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalFormPage
        head={
          <>
            <ProposalHead
              eyebrow="Manage a Sprint With Us proposal"
              program="sprint-with-us"
              status="Submitted"
              title="Modernize the licence renewal service"
            />
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
        summary={{ ...SWU_OPPORTUNITY, status: "Submitted" }}
        actions={
          <>
            <Button type="submit" variant="primary" size="medium" data-testid="proposal-save-changes">Save changes</Button>
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
            Name a team for each phase this opportunity has, and choose one scrum master in each. Everyone you name must be an
            active member of the organization.
          </p>
          {phases.map((phase) => (
            <Fieldset key={phase.key} legend={phase.legend} testId="proposal-phase-team">
              <p className="op-note">{phase.dates}</p>
              <ul className="pp-rows" aria-label={`${phase.legend} team`}>
                {phase.members.map((member) => (
                  <li key={member} className="pp-row">
                    <span className="pp-row-name">{member}</span>
                    <Button variant="tertiary" size="small" aria-label={`Remove ${member} from the ${phase.legend.toLowerCase()}`}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <RadioGroup
                label={`Scrum master for the ${phase.legend.toLowerCase()}`}
                isRequired
                defaultValue={phase.scrum}
                orientation="vertical"
              >
                {phase.members.map((member) => (
                  <Radio key={member} value={member} data-testid="proposal-scrum-master">
                    {member}
                  </Radio>
                ))}
              </RadioGroup>
              <div className="pp-cluster">
                <Select
                  label={`Team member to add to the ${phase.legend.toLowerCase()}`}
                  items={choices}
                  data-testid="proposal-team-member-choice"
                />
                <Button
                  variant="secondary"
                  aria-label={`Add team member to the ${phase.legend.toLowerCase()}`}
                  data-testid="proposal-add-team-member"
                >
                  Add team member
                </Button>
              </div>
              <div data-testid="proposal-phase-requirements">
                <Text elementType="p" size="small">
                  This phase&rsquo;s team meets its requirements. {phase.capabilities}
                </Text>
              </div>
              <div data-testid="proposal-cost">
                <NumberField
                  id={`proposal-${phase.key}-cost`}
                  label={`Proposed cost for the ${phase.legend.toLowerCase()}`}
                  isRequired
                  description={`Up to the phase's maximum budget of ${phase.max}.`}
                  formatOptions={currency}
                  defaultValue={phase.cost}
                  data-testid="proposal-phase-cost-field"
                />
              </div>
            </Fieldset>
          ))}
        </FormPart>

        <FormPart id="form-capabilities" title="3. Capabilities">
          <p className="op-text">Between them, your phase teams must cover every capability this opportunity requires.</p>
          <ul className="op-list">
            <li>Agile coaching: covered</li>
            <li>Backend development: covered</li>
            <li>Frontend development: covered</li>
            <li>User research: covered</li>
            <li>Security engineering: covered</li>
          </ul>
        </FormPart>

        <FormPart id="form-cost" title="4. Cost">
          <div role="status" data-testid="proposal-cost">
            <p className="op-text">Total proposed cost: $1,150,000 of the $1,200,000 maximum budget.</p>
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
              defaultValue="We moved a permit service to a new platform in stages."
              data-testid="proposal-question-response-field"
            />
            <div role="status">
              <p className="op-note">10 of 500 words</p>
            </div>
          </Fieldset>
        </FormPart>

        <FormPart id="form-references" title="6. References">
          <Fieldset legend="Reference 1">
            <TextField label="Name" defaultValue="Test Reference One" />
            <TextField label="Email address" type="email" defaultValue="test.reference@example.com" />
            <TextField label="Phone number (optional)" type="tel" />
            <div>
              <Button variant="tertiary" size="small">Remove reference 1</Button>
            </div>
          </Fieldset>
          <div className="pf-attach">
            <Button variant="secondary" data-testid="proposal-add-reference">Add a reference</Button>
          </div>
        </FormPart>

        <FormPart id="form-attachments" title="7. Attachments">
          <p className="op-text">
            Anyone who can read this proposal can read its attachments. Attachments are checked even when you save a draft.
            Removing an attachment stops it being readable through this proposal once you save.
          </p>
          <ul className="pp-rows" data-testid="attachment-list">
            <li className="pp-row" data-testid="attachment-existing-row">
              <TextField
                label="Attachment name"
                value="Delivery approach.pdf"
                isReadOnly
                description="Already stored, so its name cannot be changed."
                data-testid="attachment-existing-name"
              />
              <Actions>
                <Link href="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000911?type=blob" data-testid="attachment-download-link">
                  Download Delivery approach.pdf
                </Link>
                <Button variant="secondary" size="small" aria-label="Remove Delivery approach.pdf" data-testid="attachment-remove-button">
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
