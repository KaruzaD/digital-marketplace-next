import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { ButtonGroup, Form, Heading, Link, Text } from "@bcgov/design-system-react-components";
import { PROGRAM_NAMES, Program } from "@rules/opportunities";
import { Label, type LabelColour } from "./marketplace";
import { OpportunityPage, PageTitle } from "./opportunity-kit";
import { useNarrow } from "./site-header";

/**
 * The pieces the proposal screens are put together from, as `design/catalogue/proposal-kit.tsx`
 * draws them (design/DESIGN.md, "Proposal screens in the chosen direction"): the proposal's head,
 * its status label, the action bar, the tabs, the long form beside the opportunity summary, and
 * the small helpers the forms share. Built on the opportunity kit and the direction's label; this
 * project's own compositions of design-system components and tokens, none of them a design-system
 * component.
 *
 * As with the opportunity kit, the frame does not wrap itself in the page container, which the
 * root layout already puts round every screen (decision record 0069).
 */

/**
 * A proposal's status in words, coloured as the direction colours status: blue for a draft, green
 * once it is in or has won, yellow while it waits on someone, grey once it is out of contention
 * without fault, red when it has been disqualified.
 */
export function proposalColour(status: string): LabelColour {
  const word = status.toLowerCase();
  if (word.startsWith("draft")) return "blue";
  if (word.startsWith("submitted") || word.startsWith("awarded") || word.startsWith("active")) return "green";
  if (word.startsWith("not awarded") || word.startsWith("withdrawn")) return "grey";
  if (word.startsWith("disqualified")) return "red";
  return "yellow";
}

/** The status label, always in words. It carries `proposal-status` unless `bare`. */
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
.pf-text { font: var(--typography-regular-body); color: var(--typography-color-primary); }
.pf-part .bcds-react-aria-TextField, .pf-part .bcds-react-aria-Select, .pf-part .bcds-react-aria-TextArea,
.pf-part .bcds-react-aria-NumberField { width: 100%; }
.pf-proposal textarea { min-height: 300px; }
.pf-comments textarea { min-height: 120px; }
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
  .pf-text { font: var(--typography-regular-small-body); }
  .pp-cluster > button, .pf-attach > button { width: 100%; justify-content: center; }
}
@media (min-width: 768px) {
  .pf-columns { grid-template-columns: minmax(0, 1fr) 320px; }
  .pf-heading { font: var(--typography-bold-h2); }
}
`;

/** This kit's style sheet, for a piece drawn outside a proposal page. */
export function ProposalStyles() {
  return <style>{css}</style>;
}

/** A whole proposal screen: the opportunity page frame with this kit's style sheet. */
export function ProposalPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <ProposalStyles />
      {children}
    </OpportunityPage>
  );
}

/**
 * A proposal's head: the small line saying what the page is, the program as a grey label and the
 * proposal's status as a coloured one, then the H1 in the design system's H3 size.
 */
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
  /** Left out to keep `proposal-status`; `null` for a status the stories draw without a test ID (a printable copy). */
  statusTestId?: string | null;
  title: ReactNode;
}) {
  return (
    <div className="op-head">
      {eyebrow ? <p className="op-eyebrow">{eyebrow}</p> : null}
      <div className="op-labels">
        <Label>{PROGRAM_NAMES[program]}</Label>
        {status ? statusTestId === null ? <ProposalStatus bare>{status}</ProposalStatus> : <ProposalStatus testId={statusTestId}>{status}</ProposalStatus> : null}
      </div>
      <PageTitle>{title}</PageTitle>
    </div>
  );
}

/**
 * The action bar: the commands the reader is offered on this proposal in its current state. The
 * wrapper carries `proposal-actions`, because the design system's ButtonGroup passes no `data-*`
 * attribute; it is always present, and empty when nothing is offered.
 */
export function ProposalActions({ children }: { children?: ReactNode }) {
  return <div data-testid="proposal-actions">{children ? <ButtonGroup ariaLabel="Proposal actions">{children}</ButtonGroup> : null}</div>;
}

export type ProposalTab = {
  /** The test ID's suffix: `proposal-tab-<key>`. */
  key: string;
  label: string;
  /** The address's query value where it is not the key (`teamQuestions` for `team-questions`). */
  query?: string;
};

/**
 * The tabs of a manage or evaluate page. Each has its own address (`?tab=…`), so they are links
 * in a navigation landmark, the current one marked by `aria-current="page"`, a bar and bold text.
 */
export function ProposalTabs({ base, current, tabs }: { base: string; current: string; tabs: readonly ProposalTab[] }) {
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

/** A message that takes keyboard focus when it appears, so it is read out and a keyboard user starts from it. */
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

/**
 * An alert's title when the alert has content of its own: the design system's InlineAlert drops
 * its `title` when it is given children, so the title is written in the alert's own title markup.
 */
export function AlertTitle({ children }: { children: ReactNode }) {
  return (
    <span className="title" id="alert-title">
      {children}
    </span>
  );
}

/** A problem that belongs to a group rather than one field, in the design system's danger text. */
export function GroupError({ id, testId, children }: { id?: string; testId?: string; children: ReactNode }) {
  return (
    <div id={id} className="pp-group-error" data-testid={testId}>
      <Text elementType="p" size="small" color="danger">
        {children}
      </Text>
    </div>
  );
}

/** One part of a long proposal form: an H2 in the design system's H3 size, its fields `large` apart. */
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
  /** Read after "Closes". */
  closes: string;
  /** The value, location and Remote OK, in the direction's fixed order. */
  facts: readonly string[];
  /** The proposal's own status once it has one. */
  status?: string;
};

function Summary({ summary, compact, children }: { summary: SummaryFacts; compact?: boolean; children?: ReactNode }) {
  return (
    <section className={`pf-summary${compact ? " pf-summary-compact" : ""}`} aria-label="The opportunity" data-testid="proposal-opportunity-summary">
      <div className="pf-labels">
        <Label>{PROGRAM_NAMES[summary.program]}</Label>
        {summary.status ? <ProposalStatus bare>{summary.status}</ProposalStatus> : null}
      </div>
      {compact ? null : <p className="pf-summary-title">{summary.title}</p>}
      <p className="pf-summary-closes">Closes {summary.closes}</p>
      {summary.facts.length > 0 ? <p className="pf-summary-facts">{summary.facts.join(" · ")}</p> : null}
      {children}
    </section>
  );
}

/**
 * The long proposal form beside the opportunity it is for: on a wide screen a 320-pixel summary
 * stays in view beside the form and holds the actions, stacked at full width; on a narrow one the
 * summary is a compact card under the head and the actions follow the form. The switch is read in
 * script, so each action and its test ID appear once.
 */
export function ProposalFormPage({
  head,
  messages,
  intro,
  summary,
  actions,
  dialogs,
  onSubmit,
  children,
}: {
  /** The H1 and what sits with it: the create page's title, or a manage page's head, details and tabs. */
  head: ReactNode;
  /** Error summaries, refusals and notices. */
  messages?: ReactNode;
  intro?: ReactNode;
  summary: SummaryFacts;
  /** The form's buttons, the primary first. */
  actions: ReactNode;
  dialogs?: ReactNode;
  /** What pressing Enter in a field does. */
  onSubmit?: () => void;
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
          <Form
            validationBehavior="aria"
            className="pf-main"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              onSubmit?.();
            }}
          >
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

/** The create page's head: the H1 in the design system's H2 size on a wide screen, and the opportunity's title beneath it. */
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
