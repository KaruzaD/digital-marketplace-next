import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Form, Link, TextArea } from "@bcgov/design-system-react-components";
import { ADMIN, ActionBar, Actions, Details, OpportunityHead, OpportunityPage, Region, SectionTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-twu-edit · addenda-tab — the addenda so far, and a new one being added; an addendum is permanent and
// notifies watchers, proponents and the author (R-1.32, R-1.35)
const meta: Meta = { title: "opportunities/opportunity-twu-edit/addenda-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const base = "/opportunities/team-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000301/edit";

export const AddendaTab: StoryObj = {
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
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        {/* Written out rather than with ManageTabs: the Evaluation panel tab's address (?tab=evaluationPanel) differs
            from its test ID (opportunity-tab-evaluation-panel). */}
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            <li><Link href={`${base}?tab=summary`} data-testid="opportunity-tab-summary">Summary</Link></li>
            <li><Link href={`${base}?tab=opportunity`} data-testid="opportunity-tab-opportunity">Opportunity</Link></li>
            <li><Link href={`${base}?tab=addenda`} aria-current="page" data-testid="opportunity-tab-addenda">Addenda</Link></li>
            <li><Link href={`${base}?tab=history`} data-testid="opportunity-tab-history">History</Link></li>
            <li><Link href={`${base}?tab=evaluationPanel`} data-testid="opportunity-tab-evaluation-panel">Evaluation panel</Link></li>
          </ul>
        </nav>
        <Region id="tab-heading" title="Addenda">
          <article className="op-region" aria-labelledby="addendum-1">
            <SectionTitle level={3} id="addendum-1">Addendum of September 20, 2026</SectionTitle>
            <p className="op-note">Added by Test Public Servant</p>
            <p className="op-text">Interviews for the challenge will be held by video.</p>
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
