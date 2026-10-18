import type { ReactNode } from "react";
import { ButtonGroup, Heading, Link, ProgressCircle, Text } from "@bcgov/design-system-react-components";
import { PROGRAM_NAMES, Program } from "@rules/opportunities";
import { Label, MarketplaceStyles, look, type LabelColour } from "./marketplace";

/**
 * The pieces the opportunity screens other than the home page and the list are put together from,
 * as `design/catalogue/opportunity-kit.tsx` draws them: the page frame, the opportunity's head with
 * its facts in the fixed order, the details list, the manage page's action bar and tabs, the panels
 * and tables, and the wait. This project's own compositions of design-system components and
 * tokens; none of them is a design-system component.
 *
 * The catalogue's `OpportunityPage` wraps itself in the page container. The root layout already
 * puts every screen in it, so here the frame draws only what is inside (decision record 0069).
 */

/**
 * An opportunity's status in the words the screen shows, coloured as the original site colours it:
 * grey for a draft or a completed opportunity, yellow while it waits on someone (under review, any
 * evaluation stage, processing), green when it is open, published or awarded, red when cancelled.
 */
export function statusColour(status: string): LabelColour {
  const word = status.toLowerCase();
  if (word.startsWith("draft") || word.startsWith("completed")) return "grey";
  if (word.startsWith("open") || word.startsWith("published") || word.startsWith("awarded")) return "green";
  if (word.startsWith("cancel")) return "red";
  return "yellow";
}

/** The status as a coloured label, always in words (`opportunity-status`). */
export function StatusLabel({ testId = "opportunity-status", children }: { testId?: string; children: string }) {
  return (
    <Label colour={statusColour(children)} testId={testId}>
      {children}
    </Label>
  );
}

// The regions of a page are `large` apart (`medium` on a phone), the items of a region `medium`
// apart, and a label and what it labels `small` apart. Facts, details, captions and table cells
// take the small body text; section headings the design system's H4 size, and an H3 inside a
// section bold body text.
const css = `
.op-regions, .op-region, .op-head, .op-panel, .op-fieldset-body, .op-dialog {
  display: flex;
  flex-direction: column;
}
.op-regions > *, .op-region > *, .op-head > *, .op-panel > *, .op-fieldset-body > *, .op-dialog > * {
  margin: var(--layout-margin-none);
}
.op-regions { gap: var(--layout-margin-large); }
.op-regions > div:empty { display: none; }
.op-region, .op-panel, .op-fieldset-body, .op-dialog { gap: var(--layout-margin-medium); }
.op-head { gap: var(--layout-margin-small); }
.op-eyebrow { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.op-labels { display: flex; flex-wrap: wrap; gap: var(--layout-margin-small); }
.op-facts {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--layout-margin-small);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-secondary);
}
.op-facts > li:first-child { flex-basis: 100%; color: var(--typography-color-primary); }
.op-facts > li:not(:first-child):not(:last-child)::after {
  content: "·" / "";
  margin-inline-start: var(--layout-margin-small);
}
.op-summary { font: var(--typography-regular-body); color: var(--typography-color-primary); }
.op-text { font: var(--typography-regular-body); color: var(--typography-color-primary); }
.op-note { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.op-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  margin: var(--layout-margin-none);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-primary);
}
.op-details > div { display: flex; flex-direction: column; gap: var(--layout-margin-xsmall); min-width: 0; }
.op-details dt { font: var(--typography-bold-small-body); color: var(--typography-color-secondary); }
.op-details dd { margin: var(--layout-margin-none); overflow-wrap: anywhere; }
.op-list {
  margin: var(--layout-margin-none);
  padding-inline-start: var(--layout-padding-large);
  font: var(--typography-regular-body);
  color: var(--typography-color-primary);
}
.op-list > li + li { margin-top: var(--layout-margin-xsmall); }
.op-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-small); }
.op-tabs ul {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--layout-margin-large);
  row-gap: var(--layout-margin-small);
  border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.op-tabs li { display: flex; padding-block: var(--layout-padding-small); }
.op-tabs a.bcds-react-aria-Link { font: var(--typography-regular-small-body); }
.op-tabs li:has(> a[aria-current="page"]) {
  box-shadow: inset 0 calc(-1 * var(--layout-border-width-large)) 0 var(--surface-color-primary-default);
}
.op-tabs a[aria-current="page"] { font-weight: var(--typography-font-weights-bold); }
.op-panel {
  padding: var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.op-fieldset {
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
  min-width: 0;
}
.op-fieldset > legend { padding-inline: var(--layout-padding-small); font: var(--typography-bold-body); color: var(--typography-color-primary); }
.op-region .bcds-react-aria-TextField, .op-region .bcds-react-aria-TextArea, .op-region .bcds-react-aria-Select,
.op-panel .bcds-react-aria-TextField, .op-panel .bcds-react-aria-TextArea, .op-panel .bcds-react-aria-Select,
.op-fieldset .bcds-react-aria-TextField, .op-fieldset .bcds-react-aria-TextArea, .op-fieldset .bcds-react-aria-Select {
  width: 100%;
}
.op-table-scroll { overflow-x: auto; }
.op-table-scroll:focus-visible {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
.op-table { border-collapse: collapse; width: 100%; font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.op-table caption { text-align: start; padding-bottom: var(--layout-padding-small); font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.op-table th, .op-table td {
  text-align: start;
  vertical-align: top;
  padding: var(--layout-padding-small);
  border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.op-table th { font: var(--typography-bold-small-body); }
.op-table td > a.bcds-react-aria-Link { font: inherit; font-weight: var(--typography-font-weights-bold); }
.op-wait { display: flex; align-items: center; gap: var(--layout-margin-small); }
.op-dialog .bcds-react-aria-TextArea { width: 100%; }
@media (max-width: 767.98px) {
  .op-regions { gap: var(--layout-margin-medium); }
  .op-summary, .op-text, .op-list { font: var(--typography-regular-small-body); }
  .op-actions > :is(a, button) { flex: 1 1 100%; justify-content: center; }
}
`;

