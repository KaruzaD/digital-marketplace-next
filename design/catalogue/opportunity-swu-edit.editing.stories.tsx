import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import {
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  Link,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import { Stack } from "./layout";
import { ADMIN, ActionBar, Actions, Details, Fieldset, OpportunityHead, OpportunityPage, Panel, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · editing — an administrator editing a published opportunity's details; saving records a new
// version and notifies watchers, proponents and the author (R-1.4, R-1.35, R-1.56). Once the opportunity exists its
// panel is changed on the Evaluation panel tab, not here. Invalid input is presented exactly as in
// opportunity-swu-create · invalid.
const meta: Meta = { title: "opportunities/opportunity-swu-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;
const base = "/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/edit";

// The Evaluation panel tab's address (?tab=evaluationPanel) differs from its test ID's suffix, so the tabs are written
// in ManageTabs' markup here rather than with ManageTabs.
const tabs = [
  { tab: "summary", testId: "opportunity-tab-summary", label: "Summary" },
  { tab: "opportunity", testId: "opportunity-tab-opportunity", label: "Opportunity" },
  { tab: "addenda", testId: "opportunity-tab-addenda", label: "Addenda" },
  { tab: "history", testId: "opportunity-tab-history", label: "History" },
  { tab: "evaluationPanel", testId: "opportunity-tab-evaluation-panel", label: "Evaluation panel" },
];

// Illustrative only: the spec does not carry the service's list of skills.
const skills = [
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "accessibility", label: "Accessibility" },
  { id: "postgresql", label: "PostgreSQL" },
];

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Sprint With Us opportunity"
          program="sprint-with-us"
          status="Published"
          title="Modernize the licence renewal service"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", testId: "opportunity-identifier" }]}
        />
        {/* Nothing is offered from the action bar while the form is open. */}
        <ActionBar />
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.tab}>
                <Link href={`${base}?tab=${t.tab}`} aria-current={t.tab === "opportunity" ? "page" : undefined} data-testid={t.testId}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Region id="tab-heading" title="Opportunity">
          <Form validationBehavior="aria">
            <Stack gap="large">
              <Panel id="form-overview" title="Overview" level={3}>
                <TextField
                  id="opp-title"
                  label="Title"
                  isRequired
                  maxLength={200}
                  description="Up to 200 characters."
                  defaultValue="Modernize the licence renewal service"
                  data-testid="opportunity-title-field"
                />
                <TextArea
                  id="opp-teaser"
                  label="Teaser (optional)"
                  maxLength={500}
                  description="A sentence or two shown in the opportunity list. Up to 500 characters."
                  defaultValue="Rebuild licence renewals as an accessible, cloud-hosted service."
                  data-testid="opportunity-teaser-field"
                />
                <TextField id="opp-location" label="Location" isRequired defaultValue="Victoria" data-testid="opportunity-location-field" />
                <RadioGroup id="opp-remote" label="Is remote work acceptable?" isRequired defaultValue="yes" data-testid="opportunity-remote-field">
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </RadioGroup>
                <TextArea
                  id="opp-remote-description"
                  label="Remote work description"
                  isRequired
                  maxLength={500}
                  description="Say what remote work involves. Required when remote work is acceptable. Up to 500 characters."
                  defaultValue="The team may work remotely within Canada."
                  data-testid="opportunity-remote-description-field"
                />
              </Panel>
              <Panel id="form-budget" title="Budget and skills" level={3}>
                <NumberField
                  id="opp-budget"
                  label="Total maximum budget"
                  isRequired
                  description="Between $1 and $5,000,000."
                  formatOptions={currency}
                  defaultValue={1200000}
                  data-testid="opportunity-budget-field"
                />
                <Select
                  id="opp-skills"
                  label="Skills"
                  selectionMode="multiple"
                  isRequired
                  description="Choose at least one skill."
                  items={skills}
                  defaultValue={["react", "postgresql"]}
                  data-testid="opportunity-skills-field"
                />
              </Panel>
              <Panel id="form-description" title="Description" level={3}>
                <TextArea
                  id="opp-description"
                  label="Description"
                  isRequired
                  maxLength={10000}
                  description="Formatted text, up to 10,000 characters."
                  defaultValue="Licence holders renew on paper today. This opportunity replaces that with an online service that meets WCAG 2.1 AA, built in phases with the ministry's product team."
                  data-testid="opportunity-description-field"
                />
              </Panel>
              <Panel id="form-dates" title="Key dates" level={3}>
                <p className="op-text">Each date must fall on or after the one before it.</p>
                <DatePicker
                  id="opp-deadline"
                  label="Proposal deadline"
                  isRequired
                  description="Proposals close at 4:00 p.m. Pacific time on this day. It cannot be before today."
                  data-testid="opportunity-deadline-field"
                />
                <DatePicker
                  id="opp-assignment"
                  label="Assignment date"
                  isRequired
                  description="On or after the proposal deadline."
                  data-testid="opportunity-assignment-date-field"
                />
              </Panel>
              <Panel id="form-phases" title="Phases" level={3}>
                <p className="op-text">
                  Every Sprint With Us opportunity has an implementation phase. An inception phase can be added only together with
                  a prototype phase.
                </p>
                <Fieldset legend="Prototype phase">
                  <DatePicker id="opp-prototype-start" label="Start date" isRequired data-testid="phase-start-date-field" />
                  <DatePicker id="opp-prototype-completion" label="Completion date" isRequired data-testid="phase-completion-date-field" />
                  <Actions>
                    <Button variant="tertiary" size="small">Remove prototype phase</Button>
                  </Actions>
                </Fieldset>
                <Fieldset legend="Implementation phase">
                  <DatePicker id="opp-implementation-start" label="Start date" isRequired data-testid="phase-start-date-field" />
                  <DatePicker
                    id="opp-implementation-completion"
                    label="Completion date"
                    isRequired
                    data-testid="phase-completion-date-field"
                  />
                </Fieldset>
                <Actions>
                  <Button variant="secondary" data-testid="add-phase-button">Add an inception phase</Button>
                </Actions>
              </Panel>
              <Panel id="form-team-questions" title="Team questions" level={3}>
                <p className="op-text">Questions are numbered in the order they appear here. You can add up to 100.</p>
                <Fieldset legend="Question 1" testId="evaluation-question">
                  <TextArea
                    id="opp-question-1"
                    label="Question"
                    isRequired
                    maxLength={1000}
                    description="Up to 1,000 characters."
                    defaultValue="Describe a service your team delivered that people with disabilities rely on."
                    data-testid="question-text-field"
                  />
                  <TextArea
                    id="opp-question-1-guideline"
                    label="Guideline for evaluators"
                    isRequired
                    maxLength={1000}
                    description="What a strong answer covers. Up to 1,000 characters."
                    defaultValue="Look for evidence of testing with assistive technology."
                    data-testid="question-guideline-field"
                  />
                  <NumberField id="opp-question-1-score" label="Maximum score" isRequired description="At least 1." defaultValue={5} data-testid="question-score-field" />
                  <NumberField
                    id="opp-question-1-minimum"
                    label="Minimum score (optional)"
                    description="Lower than the maximum score."
                    defaultValue={2}
                    data-testid="question-minimum-score-field"
                  />
                  <NumberField
                    id="opp-question-1-word-limit"
                    label="Response word limit"
                    isRequired
                    description="Between 1 and 3,000 words."
                    defaultValue={500}
                    data-testid="question-word-limit-field"
                  />
                  <Actions>
                    <Button variant="tertiary" size="small">Remove question 1</Button>
                  </Actions>
                </Fieldset>
                <Actions>
                  <Button variant="secondary" data-testid="add-team-question-button">Add a team question</Button>
                </Actions>
              </Panel>
              <Panel id="form-weights" title="Scoring weights" level={3}>
                <p className="op-text">Enter each weight as a percentage. The four weights must total 100%.</p>
                <Stack direction="row" align="end" gap="medium">
                  <NumberField id="opp-weight-questions" label="Team questions (%)" isRequired description="0 to 100." defaultValue={30} data-testid="score-weight-field" />
                  <NumberField id="opp-weight-code-challenge" label="Code challenge (%)" isRequired description="0 to 100." defaultValue={30} data-testid="score-weight-field" />
                  <NumberField id="opp-weight-team-scenario" label="Team scenario (%)" isRequired description="0 to 100." defaultValue={20} data-testid="score-weight-field" />
                  <NumberField id="opp-weight-price" label="Price (%)" isRequired description="0 to 100." defaultValue={20} data-testid="score-weight-field" />
                </Stack>
                <div role="status">
                  <p className="op-text">Total: 100%</p>
                </div>
              </Panel>
              <Panel id="form-attachments" title="Attachments" level={3}>
                <p className="op-text">
                  Attach any documents proponents need. The accepted file types and size limit are shown when you choose a file.
                </p>
                <Actions>
                  <FileTrigger>
                    <Button variant="secondary" data-testid="attachment-add-button">Add attachment</Button>
                  </FileTrigger>
                </Actions>
              </Panel>
              <p className="op-text">
                Saving records a new version. Everyone watching this opportunity, everyone who has submitted a proposal, and its
                author will be emailed.
              </p>
              <ButtonGroup ariaLabel="Form actions">
                <Button type="submit" variant="primary" data-testid="opportunity-save-changes">Save changes</Button>
                <Button variant="secondary" data-testid="opportunity-cancel-edit">Cancel</Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
