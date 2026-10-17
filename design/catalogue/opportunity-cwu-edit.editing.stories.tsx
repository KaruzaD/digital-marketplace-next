import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileTrigger } from "react-aria-components";
import {
  Button,
  ButtonGroup,
  DatePicker,
  Form,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import {
  ADMIN,
  ActionBar,
  Actions,
  Details,
  ManageTabs,
  OpportunityHead,
  OpportunityPage,
  Region,
  SectionTitle,
} from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-cwu-edit · editing — an administrator editing a published opportunity's details; saving records a new
// version and notifies watchers, proponents and the author (R-1.4, R-1.35, R-1.56). Invalid input is presented exactly
// as in opportunity-cwu-create · invalid.
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const currency = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;
const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit";

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
          eyebrow="Manage a Code With Us opportunity"
          program="code-with-us"
          status="Published"
          title="Build an accessible permit tracker"
        />
        <Details
          items={[{ term: "Opportunity ID", value: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", testId: "opportunity-identifier" }]}
        />
        <ActionBar />
        <ManageTabs
          base={base}
          current="opportunity"
          tabs={[
            { key: "summary", label: "Summary" },
            { key: "opportunity", label: "Opportunity" },
            { key: "addenda", label: "Addenda" },
            { key: "history", label: "History" },
          ]}
        />
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
                defaultValue="Build an accessible permit tracker"
                data-testid="opportunity-title-field"
              />
              <TextArea
                id="opp-teaser"
                label="Teaser (optional)"
                maxLength={500}
                description="A sentence or two shown in the opportunity list. Up to 500 characters."
                defaultValue="Add plain-language status tracking to the online permit application."
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
                defaultValue="Work from anywhere in Canada, with one kick-off meeting by video."
                data-testid="opportunity-remote-description-field"
              />
            </section>
            <section className="op-panel" aria-labelledby="form-reward">
              <SectionTitle level={3} id="form-reward">Reward and skills</SectionTitle>
              <NumberField
                id="opp-reward"
                label="Reward"
                isRequired
                description="Between $1 and $70,000."
                formatOptions={currency}
                defaultValue={45000}
                data-testid="opportunity-reward-field"
              />
              <Select
                id="opp-skills"
                label="Skills"
                selectionMode="multiple"
                isRequired
                description="Choose at least one skill."
                items={skills}
                defaultValue={["react", "typescript", "accessibility"]}
                data-testid="opportunity-skills-field"
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
                defaultValue="The ministry runs an online permit application that tells applicants little about where their application stands. This opportunity adds a status page that works with a keyboard and a screen reader."
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
