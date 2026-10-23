import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Form, TextArea } from "@bcgov/design-system-react-components";
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

// opportunity-cwu-edit · addenda-tab — the addenda so far, and a new one being added; an addendum is permanent and
// notifies watchers, proponents and the author (R-1.32, R-1.35)
const meta: Meta = { title: "opportunities/opportunity-cwu-edit/addenda-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/code-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000101/edit";

export const AddendaTab: StoryObj = {
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
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <ManageTabs
          base={base}
          current="addenda"
          tabs={[
            { key: "summary", label: "Summary" },
            { key: "opportunity", label: "Opportunity" },
            { key: "addenda", label: "Addenda" },
            { key: "history", label: "History" },
          ]}
        />
        <Region id="tab-heading" title="Addenda">
          <article className="op-region" aria-labelledby="addendum-1">
            <SectionTitle level={3} id="addendum-1">Addendum of September 20, 2026</SectionTitle>
            <p className="op-note">Added by Test Public Servant</p>
            <p className="op-text">The kick-off meeting will be held by video, not in person.</p>
          </article>
          <Form validationBehavior="aria" className="op-region">
            <TextArea label="New addendum" isRequired maxLength={5000} description="Up to 5,000 characters." data-testid="addendum-text-field" />
            <p className="op-text">
              An addendum cannot be changed or removed once it is added. Everyone watching this opportunity, everyone who has
              submitted a proposal, and its author will be emailed.
            </p>
            <Actions>
              <Button type="submit" variant="primary" data-testid="addendum-add-button">Add addendum</Button>
            </Actions>
          </Form>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
