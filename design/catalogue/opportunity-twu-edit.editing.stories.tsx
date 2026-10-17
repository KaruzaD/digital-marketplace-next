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
import {
  ADMIN,
  ActionBar,
  Actions,
  Details,
  Fieldset,
  OpportunityHead,
  OpportunityPage,
  Region,
  SectionTitle,
} from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · editing — an administrator editing a published opportunity's details; saving records a new
// version and notifies watchers, proponents and the author (R-1.4, R-1.35, R-1.56). Once the opportunity exists its
// panel is changed on the Evaluation panel tab, not here. Invalid input is presented exactly as in
// opportunity-twu-create · invalid.
const meta: Meta = { title: "opportunities/opportunity-twu-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;
const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

// Illustrative only: the spec says there are five recognised service areas but does not name them.
const serviceAreas = [
  { id: "full-stack-developer", label: "Full stack developer" },
  { id: "data-professional", label: "Data professional" },
  { id: "agile-coach", label: "Agile coach" },
  { id: "devops-specialist", label: "DevOps specialist" },
  { id: "service-designer", label: "Service designer" },
];

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <OpportunityPage>
        <OpportunityHead
          eyebrow="Manage a Team With Us opportunity"
          program="team-with-us"
          status="Published"
          title="Data platform team"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", testId: "opportunity-identifier" }]}
        />
        <ActionBar />
        {/* Written out rather than with ManageTabs: the Evaluation panel tab's address (?tab=evaluationPanel) differs
            from its test ID (opportunity-tab-evaluation-panel). */}
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            <li><Link href={`${base}?tab=summary`} data-testid="opportunity-tab-summary">Summary</Link></li>
            <li><Link href={`${base}?tab=opportunity`} aria-current="page" data-testid="opportunity-tab-opportunity">Opportunity</Link></li>
            <li><Link href={`${base}?tab=addenda`} data-testid="opportunity-tab-addenda">Addenda</Link></li>
            <li><Link href={`${base}?tab=history`} data-testid="opportunity-tab-history">History</Link></li>
            <li><Link href={`${base}?tab=evaluationPanel`} data-testid="opportunity-tab-evaluation-panel">Evaluation panel</Link></li>
          </ul>
        </nav>
        <Region id="tab-heading" title="Opportunity">
          <Form validationBehavior="aria" className="op-region">
            <section className="op-panel" aria-labelledby="form-overview">
              <SectionTitle level={3} id="form-overview">Overview</SectionTitle>
              <TextField
                id="opp-title"
                label="Title"
                isRequired
                maxLength={200}
                description="Up to 200 characters."
                defaultValue="Data platform team"
                data-testid="opportunity-title-field"
              />
              <TextArea
                id="opp-teaser"
                label="Teaser (optional)"
                maxLength={500}
                description="A sentence or two shown in the opportunity list. Up to 500 characters."
                defaultValue="Add two specialists to the ministry's data platform team for a year."
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
                defaultValue="Two days a month on site."
                data-testid="opportunity-remote-description-field"
              />
            </section>
            <section className="op-panel" aria-labelledby="form-budget">
              <SectionTitle level={3} id="form-budget">Budget</SectionTitle>
              <NumberField
                id="opp-budget"
                label="Maximum budget"
                isRequired
                description="At least $1."
                formatOptions={currency}
                defaultValue={900000}
                data-testid="opportunity-budget-field"
              />
            </section>
            <section className="op-panel" aria-labelledby="form-description">
              <SectionTitle level={3} id="form-description">Description</SectionTitle>
              <TextArea
                id="opp-description"
                label="Description"
                isRequired
                maxLength={10000}
                description="Formatted text, up to 10,000 characters."
                defaultValue="The data platform team publishes open data for the ministry. Two specialists will join it for a year to move its pipelines to the new platform."
                data-testid="opportunity-description-field"
              />
            </section>
            <section className="op-panel" aria-labelledby="form-dates">
              <SectionTitle level={3} id="form-dates">Key dates</SectionTitle>
              <p className="op-text">Each date must fall on or after the one before it.</p>
              <DatePicker
                id="opp-deadline"
                label="Proposal deadline"
                isRequired
                description="Proposals close at 4:00 p.m. Pacific time on this day. It cannot be before today."
                data-testid="opportunity-deadline-field"
              />
              <DatePicker id="opp-assignment" label="Assignment date" isRequired description="On or after the proposal deadline." data-testid="opportunity-assignment-date-field" />
              <DatePicker id="opp-start" label="Start date" isRequired description="On or after the assignment date." data-testid="opportunity-start-date-field" />
              <DatePicker id="opp-completion" label="Completion date (optional)" description="On or after the start date." data-testid="opportunity-completion-date-field" />
            </section>
            <section className="op-panel" aria-labelledby="form-resources">
              <SectionTitle level={3} id="form-resources">Resources</SectionTitle>
              <p className="op-text">Each resource names one service area and how much of a full-time week it needs.</p>
              <Fieldset legend="Resource 1">
                <Select
                  id="opp-resource-1-area"
                  label="Service area"
                  isRequired
                  items={serviceAreas}
                  defaultValue="full-stack-developer"
                  data-testid="resource-service-area-field"
                />
                <NumberField
                  id="opp-resource-1-allocation"
                  label="Target allocation (% of full time)"
                  isRequired
                  description="Between 1 and 100."
                  defaultValue={100}
                  data-testid="resource-allocation-field"
                />
                <Actions>
                  <Button variant="tertiary" size="small">Remove resource 1</Button>
                </Actions>
              </Fieldset>
              <Fieldset legend="Resource 2">
                <Select
                  id="opp-resource-2-area"
                  label="Service area"
                  isRequired
                  items={serviceAreas}
                  defaultValue="data-professional"
                  data-testid="resource-service-area-field"
                />
                <NumberField
                  id="opp-resource-2-allocation"
                  label="Target allocation (% of full time)"
                  isRequired
                  description="Between 1 and 100."
                  defaultValue={50}
                  data-testid="resource-allocation-field"
                />
                <Actions>
                  <Button variant="tertiary" size="small">Remove resource 2</Button>
                </Actions>
              </Fieldset>
              <Actions>
                <Button variant="secondary" data-testid="add-resource-button">Add a resource</Button>
              </Actions>
            </section>
            <section className="op-panel" aria-labelledby="form-resource-questions">
              <SectionTitle level={3} id="form-resource-questions">Resource questions</SectionTitle>
              <p className="op-text">Questions are numbered in the order they appear here. You can add up to 100.</p>
              <Fieldset legend="Question 1" testId="evaluation-question">
                <TextArea
                  id="opp-question-1"
                  label="Question"
                  isRequired
                  maxLength={1000}
                  description="Up to 1,000 characters."
                  defaultValue="Describe a data pipeline you moved to a new platform."
                  data-testid="question-text-field"
                />
                <TextArea
                  id="opp-question-1-guideline"
                  label="Guideline for evaluators"
                  isRequired
                  maxLength={1000}
                  description="What a strong answer covers. Up to 1,000 characters."
                  defaultValue="Look for a plan that kept the data available during the move."
                  data-testid="question-guideline-field"
                />
                <NumberField id="opp-question-1-score" label="Maximum score" isRequired description="At least 1." defaultValue={5} data-testid="question-score-field" />
                <NumberField id="opp-question-1-minimum" label="Minimum score (optional)" description="Lower than the maximum score." data-testid="question-minimum-score-field" />
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
                <Button variant="secondary" data-testid="add-resource-question-button">Add a resource question</Button>
              </Actions>
            </section>
            <section className="op-panel" aria-labelledby="form-weights">
              <SectionTitle level={3} id="form-weights">Scoring weights</SectionTitle>
              <p className="op-text">Enter each weight as a percentage. The three weights must total 100%.</p>
              <Stack direction="row" align="end" gap="medium">
                <NumberField id="opp-weight-questions" label="Resource questions (%)" isRequired description="0 to 100." defaultValue={30} data-testid="score-weight-field" />
                <NumberField id="opp-weight-challenge" label="Challenge (%)" isRequired description="0 to 100." defaultValue={40} data-testid="score-weight-field" />
                <NumberField id="opp-weight-price" label="Price (%)" isRequired description="0 to 100." defaultValue={30} data-testid="score-weight-field" />
              </Stack>
              <div role="status">
                <p className="op-text">Total: 100%</p>
              </div>
            </section>
            <section className="op-panel" aria-labelledby="form-attachments">
              <SectionTitle level={3} id="form-attachments">Attachments</SectionTitle>
              <p className="op-text">
                Attach any documents proponents need. The accepted file types and size limit are shown when you choose a file.
              </p>
              <Actions>
                <FileTrigger>
                  <Button variant="secondary" data-testid="attachment-add-button">Add attachment</Button>
                </FileTrigger>
              </Actions>
            </section>
            <p className="op-text">
              Saving records a new version. Everyone watching this opportunity, everyone who has submitted a proposal, and its
              author will be emailed.
            </p>
            <ButtonGroup ariaLabel="Form actions">
              <Button type="submit" variant="primary" data-testid="opportunity-save-changes">Save changes</Button>
              <Button variant="secondary" data-testid="opportunity-cancel-edit">Cancel</Button>
            </ButtonGroup>
          </Form>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
