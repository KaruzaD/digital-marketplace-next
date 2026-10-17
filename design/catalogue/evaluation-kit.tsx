import { useEffect, useRef, type ReactNode } from "react";
import { ButtonGroup, InlineAlert, Link, Text } from "@bcgov/design-system-react-components";
import { Hidden, Label, PROGRAM_NAMES, type LabelColour, type Program } from "./marketplace";
import {
  ActionBar,
  Details,
  MissingPage,
  OpportunityHead,
  OpportunityPage,
  PageTitle,
  Region,
  Waiting,
  type Detail,
} from "./opportunity-kit";
import { SitePage, WIDTHS, type Section, type Viewer } from "./site";

// The pieces the evaluation screens are put together from in the chosen direction (design/DESIGN.md, "Evaluation
// screens in the chosen direction"): the shell with its viewer, the manage page's frame around a tab, the head of a
// scoring form, the rows that become stacked cards on a phone, a question's box and its proponent's response, the
// panel's member rows, the alerts, and the response reference. Built on site.tsx, marketplace.tsx and
// opportunity-kit.tsx; this project's own compositions of design-system components and tokens, none of them a
// design-system component.

export { WIDTHS };

// Who each state is seen by. The addresses are test data. The opportunity's owner is opportunity-kit.tsx's STAFF and
// an administrator its ADMIN, as on the opportunities domain's manage stories.
export const EVALUATOR: Viewer = { role: "government", email: "evaluator.one@example.test" };
export const EVALUATOR_TWO: Viewer = { role: "government", email: "evaluator.two@example.test" };
export const UNRELATED_STAFF: Viewer = { role: "government", email: "staff.two@example.test" };

// The evaluator's own user identifier, which is also the chair's: Test Evaluator One evaluates and chairs.
export const ME = "5e0f7a10-2c3d-4e5f-8a9b-000000000402";

export type Question = { n: number; text: string; max: number; min: number; response: string };
export type Scored = { score: number; notes: string };

// What differs between the two programs (design/DESIGN.md, "Domain: evaluation", the table under R-5.36), and the
// stories' record text for each. Every name, question, response, score and comment is test data.
export type EvaluationProgram = {
  key: "swu" | "twu";
  program: Program;
  name: string;
  title: string;
  opportunityId: string;
  // "team-questions" or "resource-questions" in a scoring form's address.
  segment: string;
  // "team question(s)" or "resource question(s)" in the words.
  question: string;
  questions: string;
  Questions: string;
  proposalIds: [string, string, string];
  // How many proponents finalizing carries forward, and the stage it carries them into.
  carried: string;
  next: string;
  Next: string;
  // The manage page's tabs as the owner and an administrator see them from closing on.
  stageTabs: Tab[];
  items: [Question, Question];
  // Test Evaluator One's scores for the proponent on the scoring forms, Test Evaluator Two's, and the agreed ones.
  mine: [Scored, Scored];
  theirs: [Scored, Scored];
  agreed: [Scored, Scored];
  // The four comments the response references show, by question order.
  requestNotes: [string, string, string, string];
  consensusNotes: [string, string, string, string];
};

export type Tab = { query: string; testId: string; label: string };

const COMMON_TABS: Tab[] = [
  { query: "summary", testId: "opportunity-tab-summary", label: "Summary" },
  { query: "opportunity", testId: "opportunity-tab-opportunity", label: "Opportunity" },
  { query: "addenda", testId: "opportunity-tab-addenda", label: "Addenda" },
  { query: "history", testId: "opportunity-tab-history", label: "History" },
];
const PANEL_TAB: Tab = { query: "evaluationPanel", testId: "opportunity-tab-evaluation-panel", label: "Evaluation panel" };
const CONSENSUS_TAB: Tab = { query: "consensus", testId: "opportunity-tab-consensus", label: "Consensus" };
const INSTRUCTIONS_TAB: Tab = { query: "instructions", testId: "opportunity-tab-instructions", label: "Instructions" };
const EVALUATION_TAB: Tab = { query: "evaluation", testId: "opportunity-tab-evaluation", label: "Evaluation" };

