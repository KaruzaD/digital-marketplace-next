import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import {
  Button,
  ButtonGroup,
  Checkbox,
  DatePicker,
  Form,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import { Stack } from "./layout";
import { Actions, Fieldset, OpportunityPage, PageTitle, Panel, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-create · default — a public sector employee starting a new Sprint With Us opportunity, with its
// phases, team questions, scoring weights and evaluation panel (R-1.9, R-1.13, R-1.15, R-1.16, R-1.17, R-1.48, R-1.55)
const meta: Meta = { title: "opportunities/opportunity-swu-create/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;

// Illustrative only: the spec does not carry the service's list of skills.
const skills = [
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "accessibility", label: "Accessibility" },
  { id: "postgresql", label: "PostgreSQL" },
];
const publicServants = [
  { id: "u-ps-1", label: "Test Public Servant" },
  { id: "u-ps-2", label: "Test Evaluator One" },
  { id: "u-ps-3", label: "Test Evaluator Two" },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <PageTitle>Create a Sprint With Us opportunity</PageTitle>
        <p className="op-text">Required fields are needed to submit for review or publish. A draft can be saved with any of them blank.</p>
        <Form validationBehavior="aria">
          <Stack gap="medium">
            <Panel id="form-overview" title="Overview">
              <TextField id="opp-title" label="Title" isRequired maxLength={200} description="Up to 200 characters." data-testid="opportunity-title-field" />
              <TextArea
                id="opp-teaser"
                label="Teaser (optional)"
                maxLength={500}
                description="A sentence or two shown in the opportunity list. Up to 500 characters."
                data-testid="opportunity-teaser-field"
              />
              <TextField id="opp-location" label="Location" isRequired data-testid="opportunity-location-field" />
              <RadioGroup id="opp-remote" label="Is remote work acceptable?" isRequired data-testid="opportunity-remote-field">
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
              <TextArea
                id="opp-remote-description"
                label="Remote work description"
                maxLength={500}
                description="Say what remote work involves. Required when remote work is acceptable. Up to 500 characters."
                data-testid="opportunity-remote-description-field"
              />
            </Panel>
            <Panel id="form-budget" title="Budget and skills">
              <NumberField
                id="opp-budget"
                label="Total maximum budget"
                isRequired
                description="Between $1 and $5,000,000."
                formatOptions={currency}
                data-testid="opportunity-budget-field"
              />
              <Select
                id="opp-skills"
                label="Skills"
                selectionMode="multiple"
                isRequired
                description="Choose at least one skill."
                items={skills}
                data-testid="opportunity-skills-field"
              />
            </Panel>
            <Panel id="form-description" title="Description">
              <TextArea
                id="opp-description"
                label="Description"
                isRequired
                maxLength={10000}
                description="Formatted text, up to 10,000 characters."
                data-testid="opportunity-description-field"
              />
            </Panel>
            <Panel id="form-dates" title="Key dates">
              <p className="op-text">Each date must fall on or after the one before it.</p>
              <DatePicker
                id="opp-deadline"
                label="Proposal deadline"
                isRequired
                description="Proposals close at 4:00 p.m. Pacific time on this day. It cannot be before today."
                data-testid="opportunity-deadline-field"
              />
              <DatePicker id="opp-assignment" label="Assignment date" isRequired description="On or after the proposal deadline." data-testid="opportunity-assignment-date-field" />
            </Panel>
            <Panel id="form-phases" title="Phases">
              <p className="op-text">
                Every Sprint With Us opportunity has an implementation phase. An inception phase can be added only together with a
                prototype phase.
              </p>
              <Fieldset legend="Implementation phase">
                <DatePicker id="opp-implementation-start" label="Start date" isRequired data-testid="phase-start-date-field" />
                <DatePicker id="opp-implementation-completion" label="Completion date" isRequired data-testid="phase-completion-date-field" />
              </Fieldset>
              <Actions>
                <Button variant="secondary" data-testid="add-phase-button">Add an inception phase</Button>
                <Button variant="secondary" data-testid="add-phase-button">Add a prototype phase</Button>
              </Actions>
            </Panel>
            <Panel id="form-team-questions" title="Team questions">
              <p className="op-text">Questions are numbered in the order they appear here. You can add up to 100.</p>
              <Fieldset legend="Question 1" testId="evaluation-question">
                <TextArea id="opp-question-1" label="Question" isRequired maxLength={1000} description="Up to 1,000 characters." data-testid="question-text-field" />
                <TextArea
                  id="opp-question-1-guideline"
                  label="Guideline for evaluators"
                  isRequired
                  maxLength={1000}
                  description="What a strong answer covers. Up to 1,000 characters."
                  data-testid="question-guideline-field"
                />
                <NumberField id="opp-question-1-score" label="Maximum score" isRequired description="At least 1." data-testid="question-score-field" />
                <NumberField id="opp-question-1-minimum" label="Minimum score (optional)" description="Lower than the maximum score." data-testid="question-minimum-score-field" />
                <NumberField id="opp-question-1-word-limit" label="Response word limit" isRequired description="Between 1 and 3,000 words." data-testid="question-word-limit-field" />
                <Actions>
                  <Button variant="tertiary" size="small">Remove question 1</Button>
                </Actions>
              </Fieldset>
              <Actions>
                <Button variant="secondary" data-testid="add-team-question-button">Add a team question</Button>
              </Actions>
            </Panel>
            <Panel id="form-weights" title="Scoring weights">
              <p className="op-text">Enter each weight as a percentage. The four weights must total 100%.</p>
              <Stack direction="row" align="end" gap="medium">
                <NumberField id="opp-weight-questions" label="Team questions (%)" isRequired description="0 to 100." data-testid="score-weight-field" />
                <NumberField id="opp-weight-code-challenge" label="Code challenge (%)" isRequired description="0 to 100." data-testid="score-weight-field" />
                <NumberField id="opp-weight-team-scenario" label="Team scenario (%)" isRequired description="0 to 100." data-testid="score-weight-field" />
                <NumberField id="opp-weight-price" label="Price (%)" isRequired description="0 to 100." data-testid="score-weight-field" />
              </Stack>
              <p className="op-text" role="status">Total: 0%</p>
            </Panel>
            <Panel id="form-panel" title="Evaluation panel">
              <Stack gap="medium" data-testid="evaluation-panel-editor">
                <p className="op-text">
                  Name at least two public sector employees and mark exactly one of them as chair. The panel can be changed until the
                  consensus stage begins.
                </p>
                <Fieldset legend="Panel member 1">
                  <Select label="Public sector employee" items={publicServants} isRequired />
                  <Checkbox defaultSelected>Evaluator</Checkbox>
                  <Checkbox>Chair</Checkbox>
                </Fieldset>
                <Fieldset legend="Panel member 2">
                  <Select label="Public sector employee" items={publicServants} isRequired />
                  <Checkbox defaultSelected>Evaluator</Checkbox>
                  <Checkbox>Chair</Checkbox>
                </Fieldset>
                <Actions>
                  <Button variant="secondary">Add a panel member</Button>
                </Actions>
              </Stack>
            </Panel>
            <Panel id="form-attachments" title="Attachments">
              <p className="op-text">Attach any documents proponents need. The accepted file types and size limit are shown when you choose a file.</p>
              <Actions>
                <FileTrigger>
                  <Button variant="secondary" data-testid="attachment-add-button">Add attachment</Button>
                </FileTrigger>
              </Actions>
            </Panel>
            <p className="op-text">
              Nothing is checked until you submit for review. An administrator publishes the opportunity after reviewing it.
            </p>
            <ButtonGroup ariaLabel="Opportunity actions">
              <Button variant="secondary" data-testid="opportunity-save-draft">Save draft</Button>
              <Button type="submit" variant="primary" data-testid="opportunity-submit-for-review">Submit for review</Button>
            </ButtonGroup>
          </Stack>
        </Form>
      </OpportunityPage>
    </SitePage>
  ),
};
