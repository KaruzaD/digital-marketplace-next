import { Checkbox, InlineAlert, Link } from "@bcgov/design-system-react-components";
import type { Program } from "./marketplace";
import { Actions, Details, OpportunityHead, OpportunityPage, PageTitle, Region, SectionTitle, Waiting, type Detail } from "./opportunity-kit";

// An opportunity's public page, the same for the three programs (design/DESIGN.md, "Opportunity screens in the chosen
// direction"): the head with the facts in the fixed order, the details, the one thing the viewer can do, then the
// sections. The programs differ only in their own sections: Skills (Code With Us), Phases, Skills and the scope page
// (Sprint With Us), Resources and the terms page (Team With Us). Every record's wording is test data.

export type ViewState = "default" | "signed-out" | "author" | "awarded";

type Listing = {
  id: string;
  title: string;
  teaser: string;
  deadline: string;
  // The reward, the total maximum budget or the maximum budget.
  value: { label: string; text: string; testId: string };
  location: string;
  remote: string;
  published: string;
  description: string;
  // The program's own section after the description.
  own: { id: string; title: string; items: string[]; testId?: string };
  skills?: string[];
  // The key dates the program's page shows, each with the test ID it is read by.
  dates: Detail[];
  addendum: { date: string; text: string };
  // What the awarded story shows differently, where the program's awarded record differs from its open one.
  awarded?: { deadline: string; published: string; addendum: { date: string; text: string } };
};

const RECORDS: { [P in Program]: Listing } = {
  "code-with-us": {
    id: "7c1e2d40-5b1a-4c2e-9d3f-000000000101",
    title: "Build an accessible permit tracker",
    teaser: "Add plain-language status tracking to the online permit application.",
    deadline: "October 2, 2026 at 4:00 p.m. Pacific time",
    value: { label: "Reward", text: "$45,000", testId: "opportunity-reward" },
    location: "Victoria",
    remote: "Accepted. Work from anywhere in Canada, with one kick-off meeting by video.",
    published: "September 10, 2026",
    description:
      "The ministry runs an online permit application that tells applicants little about where their application stands. This opportunity adds a status page that works with a keyboard and a screen reader.",
    own: { id: "view-skills", title: "Skills", items: ["React", "TypeScript", "Accessibility"] },
    // The contract records that this page shows no completion date; it is read on the manage page.
    dates: [
      { term: "Assignment date", value: "October 9, 2026", testId: "opportunity-assignment-date" },
      { term: "Start date", value: "October 19, 2026", testId: "opportunity-start-date" },
    ],
    addendum: { date: "September 20, 2026", text: "The kick-off meeting will be held by video, not in person." },
  },
  "sprint-with-us": {
    id: "7c1e2d40-5b1a-4c2e-9d3f-000000000201",
    title: "Modernize the licence renewal service",
    teaser: "Rebuild licence renewals as an accessible, cloud-hosted service.",
    deadline: "October 16, 2026 at 4:00 p.m. Pacific time",
    value: { label: "Total maximum budget", text: "$1,200,000", testId: "opportunity-total-max-budget" },
    location: "Victoria",
    remote: "Accepted. The team may work remotely within Canada.",
    published: "September 10, 2026",
    description:
      "Licence holders renew on paper today. This opportunity replaces that with an online service that meets WCAG 2.1 AA, built in phases with the ministry's product team.",
    own: {
      id: "view-phases",
      title: "Phases",
      items: ["Prototype phase: November 2, 2026 to January 29, 2027", "Implementation phase: February 1, 2027 to September 30, 2027"],
      testId: "opportunity-phases",
    },
    skills: ["React", "PostgreSQL"],
    dates: [{ term: "Assignment date", value: "October 23, 2026", testId: "opportunity-assignment-date" }],
    addendum: { date: "September 20, 2026", text: "The team scenario will be held by video, not in person." },
  },
  "team-with-us": {
    id: "7c1e2d40-5b1a-4c2e-9d3f-000000000301",
    title: "Data platform team",
    teaser: "Add two specialists to the ministry's data platform team for a year.",
    deadline: "October 2, 2026 at 4:00 p.m. Pacific time",
    value: { label: "Maximum budget", text: "$900,000", testId: "opportunity-max-budget" },
    location: "Victoria",
    remote: "Accepted. Two days a month on site.",
    published: "September 10, 2026",
    description:
      "The data platform team publishes open data for the ministry. Two specialists will join it for a year to move its pipelines to the new platform.",
    // Service area names are illustrative: the spec does not name the five areas.
    own: {
      id: "view-resources",
      title: "Resources",
      items: ["Full stack developer: 100% of full time", "Data professional: 50% of full time"],
      testId: "opportunity-resources",
    },
    dates: [
      { term: "Assignment date", value: "October 9, 2026", testId: "opportunity-assignment-date" },
      { term: "Start date", value: "November 2, 2026", testId: "opportunity-start-date" },
      { term: "Completion date", value: "October 29, 2027", testId: "opportunity-completion-date" },
    ],
    addendum: { date: "September 20, 2026", text: "Interviews for the challenge will be held by video." },
    awarded: {
      deadline: "September 11, 2026 at 4:00 p.m. Pacific time",
      published: "August 14, 2026",
      addendum: { date: "August 25, 2026", text: "Interviews for the challenge will be held by video." },
    },
  },
};

const NAMES: { [P in Program]: string } = {
  "code-with-us": "Code With Us",
  "sprint-with-us": "Sprint With Us",
  "team-with-us": "Team With Us",
};