// The tabs each viewer is offered (design/DESIGN.md, "Domain: evaluation", "Who sees which tabs"). The owner of a
// published opportunity sees the panel beside the opportunity's own tabs; from closing the stage tabs and Consensus
// join them. An evaluator sees Instructions and Evaluation, and the chair who evaluates adds Consensus once the
// opportunity reaches it.
export const TABS = {
  published: [...COMMON_TABS, PANEL_TAB],
  evaluator: [INSTRUCTIONS_TAB, EVALUATION_TAB],
  chair: [INSTRUCTIONS_TAB, EVALUATION_TAB, CONSENSUS_TAB],
};

export const SWU: EvaluationProgram = {
  key: "swu",
  program: "sprint-with-us",
  name: "Sprint With Us",
  title: "Modernize the licence renewal service",
  opportunityId: "7c1e2d40-5b1a-4c2e-9d3f-000000000201",
  segment: "team-questions",
  question: "team question",
  questions: "team questions",
  Questions: "Team questions",
  proposalIds: [
    "3b8d6f20-1a2b-4c3d-8e9f-000000000611",
    "3b8d6f20-1a2b-4c3d-8e9f-000000000612",
    "3b8d6f20-1a2b-4c3d-8e9f-000000000613",
  ],
  carried: "four",
  next: "code challenge",
  Next: "Code Challenge",
  stageTabs: [
    ...COMMON_TABS,
    { query: "proposals", testId: "opportunity-tab-proposals", label: "Proposals" },
    { query: "teamQuestions", testId: "opportunity-tab-team-questions", label: "Team questions" },
    { query: "codeChallenge", testId: "opportunity-tab-code-challenge", label: "Code challenge" },
    { query: "teamScenario", testId: "opportunity-tab-team-scenario", label: "Team scenario" },
    PANEL_TAB,
    CONSENSUS_TAB,
  ],
  items: [
    {
      n: 1,
      text: "Describe how your team would approach user research for the renewal service.",
      max: 5,
      min: 3,
      response:
        "We would begin with two weeks of interviews with people renewing a licence and the staff who process renewals, then test paper prototypes with both groups before building anything.",
    },
    {
      n: 2,
      text: "Describe a time your team replaced a legacy system without interrupting service.",
      max: 10,
      min: 6,
      response:
        "We moved a permit service to a new platform in stages, running both side by side for six weeks and switching one office at a time.",
    },
  ],
  mine: [
    { score: 4, notes: "Clear plan with named methods and both user groups." },
    { score: 7.5, notes: "Staged cut-over is credible; rollback is not described." },
  ],
  theirs: [
    { score: 3.5, notes: "Sound approach, light on accessibility research." },
    { score: 8, notes: "Good evidence of running systems side by side." },
  ],
  agreed: [
    { score: 4, notes: "The panel agreed the plan is clear and covers both user groups." },
    { score: 8, notes: "The panel agreed the staged cut-over is credible." },
  ],
  requestNotes: [
    "Clear plan with named methods.",
    "(empty)",
    "Staged cut-over is credible.",
    "References are recent and relevant.",
  ],
  consensusNotes: [
    "Clear plan covering both user groups.",
    "Credible staged cut-over.",
    "Strong delivery record.",
    "References are recent and relevant.",
  ],
};

