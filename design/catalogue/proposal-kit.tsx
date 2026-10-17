import { useEffect, useRef, type ReactNode } from "react";
import { ButtonGroup, Form, Heading, Link, Text } from "@bcgov/design-system-react-components";
import { Label, PROGRAM_NAMES, type LabelColour, type Program } from "./marketplace";
import { OpportunityPage, PageTitle } from "./opportunity-kit";
import { useNarrow } from "./site";

// The pieces the proposal screens are put together from in the chosen direction (design/DESIGN.md, "Proposal screens
// in the chosen direction"): the proposal's head, its status label, the action bar, the tabs, the long form beside the
// opportunity summary that the Code With Us proposal form set, and the small helpers the forms share. Built on
// opportunity-kit.tsx and marketplace.tsx; this project's own compositions of design-system components and tokens,
// none of them a design-system component.

// A proposal's status in words, coloured as the direction colours status (rule 3): blue for a draft, as the Code With
// Us form's summary marks it; green once it is in (submitted) or has won (awarded); yellow while it waits on someone
// (under review at any stage, evaluated, membership pending); grey once it is out of contention without fault (not
// awarded, withdrawn) or simply holds (an active membership); red when it has been disqualified.
export function proposalColour(status: string): LabelColour {
  const word = status.toLowerCase();
  if (word.startsWith("draft")) return "blue";
  if (word.startsWith("submitted") || word.startsWith("awarded") || word.startsWith("active")) return "green";
  if (word.startsWith("not awarded") || word.startsWith("withdrawn")) return "grey";
  if (word.startsWith("disqualified")) return "red";
  return "yellow";
}

// The status label. It carries `proposal-status` wherever a proposal's status is shown; a status shown where the
// earlier stories carried no test ID passes `testId={undefined}` explicitly through `bare`.
export function ProposalStatus({ testId = "proposal-status", bare = false, children }: { testId?: string; bare?: boolean; children: string }) {
  return (
    <Label colour={proposalColour(children)} testId={bare ? undefined : testId}>
      {children}
    </Label>
  );
}

const css = `
.pp-tabs ul {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--layout-margin-large);
  row-gap: var(--layout-margin-small);
  border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.pp-tabs li { display: flex; padding-block: var(--layout-padding-small); }
.pp-tabs a.bcds-react-aria-Link { font: var(--typography-regular-small-body); }
.pp-tabs li:has(> a[aria-current="page"]) {
  box-shadow: inset 0 calc(-1 * var(--layout-border-width-large)) 0 var(--surface-color-primary-default);
}
.pp-tabs a[aria-current="page"] { font-weight: var(--typography-font-weights-bold); }
.pp-rows {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.pp-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-primary);
}
.pp-row > * { margin: var(--layout-margin-none); }
.pp-row-name { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-small); font: var(--typography-bold-small-body); }
.pp-row-error { flex-basis: 100%; }
.pp-cluster { display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--layout-margin-small); }
.pp-cluster > * { margin: var(--layout-margin-none); }
.op-regions .pp-cluster > .bcds-react-aria-Select { flex: 1 1 240px; width: auto; }
.pp-group-error > p,
.op-regions :is(.op-region, .op-panel, .op-fieldset-body, .pf-part, .pf-intro) > div > p { margin: var(--layout-margin-none); }
.op-region > [data-testid="proposal-score-actions"]:empty { display: contents; }
.pp-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.pp-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
.pp-dialog { display: flex; flex-direction: column; gap: var(--layout-margin-medium); padding: var(--layout-padding-large); }
.pp-dialog > * { margin: var(--layout-margin-none); }
.pp-dialog .bcds-react-aria-TextArea, .pp-dialog .bcds-react-aria-NumberField { width: 100%; }

.pf-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--layout-margin-xxxlarge);
  align-items: start;
}
.pf-main, .pf-intro, .pf-part, .pf-side, .pf-summary, .pf-actions { display: flex; flex-direction: column; }
.pf-main > *, .pf-intro > *, .pf-part > *, .pf-side > *, .pf-summary > * { margin: var(--layout-margin-none); }
.pf-main { gap: var(--layout-margin-xlarge); }
.pf-intro { gap: var(--layout-margin-medium); }
.pf-part { gap: var(--layout-margin-large); }
.pf-heading { font: var(--typography-bold-h3); color: var(--typography-color-primary); }
.pf-part-title { font: var(--typography-bold-h3); color: var(--typography-color-primary); }
.pf-opportunity { font: var(--typography-regular-large-body); color: var(--typography-color-secondary); }
.pf-part .bcds-react-aria-TextField, .pf-part .bcds-react-aria-Select, .pf-part .bcds-react-aria-TextArea,
.pf-part .bcds-react-aria-NumberField { width: 100%; }
.pf-pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: var(--layout-margin-large);
  align-items: start;
}
.pf-side { position: sticky; top: var(--layout-padding-medium); }
.pf-summary {
  gap: var(--layout-margin-medium);
  padding: var(--layout-padding-large);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.pf-summary-compact { gap: var(--layout-margin-small); padding: var(--layout-padding-medium); }
.pf-labels { display: flex; flex-wrap: wrap; gap: var(--layout-margin-small); }
.pf-summary-title { font: var(--typography-bold-body); color: var(--typography-color-primary); }
.pf-summary-closes { font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.pf-summary-facts { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.pf-actions { gap: var(--layout-margin-medium); }
.pf-actions > button { width: 100%; justify-content: center; }
@media (max-width: 767.98px) {
  .pf-opportunity { font: var(--typography-regular-body); }
  .pp-cluster > button, .pf-attach > button { width: 100%; justify-content: center; }
}
@media (min-width: 768px) {
  .pf-columns { grid-template-columns: minmax(0, 1fr) 320px; }
  .pf-heading { font: var(--typography-bold-h2); }
}
`;

