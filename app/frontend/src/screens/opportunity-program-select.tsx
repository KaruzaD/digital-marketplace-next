import { Link } from "@bcgov/design-system-react-components";
import { PROGRAM_NAMES, Program } from "@rules/opportunities";
import { Actions, OpportunityPage, PageTitle, Panel } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { StaffOnly } from "../app/staff-only";

/**
 * Create an opportunity, at `/opportunities/create` (opportunity-program-select). Public sector
 * staff and administrators choose the program the opportunity belongs to, which cannot be changed
 * afterwards (R-1.8); anybody else is shown the missing page (R-1.7).
 *
 * Drawn as the catalogue's story draws it: three equal panels, so none of their links is the
 * screen's primary action. Each panel also offers the service level agreement beside the program's
 * budget, with the same test id as the learn-more screens (R-7.18; DESIGN.md, content, "Test IDs").
 */

const PROGRAMS: readonly { slug: Program; description: string; maxBudget: string }[] = [
  {
    slug: "code-with-us",
    description: "One well-defined piece of work, paid as a fixed reward to the developer or team whose proposal is chosen.",
    maxBudget: "Up to $70,000",
  },
  {
    slug: "sprint-with-us",
    description: "A team works in phases on a larger service, chosen through questions, a code challenge and a team scenario.",
    maxBudget: "Up to $5,000,000",
  },
  {
    slug: "team-with-us",
    description: "Specialists join a government team for a set time, chosen through questions and a challenge.",
    maxBudget: "No upper limit",
  },
];

export function OpportunityProgramSelectScreen() {
  useScreenTitle("Create an opportunity");
  return <StaffOnly title="Create an opportunity">{() => <ProgramSelect />}</StaffOnly>;
}

function ProgramSelect() {
  return (
    <OpportunityPage>
      <PageTitle>Create an opportunity</PageTitle>
      <p className="op-text">
        Choose the program the opportunity belongs to. The program cannot be changed once the opportunity is created.
      </p>
      {PROGRAMS.map((program) => (
        <Panel key={program.slug} id={`program-${program.slug}`} title={PROGRAM_NAMES[program.slug]} testId="program-card">
          <p className="op-text">{program.description}</p>
          <p className="op-text">
            Maximum budget: <span data-testid="program-max-budget">{program.maxBudget}</span>
          </p>
          <p className="op-note">
            What the service commits to, and what it asks of you, is set out in the{" "}
            <Link href="/content/service-level-agreement" data-testid="service-level-agreement-link">
              service level agreement
            </Link>
            .
          </p>
          <Actions>
            <Link
              href={`/opportunities/${program.slug}/create`}
              isButton
              buttonVariant="secondary"
              data-testid={`program-choose-${program.slug}`}
            >
              {`Create a ${PROGRAM_NAMES[program.slug]} opportunity`}
            </Link>
          </Actions>
        </Panel>
      ))}
    </OpportunityPage>
  );
}
