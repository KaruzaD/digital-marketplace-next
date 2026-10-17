import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Form, Link, TextArea } from "@bcgov/design-system-react-components";
import { Stack } from "./layout";
import { ADMIN, ActionBar, Actions, Details, OpportunityHead, OpportunityPage, Region, SectionTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-swu-edit · addenda-tab — the addenda so far, and a new one being added; an addendum is permanent and
// notifies watchers, proponents and the author (R-1.32, R-1.35)
const meta: Meta = { title: "opportunities/opportunity-swu-edit/addenda-tab", parameters: { viewport: { options: WIDTHS } } };
export default meta;

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

export const AddendaTab: StoryObj = {
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
        <ActionBar>
          <Button variant="secondary" data-testid="opportunity-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="opportunity-cancel-button">Cancel opportunity</Button>
        </ActionBar>
        <nav className="op-tabs" aria-label="Opportunity sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.tab}>
                <Link href={`${base}?tab=${t.tab}`} aria-current={t.tab === "addenda" ? "page" : undefined} data-testid={t.testId}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Region id="tab-heading" title="Addenda">
          <article className="op-region" aria-labelledby="addendum-1">
            <SectionTitle level={3} id="addendum-1">Addendum of September 20, 2026</SectionTitle>
            <p className="op-note">Added by Test Public Servant</p>
            <p className="op-text">The team scenario will be held by video, not in person.</p>
          </article>
          <Form validationBehavior="aria">
            <Stack gap="medium">
              <TextArea label="New addendum" isRequired maxLength={5000} description="Up to 5,000 characters." data-testid="addendum-text-field" />
              <p className="op-text">
                An addendum cannot be changed or removed once it is added. Everyone watching this opportunity, everyone who has
                submitted a proposal, and its author will be emailed.
              </p>
              <Actions>
                <Button type="submit" variant="primary" data-testid="addendum-add-button">Add addendum</Button>
              </Actions>
            </Stack>
          </Form>
        </Region>
      </OpportunityPage>
    </SitePage>
  ),
};
