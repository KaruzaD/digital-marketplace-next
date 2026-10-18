import { useEffect, useRef, type ReactNode } from "react";
import { InlineAlert, Link, Text } from "@bcgov/design-system-react-components";
import { Hidden } from "./marketplace";

/**
 * The pieces the evaluation screens are put together from in the chosen direction, as
 * `design/catalogue/evaluation-kit.tsx` draws them: the rows that become stacked cards on a phone,
 * the panel's member rows and its select-and-add cluster, and the alerts. Built on the opportunity
 * kit, whose page frame and manage-page head they sit inside; this project's own compositions of
 * design-system components and tokens, none of them a design-system component.
 *
 * Every rule in the style sheet is scoped to this kit's classes, so a screen that draws the kit's
 * pieces places `EvaluationStyles` once and nothing else on the page changes.
 */

// From 560 pixels the row's cells sit in aligned columns under a header line; narrower, each row is
// a stacked card whose cells are labelled by their column's name. The header line is hidden from
// assistive technology, because each cell carries its column's name in text that is visually hidden
// in the column layout. No token carries a container width.
const css = `
.ev-rows {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.ev-rows > *, .ev-row > *, .ev-cell > *, .ev-member > *, .ev-member-body > *, .ev-cluster > *, .ev-error > *, .ev-alert > * {
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
.ev-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.ev-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
@media (max-width: 767.98px) {
  .ev-cluster > button { width: 100%; justify-content: center; }
}
`;

/** This kit's style sheet; the opportunity kit's is placed by the root layout. */
export function EvaluationStyles() {
  return <style>{css}</style>;
}

export type Cell = { content: ReactNode; testId?: string };
export type Row = { key: string; testId?: string; cells: Cell[] };

/**
 * Rows that sit in aligned columns where the list is wide and become stacked cards on a phone. The
 * first column is the row's lead (a proponent, a person) and needs no label; any column named in
 * `unlabelled` (an action link that says what it does) carries none either.
 */
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
  columns: readonly string[];
  layout: "ev-cols-2" | "ev-cols-3" | "ev-cols-scores";
  testId?: string;
  unlabelled?: readonly string[];
  rows: readonly Row[];
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
              const column = columns[index] ?? String(index);
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

/** A message that receives keyboard focus when it appears, so it is read out and a keyboard user starts from it. */
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

/** A notice that explains the state the page is in. The wrapper carries the test ID. */
export function Notice({ testId, title, description }: { testId?: string; title: string; description: string }) {
  return (
    <div className="ev-alert" data-testid={testId}>
      <InlineAlert variant="info" title={title} description={description} />
    </div>
  );
}

export type Problem = { href: string; testId?: string; text: string };

/**
 * An error summary: a danger alert that takes focus, its title in the alert's own title markup, the
 * sentences on what happened, and a link to each problem, each inside a `field-error` item.
 */
export function ErrorSummary({ title, lead, problems }: { title: string; lead: ReactNode; problems: readonly Problem[] }) {
  return (
    <Focused>
      <InlineAlert variant="danger" role="alert">
        <span className="title" id="alert-title">
          {title}
        </span>
        {lead}
        {problems.length > 0 ? (
          <ul className="ev-errors">
            {problems.map((problem, index) => (
              <li key={`${problem.href}-${index}`} data-testid="field-error">
                <Link href={problem.href} data-testid={problem.testId}>
                  {problem.text}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </InlineAlert>
    </Focused>
  );
}

/** A problem that belongs to a group or a row rather than to one field, in the design system's danger text colour. */
export function GroupError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div id={id} className="ev-error">
      <Text elementType="p" size="small" color="danger">
        {children}
      </Text>
    </div>
  );
}