// A whole proposal page: the opportunity page frame with this kit's style sheet. A not-found page uses MissingPage
// from opportunity-kit.tsx instead.
export function ProposalPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

// A proposal's head: the small line saying what the page is ("Manage a Code With Us proposal", "Sprint With Us
// proposal"), the program as a grey label and the proposal's status as a coloured one, then the H1 in the design
// system's H3 size. On a manage page the H1 is the opportunity's title; on an evaluate page the proponent as this
// reader may see them.
export function ProposalHead({
  eyebrow,
  program,
  status,
  statusTestId,
  title,
}: {
  eyebrow?: string;
  program: Program;
  status?: string;
  // Left out to keep `proposal-status`; `null` for a status the earlier story carried without a test ID.
  statusTestId?: string | null;
  title: ReactNode;
}) {
  return (
    <div className="op-head">
      {eyebrow ? <p className="op-eyebrow">{eyebrow}</p> : null}
      <div className="op-labels">
        <Label>{PROGRAM_NAMES[program]}</Label>
        {status ? (
          statusTestId === null ? (
            <ProposalStatus bare>{status}</ProposalStatus>
          ) : (
            <ProposalStatus testId={statusTestId}>{status}</ProposalStatus>
          )
        ) : null}
      </div>
      <PageTitle>{title}</PageTitle>
    </div>
  );
}

// The action bar: the commands the reader is offered on this proposal in its current state, and nothing else. The
// wrapper carries `proposal-actions`, because the design system's ButtonGroup passes no `data-*` attribute; it is
// always present, and empty when nothing is offered.
export function ProposalActions({ children }: { children?: ReactNode }) {
  return (
    <div data-testid="proposal-actions">
      {children ? <ButtonGroup ariaLabel="Proposal actions">{children}</ButtonGroup> : null}
    </div>
  );
}

export type ProposalTab = {
  // The test ID's suffix: `proposal-tab-<key>`.
  key: string;
  label: string;
  // The address's query value where it is not the key (`teamQuestions` for `team-questions`).
  query?: string;
};