export const TWU: EvaluationProgram = {
  key: "twu",
  program: "team-with-us",
  name: "Team With Us",
  title: "Data platform team",
  opportunityId: "7c1e2d40-5b1a-4c2e-9d3f-000000000301",
  segment: "resource-questions",
  question: "resource question",
  questions: "resource questions",
  Questions: "Resource questions",
  proposalIds: [
    "3b8d6f20-1a2b-4c3d-8e9f-000000000621",
    "3b8d6f20-1a2b-4c3d-8e9f-000000000622",
    "3b8d6f20-1a2b-4c3d-8e9f-000000000623",
  ],
  carried: "three",
  next: "challenge",
  Next: "Challenge",
  stageTabs: [
    ...COMMON_TABS,
    { query: "proposals", testId: "opportunity-tab-proposals", label: "Proposals" },
    { query: "resourceQuestions", testId: "opportunity-tab-resource-questions", label: "Resource questions" },
    { query: "challenge", testId: "opportunity-tab-challenge", label: "Challenge" },
    PANEL_TAB,
    CONSENSUS_TAB,
  ],
  items: [
    {
      n: 1,
      text: "Describe how you would join an existing data platform team and start contributing.",
      max: 5,
      min: 3,
      response:
        "In the first week I would pair with each engineer on the team, read the runbooks, and take one small operational ticket end to end.",
    },
    {
      n: 2,
      text: "Describe a time you improved the reliability of a data pipeline.",
      max: 10,
      min: 6,
      response:
        "I added idempotent loads and alerting on late partitions to a nightly pipeline, which cut missed reports from several a month to none.",
    },
  ],
  mine: [
    { score: 4, notes: "Concrete first-week plan that respects the existing team." },
    { score: 8, notes: "Measured outcome and a specific technique." },
  ],
  theirs: [
    { score: 3.5, notes: "Good plan, but says little about on-call." },
    { score: 7, notes: "Strong example; scale of the pipeline unclear." },
  ],
  agreed: [
    { score: 4, notes: "The panel agreed the first-week plan is concrete." },
    { score: 7.5, notes: "The panel agreed the example is strong and measured." },
  ],
  requestNotes: [
    "Strong data engineering background.",
    "(empty)",
    "Relevant platform experience.",
    "References are recent and relevant.",
  ],
  consensusNotes: [
    "Strong data engineering background.",
    "Relevant platform experience.",
    "Clear plan for knowledge transfer.",
    "References are recent and relevant.",
  ],
};

// Addresses on the opportunity's pages.
export const manageBase = (p: EvaluationProgram) => `/opportunities/${p.program}/${p.opportunityId}/edit`;
export const proposalBase = (p: EvaluationProgram, index: 0 | 1 | 2) =>
  `/opportunities/${p.program}/${p.opportunityId}/proposals/${p.proposalIds[index]}/${p.segment}`;
export const individualStatus = (p: EvaluationProgram) => `${p.Questions}: individual evaluation`;
export const consensusStatus = (p: EvaluationProgram) => `${p.Questions}: consensus`;

// An evaluation's or a consensus's state in words, coloured as the direction colours status (rule 3): grey before it
// is begun, blue while it is a draft (as a draft proposal is marked), green once it is submitted. Whether a draft is
// complete is in its words, never in its colour alone.
export function evaluationColour(status: string): LabelColour {
  const word = status.toLowerCase();
  if (word.startsWith("draft")) return "blue";
  if (word.startsWith("submitted")) return "green";
  return "grey";
}

export function EvaluationStatus({ testId, children }: { testId?: string; children: string }) {
  return (
    <Label colour={evaluationColour(children)} testId={testId}>
      {children}
    </Label>
  );
}

