import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, OpportunityPage, PageTitle, Panel, STAFF } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// opportunity-program-select · default — a public sector employee choosing a program (R-1.7, R-1.8, R-1.12, R-1.13)
// The one-line program descriptions are placeholder copy; the spec does not carry them.
const meta: Meta = { title: "opportunities/opportunity-program-select/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const programs = [
  {
    slug: "code-with-us",
    name: "Code With Us",
    description: "One well-defined piece of work, paid as a fixed reward to the developer or team whose proposal is chosen.",
    maxBudget: "Up to $70,000",
  },
  {
    slug: "sprint-with-us",
    name: "Sprint With Us",
    description: "A team works in phases on a larger service, chosen through questions, a code challenge and a team scenario.",
    maxBudget: "Up to $5,000,000",
  },
  {
    slug: "team-with-us",
    name: "Team With Us",
    description: "Specialists join a government team for a set time, chosen through questions and a challenge.",
    maxBudget: "No upper limit",
  },
];

// The three programs are equal choices, so none of their links is the screen's primary action.
export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <OpportunityPage>
        <PageTitle>Create an opportunity</PageTitle>
        <p className="op-text">
          Choose the program the opportunity belongs to. The program cannot be changed once the opportunity is created.
        </p>
        {programs.map((p) => (
          <Panel key={p.slug} as="section" id={`program-${p.slug}`} title={p.name} testId="program-card">
            <p className="op-text">{p.description}</p>
            <p className="op-text">
              Maximum budget: <span data-testid="program-max-budget">{p.maxBudget}</span>
            </p>
            <Actions>
              <Link href={`/opportunities/${p.slug}/create`} isButton buttonVariant="secondary" data-testid={`program-choose-${p.slug}`}>
                Create a {p.name} opportunity
              </Link>
            </Actions>
          </Panel>
        ))}
      </OpportunityPage>
    </SitePage>
  ),
};