/** This kit's style sheet with the direction's own, for a screen that uses the kit without the frame. */
export function OpportunityStyles() {
  return (
    <>
      <MarketplaceStyles />
      <style>{css}</style>
    </>
  );
}

/** A whole screen's content: the direction's style sheets and the screen's regions in one column. */
export function OpportunityPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <>
      <OpportunityStyles />
      <div className="op-regions" data-testid={testId}>
        {children}
      </div>
    </>
  );
}

/** The screen's H1, in the design system's H3 size. */
export function PageTitle({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Heading level={1} id={id} style={look.page}>
      {children}
    </Heading>
  );
}

/** A section's heading: an H2 in the design system's H4 size, an H3 in bold body text. */
export function SectionTitle({ level = 2, id, children }: { level?: 2 | 3; id?: string; children: ReactNode }) {
  return (
    <Heading level={level} id={id} style={level === 2 ? look.section : look.title}>
      {children}
    </Heading>
  );
}

/** A region of the page: a labelled section whose items are `medium` apart. */
export function Region({
  id,
  title,
  level = 2,
  testId,
  anchor,
  children,
}: {
  id: string;
  title: ReactNode;
  level?: 2 | 3;
  testId?: string;
  /** The section's own `id`, where a link on the page leads to it. */
  anchor?: string;
  children?: ReactNode;
}) {
  return (
    <section className="op-region" aria-labelledby={id} data-testid={testId} id={anchor}>
      <SectionTitle level={level} id={id}>
        {title}
      </SectionTitle>
      {children}
    </section>
  );
}

type Fact = { text: string; testId?: string };

type HeadProps = {
  program: Program;
  /** The status in the words the viewer is shown. Left out on a page about an opportunity not yet made. */
  status?: string;
  /** What the page is, above the labels: "Manage a Code With Us opportunity". */
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  /** The proposal deadline, read after "Closes", or "Closed" once it has passed. */
  closes?: Fact & { closed?: boolean };
  /** The money: the reward, the total maximum budget or the maximum budget, named. */
  value?: Fact & { label: string };
  location?: string;
  remoteOk?: boolean;
  /** The teaser. */
  summary?: ReactNode;
};

/**
 * An opportunity's head, with its facts in the direction's fixed order: program and status, title,
 * closing date, value, location and Remote OK, then its summary. It shows only the facts it is
 * given and never reorders them.
 */