// The rows list's columns follow the width of the list itself (a container query), as the opportunity rows do: from
// 560 pixels the row's cells sit in aligned columns under a header line; narrower, each row is a stacked card whose
// cells are labelled by their column's name. The header line is hidden from assistive technology, because each cell
// carries its column's name in text that is visually hidden in the column layout. No token carries a container width.
const css = `
.ev-rows {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.ev-rows > *, .ev-row > *, .ev-cell > *, .ev-member > *, .ev-member-body > *, .ev-cluster > *, .ev-response > *,
.ev-body > *, .ev-error > *, .ev-alert > * {
  margin: var(--layout-margin-none);
}
.ev-caption { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.ev-rows-head { display: none; }
.ev-rows-list {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.ev-row {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-xsmall);
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-primary);
}
.ev-cell { display: flex; flex-wrap: wrap; align-items: center; column-gap: var(--layout-margin-small); min-width: 0; overflow-wrap: anywhere; }
.ev-cell-lead { font: var(--typography-bold-small-body); }
.ev-cell a.bcds-react-aria-Link { font: inherit; }
.ev-term { color: var(--typography-color-secondary); }
@container (min-width: 560px) {
  .ev-rows-head, .ev-row {
    display: grid;
    column-gap: var(--layout-margin-medium);
    align-items: start;
  }
  .ev-rows-head {
    padding-inline: calc(var(--layout-padding-medium) + var(--layout-border-width-small));
    font: var(--typography-bold-small-body);
    color: var(--typography-color-secondary);
  }
  .ev-cols-2 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .ev-cols-3 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); }
  .ev-cols-scores { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr); }
  .ev-term {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

.ev-member {
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-small) var(--layout-padding-medium) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.ev-member > legend { padding-inline: var(--layout-padding-small); font: var(--typography-bold-small-body); color: var(--typography-color-primary); }
.ev-member-body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--layout-margin-small) var(--layout-margin-medium);
}
.ev-member-name { font: var(--typography-bold-small-body); color: var(--typography-color-primary); overflow-wrap: anywhere; }
.ev-member-email { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.ev-cluster { display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--layout-margin-small); }
.op-regions .ev-cluster > .bcds-react-aria-Select { flex: 1 1 240px; width: auto; }
.ev-response {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-small);
  border-inline-start: var(--layout-border-width-medium) solid var(--surface-color-border-medium);
}
.ev-body { display: flex; flex-direction: column; gap: var(--layout-margin-medium); }
.ev-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.ev-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
.ev-dialog-text { margin: var(--layout-margin-none); font: var(--typography-regular-body); color: var(--typography-color-primary); }
@media (max-width: 767.98px) {
  .ev-cluster > button { width: 100%; justify-content: center; }
}
`;

// A whole evaluation screen: the site's shell with the person the state is seen by and the section the page belongs
// to (none for a response reference), the opportunity page frame, and this kit's style sheet.
export function EvaluationPage({
  viewer,
  current,
  testId,
  children,
}: {
  viewer: Viewer;
  current?: Section;
  testId?: string;
  children: ReactNode;
}) {
  return (
    <SitePage viewer={viewer} current={current}>
      <OpportunityPage testId={testId}>
        <style>{css}</style>
        {children}
      </OpportunityPage>
    </SitePage>
  );
}

// The users domain's missing page, inside the shell, seen by the person the refusal is about. It belongs to no
// section of the navigation.
export function EvaluationMissing({ viewer }: { viewer: Viewer }) {
  return (
    <SitePage viewer={viewer}>
      <MissingPage />
    </SitePage>
  );
}

// A wait: the page's H1 at once, then the loading status beside a spinner.
export function EvaluationLoading({ viewer, title, label }: { viewer: Viewer; title: string; label: string }) {
  return (
    <EvaluationPage viewer={viewer} current="dashboard">
      <PageTitle>{title}</PageTitle>
      <Waiting label={label} />
    </EvaluationPage>
  );
}

// The manage page around one of this domain's tabs, drawn as the opportunities domain draws it: the head ("Manage a …
// opportunity", the grey program label, the coloured status label, the title as the H1), the Opportunity ID, the
// action bar (always present, empty when nothing is offered), the tabs, then the tab's own region. The tabs are
// written out rather than drawn with ManageTabs because several addresses' query values differ from their test IDs'
// suffixes (?tab=evaluationPanel is opportunity-tab-evaluation-panel); the markup, look and behaviour are ManageTabs'.
export function ManageFrame({
  p,
  status,
  tabs,
  current,
  actions,
  messages,
  title,
  children,
}: {
  p: EvaluationProgram;
  status: string;
  tabs: Tab[];
  current: string;
  actions?: ReactNode;
  // A page alert that belongs above the tab's region (a refusal from the action bar).
  messages?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  const base = manageBase(p);
  return (
    <>
      <OpportunityHead eyebrow={`Manage a ${p.name} opportunity`} program={p.program} status={status} title={p.title} />
      <Details items={[{ term: "Opportunity ID", value: p.opportunityId, testId: "opportunity-identifier" }]} />
      <ActionBar>{actions}</ActionBar>
      <nav className="op-tabs" aria-label="Opportunity sections">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.query}>
              <Link
                href={`${base}?tab=${tab.query}`}
                aria-current={tab.query === current ? "page" : undefined}
                data-testid={tab.testId}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {messages}
      <Region id="tab-heading" title={title}>
        {children}
      </Region>
    </>
  );
}