// The tabs of a manage or evaluate page. Each has its own address (`?tab=…`), so they are links in a navigation
// landmark, the current one marked by `aria-current="page"`, a bar and bold text, never colour alone: the same marking
// as the header's navigation and the opportunity manage page's tabs.
export function ProposalTabs({ base, current, tabs }: { base: string; current?: string; tabs: ProposalTab[] }) {
  return (
    <nav className="pp-tabs" aria-label="Proposal sections">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={`${base}?tab=${tab.query ?? tab.key}`}
              aria-current={tab.key === current ? "page" : undefined}
              data-testid={`proposal-tab-${tab.key}`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// A catalogue note: says which story holds the part of the page a dialog or refusal story trims. A build does not
// render it.
export function CatalogueNote({ children }: { children: ReactNode }) {
  return <p className="op-note">{children}</p>;
}

// A message that receives keyboard focus when it appears, so it is read out and a keyboard user starts from it.
export function Focused({ testId, id, children }: { testId?: string; id?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  return (
    <div ref={box} id={id} tabIndex={-1} className="pp-focus" data-testid={testId}>
      {children}
    </div>
  );
}

// An alert's title when the alert has content of its own. The design system's InlineAlert drops its `title` when it
// is given children, so the title is written in the alert's own title markup, which also names the alert.
export function AlertTitle({ children }: { children: ReactNode }) {
  return (
    <span className="title" id="alert-title">
      {children}
    </span>
  );
}

// A group error: a problem that belongs to a group (a phase's scrum master, the capabilities, the total cost, the
// service areas) rather than to one field. In the design system's danger text colour, linked from the error summary.
export function GroupError({ id, testId, children }: { id?: string; testId?: string; children: ReactNode }) {
  return (
    <div id={id} className="pp-group-error" data-testid={testId}>
      <Text elementType="p" size="small" color="danger">
        {children}
      </Text>
    </div>
  );
}

// One part of a long proposal form: an H2 in the design system's H3 size, numbered as the Code With Us form numbers
// its parts, its fields `large` apart.
export function FormPart({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="pf-part" aria-labelledby={id}>
      <Heading level={2} id={id} className="pf-part-title">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export type SummaryFacts = {
  program: Program;
  title: string;
  // "Closes …", read as the deadline.
  closes: string;
  // The value, location and Remote OK, in the direction's fixed order.
  facts: string[];
  // The proposal's own status once it has one (a draft, a submitted proposal being edited).
  status?: string;
};

function Summary({ summary, compact, children }: { summary: SummaryFacts; compact?: boolean; children?: ReactNode }) {
  return (
    <section
      className={`pf-summary${compact ? " pf-summary-compact" : ""}`}
      aria-label="The opportunity"
      data-testid="proposal-opportunity-summary"
    >
      <div className="pf-labels">
        <Label>{PROGRAM_NAMES[summary.program]}</Label>
        {summary.status ? <ProposalStatus bare>{summary.status}</ProposalStatus> : null}
      </div>
      {compact ? null : <p className="pf-summary-title">{summary.title}</p>}
      <p className="pf-summary-closes">Closes {summary.closes}</p>
      <p className="pf-summary-facts">{summary.facts.join(" · ")}</p>
      {children}
    </section>
  );
}

// The long proposal form beside the opportunity it is for, as the Code With Us proposal form lays it out: on a wide
// screen a 320-pixel summary stays in view beside the form and holds the actions, stacked at full width; on a narrow
// one the summary is a compact card under the head and the actions follow the form at full width. The switch is read in
// script, so each action and its test ID appear once.
export function ProposalFormPage({
  head,
  messages,
  intro,
  summary,
  actions,
  dialogs,
  children,
}: {
  // The H1 and what sits with it: the create page's title and opportunity line, or a manage page's head, details and
  // tabs.
  head: ReactNode;
  // Error summaries, refusals and notices, each focused when it appears.
  messages?: ReactNode;
  // The sentences that introduce the form.
  intro?: ReactNode;
  summary: SummaryFacts;
  // The form's buttons, the primary first.
  actions: ReactNode;
  dialogs?: ReactNode;
  children: ReactNode;
}) {
  const narrow = useNarrow();
  const actionColumn = <div className="pf-actions">{actions}</div>;
  return (
    <ProposalPage>
      <div className="pf-columns">
        <div className="pf-main">
          <div className="pf-intro">
            {head}
            {messages}
            {narrow ? <Summary summary={summary} compact /> : null}
            {intro}
          </div>
          <Form validationBehavior="aria" className="pf-main" onSubmit={(event) => event.preventDefault()}>
            {children}
            {narrow ? actionColumn : null}
          </Form>
        </div>
        {narrow ? null : (
          <aside className="pf-side" aria-label="Opportunity and actions">
            <Summary summary={summary}>{actionColumn}</Summary>
          </aside>
        )}
      </div>
      {dialogs}
    </ProposalPage>
  );
}

// The create page's head: the H1 ("Create a … proposal") in the design system's H2 size on a wide screen, as on the
// Code With Us form, and the opportunity's title beneath it.
export function CreateHead({ title, opportunity }: { title: string; opportunity: string }) {
  return (
    <>
      <Heading level={1} className="pf-heading">
        {title}
      </Heading>
      <p className="pf-opportunity">{opportunity}</p>
    </>
  );
}

// The opportunities the create stories are written against, with the title, budget and deadline the earlier stories
// gave them. Test data.
export const SWU_OPPORTUNITY: SummaryFacts = {
  program: "sprint-with-us",
  title: "Modernize the licence renewal service",
  closes: "October 16, 2026 at 4:00 p.m. Pacific time",
  facts: ["Maximum budget $1,200,000"],
};
export const TWU_OPPORTUNITY: SummaryFacts = {
  program: "team-with-us",
  title: "Data platform team",
  closes: "October 2, 2026 at 4:00 p.m. Pacific time",
  facts: ["Maximum budget $900,000"],
};

// The vendor's organizations, as the earlier stories gave them. Test data.
export const ORGANIZATIONS = [
  { id: "org-1", label: "Example Digital Ltd." },
  { id: "org-2", label: "Sample Software Co-op" },
];
