import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import {
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  InlineAlert,
  Link,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import { Stack } from "./layout";
import { Actions, OpportunityPage, PageTitle, Panel, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-create · invalid — submitted for review with problems; each is named at its field and in the
// summary above the form (R-1.10, R-1.11, R-1.12)
const meta: Meta = { title: "opportunities/opportunity-cwu-create/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;

// Illustrative only: the spec does not carry the service's list of skills.
const skills = [
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "accessibility", label: "Accessibility" },
  { id: "postgresql", label: "PostgreSQL" },
];

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <PageTitle>Create a Code With Us opportunity</PageTitle>
        <p className="op-text">Required fields are needed to submit for review or publish. A draft can be saved with any of them blank.</p>
        <div tabIndex={-1}>
          <InlineAlert variant="danger" title="This opportunity has 5 problems" role="alert">
            <ul>
              <li data-testid="field-error"><Link href="#opp-title">Title: enter a title</Link></li>
              <li data-testid="field-error"><Link href="#opp-location">Location: enter a location</Link></li>
              <li data-testid="field-error"><Link href="#opp-remote-description">Remote work description: describe the remote work, because remote work is acceptable</Link></li>
              <li data-testid="field-error"><Link href="#opp-reward">Reward: enter a reward between $1 and $70,000</Link></li>
              <li data-testid="field-error"><Link href="#opp-skills">Skills: choose at least one skill</Link></li>
            </ul>
          </InlineAlert>
        </div>
        <Form validationBehavior="aria">
          <Stack gap="medium">
            <Panel id="form-overview" title="Overview">
              <TextField
                id="opp-title"
                label="Title"
                isRequired
                maxLength={200}
                description="Up to 200 characters."
                defaultValue=""
                isInvalid
                errorMessage="Enter a title"
                data-testid="opportunity-title-field"
              />
              <TextArea
                id="opp-teaser"
                label="Teaser (optional)"
                maxLength={500}
                description="A sentence or two shown in the opportunity list. Up to 500 characters."
                data-testid="opportunity-teaser-field"
              />
              <TextField id="opp-location" label="Location" isRequired defaultValue="" isInvalid errorMessage="Enter a location" data-testid="opportunity-location-field" />
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
                defaultValue=""
                isInvalid
                errorMessage="Describe the remote work, because remote work is acceptable"
                data-testid="opportunity-remote-description-field"
              />
            </Panel>
            <Panel id="form-reward" title="Reward and skills">
              <NumberField
                id="opp-reward"
                label="Reward"
                isRequired
                description="Between $1 and $70,000."
                formatOptions={currency}
                defaultValue={80000}
                isInvalid
                errorMessage="Enter a reward between $1 and $70,000"
                data-testid="opportunity-reward-field"
              />
              <Select
                id="opp-skills"
                label="Skills"
                selectionMode="multiple"
                isRequired
                description="Choose at least one skill."
                items={skills}
                isInvalid
                errorMessage="Choose at least one skill"
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
                defaultValue="The ministry runs an online permit application that tells applicants little about where their application stands."
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
              <DatePicker id="opp-start" label="Start date" isRequired description="On or after the assignment date." data-testid="opportunity-start-date-field" />
              <DatePicker id="opp-completion" label="Completion date (optional)" description="On or after the start date." data-testid="opportunity-completion-date-field" />
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