// The head of a scoring form: what the page is, the program and the evaluation's status as labels, the proponent's
// anonymous name as the H1, then the opportunity's title and the proponent's place in the order as small facts.
export function ScoringHead({
  eyebrow,
  p,
  status,
  statusTestId,
  name,
  place,
}: {
  eyebrow: string;
  p: EvaluationProgram;
  status?: string;
  statusTestId?: string;
  name: string;
  // "Proponent 2 of 3"; left out where the earlier story showed neither the title nor the place.
  place?: string;
}) {
  return (
    <div className="op-head">
      <p className="op-eyebrow">{eyebrow}</p>
      <div className="op-labels">
        <Label>{PROGRAM_NAMES[p.program]}</Label>
        {status ? <EvaluationStatus testId={statusTestId}>{status}</EvaluationStatus> : null}
      </div>
      <PageTitle>
        <span data-testid="proposal-proponent-name">{name}</span>
      </PageTitle>
      {place ? (
        <ul className="op-facts">
          <li>{p.title}</li>
          <li>{place}</li>
        </ul>
      ) : null}
    </div>
  );
}

export type Cell = { content: ReactNode; testId?: string };
export type Row = { key: string; testId?: string; cells: Cell[] };

// Rows that sit in aligned columns where the list is wide and become stacked cards on a phone (rule 7). The first
// column is the row's lead (a proponent, a person) and needs no label; any column named in `unlabelled` (an action
// link that says what it does) carries none either.
export function Rows({
  captionId,
  caption,
  columns,
  layout,
  testId,
  unlabelled = [],
  rows,
}: {
  captionId: string;
  caption: string;
  columns: string[];
  layout: "ev-cols-2" | "ev-cols-3" | "ev-cols-scores";
  testId?: string;
  unlabelled?: string[];
  rows: Row[];
}) {
  return (
    <div className="ev-rows">
      <p className="ev-caption" id={captionId}>
        {caption}
      </p>
      <div className={`ev-rows-head ${layout}`} aria-hidden="true">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <ul className="ev-rows-list" aria-labelledby={captionId} data-testid={testId}>
        {rows.map((row) => (
          <li key={row.key} className={`ev-row ${layout}`} data-testid={row.testId}>
            {row.cells.map((cell, index) => {
              const column = columns[index];
              const lead = index === 0;
              const labelled = !lead && !unlabelled.includes(column);
              return (
                <div key={column} className={`ev-cell${lead ? " ev-cell-lead" : ""}`}>
                  {labelled ? (
                    <span className="ev-term">
                      {column}
                      <Hidden>: </Hidden>
                    </span>
                  ) : null}
                  {cell.testId ? <span data-testid={cell.testId}>{cell.content}</span> : cell.content}
                </div>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

// One question of a scoring form: a fieldset whose legend names the question, its contents `medium` apart.
export function QuestionBox({ n, children }: { n: number; children: ReactNode }) {
  return (
    <fieldset className="op-fieldset" id={`question-${n}`}>
      <legend>Question {n}</legend>
      <div className="op-fieldset-body">{children}</div>
    </fieldset>
  );
}

export function QuestionText({ q }: { q: Question }) {
  return <p className="op-text">{q.text}</p>;
}

export function QuestionWorth({ q }: { q: Question }) {
  return (
    <p className="op-note">
      Worth up to {q.max} points. The minimum score to move on is {q.min}.
    </p>
  );
}

// The proponent's words, set apart from the question and from the evaluator's own fields by a rule at their start. The
// design system's Callout is an emphasis box with its own title and icon; a quotation needs no emphasis.
export function Response({ name, q }: { name: string; q: Question }) {
  return (
    <div className="ev-response" data-testid="evaluation-question-response">
      <p className="op-note">{name}'s response</p>
      <p className="op-text">{q.response}</p>
    </div>
  );
}

// Every evaluator's own score and comment for one question, beside their names (R-5.28).
export function PanelScores({ p, q }: { p: EvaluationProgram; q: Question }) {
  const index = q.n - 1;
  const panel = [
    { who: "Test Evaluator One", ...p.mine[index] },
    { who: "Test Evaluator Two", ...p.theirs[index] },
  ];
  return (
    <Rows
      captionId={`question-${q.n}-panel-caption`}
      caption={`Evaluators' scores for question ${q.n}`}
      columns={["Evaluator", "Score", "Comment"]}
      layout="ev-cols-scores"
      rows={panel.map((entry) => ({
        key: entry.who,
        cells: [
          { content: entry.who },
          { content: `${entry.score} out of ${q.max}`, testId: "evaluation-panel-member-score" },
          { content: entry.notes, testId: "evaluation-panel-member-notes" },
        ],
      }))}
    />
  );
}

// A form's save row: the design system's ButtonGroup, named for what it saves.
export function SaveRow({ label, children }: { label: string; children: ReactNode }) {
  return <ButtonGroup ariaLabel={label}>{children}</ButtonGroup>;
}

// A message that receives keyboard focus when it appears, so it is read out and a keyboard user starts from it.
export function Focused({ testId, children }: { testId?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  return (
    <div ref={box} tabIndex={-1} className="ev-focus ev-alert" data-testid={testId}>
      {children}
    </div>
  );
}

// A refusal from the service, in a danger alert that takes focus. The wrapper carries the test ID, because
// InlineAlert passes no `data-*` attribute.
export function Refusal({ testId, title, description }: { testId?: string; title: string; description: string }) {
  return (
    <Focused testId={testId}>
      <InlineAlert variant="danger" role="alert" title={title} description={description} />
    </Focused>
  );
}

// A notice that explains the state the page is in. The wrapper carries the test ID.
export function Notice({ testId, title, description }: { testId?: string; title: string; description: string }) {
  return (
    <div className="ev-alert" data-testid={testId}>
      <InlineAlert variant="info" title={title} description={description} />
    </div>
  );
}

export type Problem = { href: string; testId: string; text: string };

// An error summary: a danger alert that takes focus, its title in the alert's own title markup (the design system's
// InlineAlert drops `title` when it has content of its own; site shell gap 4), the sentence on what happened, and a
// link to each problem, each inside a `field-error` item.
export function ErrorSummary({ title, lead, problems }: { title: string; lead: string; problems: Problem[] }) {
  return (
    <Focused>
      <InlineAlert variant="danger" role="alert">
        <span className="title" id="alert-title">
          {title}
        </span>
        <p>{lead}</p>
        <ul className="ev-errors">
          {problems.map((problem) => (
            <li key={problem.text} data-testid="field-error">
              <Link href={problem.href} data-testid={problem.testId}>
                {problem.text}
              </Link>
            </li>
          ))}
        </ul>
      </InlineAlert>
    </Focused>
  );
}

// A problem that belongs to a group or a row rather than to one field, in the design system's danger text colour.
export function GroupError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div id={id} className="ev-error">
      <Text elementType="p" size="small" color="danger">
        {children}
      </Text>
    </div>
  );
}

// The response reference: the small line saying the address answers with data, the H1 (the surface's title), then the
// Request and Answer regions whose pairs are Details. An ordered answer (scores, comments, a panel) is an `op-list`
// inside its value, carrying the test ID.
export function Reference({
  viewer,
  title,
  idBase,
  requestTitle,
  request,
  answer,
}: {
  viewer: Viewer;
  title: string;
  idBase: string;
  requestTitle: "Request" | "Requests";
  request: Detail[];
  answer: Detail[];
}) {
  return (
    <EvaluationPage viewer={viewer}>
      <div className="op-head">
        <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
        <PageTitle>{title}</PageTitle>
      </div>
      <Region id={`${idBase}-requests`} title={requestTitle}>
        <Details items={request} />
      </Region>
      <Region id={`${idBase}-answer`} title="Answer">
        <Details items={answer} />
      </Region>
    </EvaluationPage>
  );
}

// An ordered answer, one item per question or member.
export function Ordered({ testId, items }: { testId: string; items: (string | number)[] }) {
  return (
    <ol className="op-list" data-testid={testId}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}