// Sprint With Us raises its own notices above the opportunity: when the signed-in vendor has already proposed, when it
// has been awarded, when nobody is signed in while it accepts proposals, and when the vendor's organizations are not
// qualified. The spec gives none of their wording; these sentences are the design's own (gap 30).
const SWU_NOTICES: Partial<Record<ViewState, string>> = {
  "signed-out": "Sign in as a vendor to submit a proposal to this opportunity.",
  awarded: "This opportunity has been awarded.",
};

export function OpportunityViewPage({ program, state }: { program: Program; state: ViewState }) {
  const record = RECORDS[program];
  const awarded = state === "awarded";
  const deadline = awarded && record.awarded ? record.awarded.deadline : record.deadline;
  const published = awarded && record.awarded ? record.awarded.published : record.published;
  const addendum = awarded && record.awarded ? record.awarded.addendum : record.addendum;
  // The awarded story is read by an administrator, who may see proposal scores, and so is shown the successful
  // proponent's contact details and score as well as the name. Anyone else is shown the name only (R-1.27).
  const namesShown = state === "author" || awarded;
  const notice = program === "sprint-with-us" ? SWU_NOTICES[state] : undefined;
  // Staff see the opportunity's stage; anyone else sees whether it is open (the opportunity list's wording).

  const details: Detail[] = [
    { term: "Remote work", value: record.remote },
    { term: "Published", value: published, testId: "opportunity-published-date" },
    ...(namesShown
      ? [
          { term: "Created by", value: "Test Public Servant", testId: "opportunity-created-by" },
          { term: "Last changed by", value: "Test Administrator", testId: "opportunity-last-changed-by" },
        ]
      : []),
    { term: "Opportunity ID", value: record.id, testId: "opportunity-identifier" },
  ];

  return (
    <OpportunityPage>
      {program === "sprint-with-us" ? (
        // Always present, so the page's own messages are read from one place, and empty when there are none.
        <div data-testid="opportunity-page-messages">
          {notice ? <InlineAlert variant="info" title={notice} /> : null}
        </div>
      ) : null}
      <OpportunityHead
        program={program}
        status={awarded ? "Awarded" : state === "author" ? "Published" : "Open"}
        title={record.title}
        closes={{ text: deadline, testId: "opportunity-proposal-deadline", closed: awarded }}
        value={record.value}
        location={record.location}
        remoteOk
        summary={record.teaser}
      />
      <Details items={details} />

      {state === "default" ? (
        <div className="op-region">
          <p className="op-note">Watching sends you an email whenever this opportunity changes.</p>
          <Checkbox data-testid="opportunity-watch-toggle">Watch this opportunity</Checkbox>
          <div role="status" />
          <Actions>
            <Link
              href={`/opportunities/${program}/${record.id}/proposals/create`}
              isButton
              buttonVariant="primary"
              data-testid="opportunity-start-proposal"
            >
              Start a proposal
            </Link>
          </Actions>
        </div>
      ) : null}
      {state === "author" ? (
        <Actions>
          <Link href={`/opportunities/${program}/${record.id}/edit`} isButton buttonVariant="secondary">
            Manage this opportunity
          </Link>
        </Actions>
      ) : null}

      {awarded ? (
        <Region id="view-award" title="Successful proponent">
          <p className="op-text" data-testid="opportunity-successful-proponent">
            Example Digital Co-operative
          </p>
          <Details
            items={[
              {
                term: "Contact",
                value: "procurement@example-coop.test, 250-555-0142",
                testId: "opportunity-successful-proponent-contact",
              },
              { term: "Score", value: "91.50%", testId: "opportunity-successful-proponent-score" },
            ]}
          />
        </Region>
      ) : null}
      {awarded ? (
        <div className="op-region">
          <p className="op-note">Watching sends you an email whenever this opportunity changes.</p>
          <Checkbox defaultSelected data-testid="opportunity-watch-toggle">
            Watch this opportunity
          </Checkbox>
          <div role="status" />
        </div>
      ) : null}

      <Region id="view-description" title="Description">
        <p className="op-text">{record.description}</p>
      </Region>
      <Region id={record.own.id} title={record.own.title} testId={record.own.testId}>
        <ul className="op-list">
          {record.own.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Region>
      {record.skills ? (
        <Region id="view-skills" title="Skills">
          <ul className="op-list">
            {record.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </Region>
      ) : null}
      {program === "sprint-with-us" ? (
        // The service's own page at "sprint-with-us-opportunity-scope", embedded as it is held.
        <Region id="view-scope" title="Scope" testId="opportunity-scope">
          <p className="op-text">[The Sprint With Us opportunity scope page, as the service holds it.]</p>
        </Region>
      ) : null}
      <Region id="view-dates" title="Key dates">
        <Details items={record.dates} />
      </Region>
      <Region id="view-addenda" title="Addenda" testId="opportunity-addenda">
        <article className="op-region" aria-labelledby="addendum-1">
          <SectionTitle level={3} id="addendum-1">
            Addendum of {addendum.date}
          </SectionTitle>
          <p className="op-text">{addendum.text}</p>
        </article>
      </Region>
      {program === "team-with-us" ? (
        // The service's own page at "team-with-us-terms-and-conditions", embedded as it is held.
        <Region id="view-terms" title="Terms and Conditions" testId="opportunity-terms">
          <p className="op-text">[The Team With Us terms and conditions page, as the service holds it.]</p>
        </Region>
      ) : null}
    </OpportunityPage>
  );
}

// The opportunity has not arrived yet. The page's name is already readable.
export function OpportunityViewLoading({ program }: { program: Program }) {
  return (
    <OpportunityPage>
      <PageTitle>{NAMES[program]} opportunity</PageTitle>
      <Waiting label="Loading opportunity" />
    </OpportunityPage>
  );
}