export function OpportunityHead({ program, status, eyebrow, title, titleId, closes, value, location, remoteOk, summary }: HeadProps) {
  const facts = [
    closes ? (
      <li key="closes">
        {closes.closed ? "Closed" : "Closes"} <span data-testid={closes.testId}>{closes.text}</span>
      </li>
    ) : null,
    value ? (
      <li key="value">
        {value.label} <span data-testid={value.testId}>{value.text}</span>
      </li>
    ) : null,
    location ? <li key="location">{location}</li> : null,
    remoteOk ? <li key="remote">Remote OK</li> : null,
  ].filter(Boolean);
  return (
    <div className="op-head">
      {eyebrow ? <p className="op-eyebrow">{eyebrow}</p> : null}
      <div className="op-labels">
        <Label>{PROGRAM_NAMES[program]}</Label>
        {status ? <StatusLabel>{status}</StatusLabel> : null}
      </div>
      <PageTitle id={titleId}>{title}</PageTitle>
      {facts.length ? <ul className="op-facts">{facts}</ul> : null}
      {summary ? <p className="op-summary">{summary}</p> : null}
    </div>
  );
}

export type Detail = { term: string; value: ReactNode; testId?: string };

/** The facts beyond the head's, as terms and values in as many columns as fit. */
export function Details({ items }: { items: readonly Detail[] }) {
  return (
    <dl className="op-details">
      {items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd data-testid={item.testId}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A row of actions that wraps, and on a phone stacks at full width. */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="op-actions">{children}</div>;
}

/**
 * The manage page's action bar: the changes of state the signed-in person is offered, and nothing
 * else. The wrapper carries the test ID, since the design system's ButtonGroup passes no `data-*`
 * attribute; it is always present and takes no space when empty.
 */
export function ActionBar({ children }: { children?: ReactNode }) {
  return (
    <div data-testid="opportunity-actions">
      {children ? <ButtonGroup ariaLabel="Opportunity actions">{children}</ButtonGroup> : null}
    </div>
  );
}

export type Tab = { key: string; label: string };

/**
 * The manage page's tabs. Each has its own address (`?tab=…`), so they are links in a navigation
 * landmark, the current one marked by `aria-current="page"`, a bar and bold text.
 */
export function ManageTabs({ base, current, tabs }: { base: string; current: string; tabs: readonly Tab[] }) {
  return (
    <nav className="op-tabs" aria-label="Opportunity sections">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={`${base}?tab=${tab.key}`}
              aria-current={tab.key === current ? "page" : undefined}
              data-testid={`opportunity-tab-${tab.key}`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A bordered group inside a page: one part of a long form, a program choice, a proposal in the report. */
export function Panel({
  id,
  title,
  testId,
  as = "section",
  level = 2,
  children,
}: {
  id: string;
  title: ReactNode;
  testId?: string;
  as?: "section" | "article";
  level?: 2 | 3;
  children?: ReactNode;
}) {
  const Element = as;
  return (
    <Element className="op-panel" aria-labelledby={id} data-testid={testId}>
      <SectionTitle level={level} id={id}>
        {title}
      </SectionTitle>
      {children}
    </Element>
  );
}

/** One repeated item of a form: a legend, then its fields `medium` apart. */
export function Fieldset({ legend, testId, children }: { legend: string; testId?: string; children: ReactNode }) {
  return (
    <fieldset className="op-fieldset" data-testid={testId}>
      <legend>{legend}</legend>
      <div className="op-fieldset-body">{children}</div>
    </fieldset>
  );
}

/** A table in a focusable region that scrolls sideways on a narrow screen, labelled by its caption. */
export function DataTable({
  captionId,
  caption,
  columns,
  testId,
  children,
}: {
  captionId: string;
  caption: string;
  columns: readonly string[];
  testId?: string;
  children: ReactNode;
}) {
  return (
    <div className="op-table-scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className="op-table" data-testid={testId}>
        <caption id={captionId}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** A wait, announced as a status beside a spinner. */
export function Waiting({ label }: { label: string }) {
  return (
    <div className="op-wait" role="status">
      <ProgressCircle isIndeterminate aria-label={label} />
      <Text>{label}…</Text>
    </div>
  );
}
