import type { ReactNode } from "react";
import { Heading, Link } from "@bcgov/design-system-react-components";
import { PROGRAM_NAMES, Program } from "@rules/opportunities";

/**
 * The chosen direction's own components, as `design/catalogue/marketplace.tsx` draws them: the
 * label, the opportunity rows and the program panels. Built from standard HTML and the design
 * tokens; none of them is a design-system component.
 */

// Headings keep their level for structure and take the direction's denser sizes: a page's H1 in
// the design system's H3 size, a section's heading in its H4 size, an opportunity's title in bold
// body text.
export const look = {
  page: { font: "var(--typography-bold-h3)", color: "var(--typography-color-primary)" },
  section: { font: "var(--typography-bold-h4)", color: "var(--typography-color-primary)" },
  title: { font: "var(--typography-bold-body)" },
} as const;

export type LabelColour = "grey" | "green" | "blue" | "yellow" | "red";

/**
 * A short static label drawn like the design system's small rectangular Tag, from the same
 * tokens. Colour marks an opportunity's status and nothing else; the label always says it in words.
 */
export function Label({ colour = "grey", testId, children }: { colour?: LabelColour; testId?: string; children: ReactNode }) {
  return (
    <span className={`dm-label dm-label-${colour}`} data-testid={testId}>
      {children}
    </span>
  );
}

/** Text for assistive technology only, such as the program a "Learn More" link is about. */
export function Hidden({ children }: { children: ReactNode }) {
  return <span className="dm-hidden">{children}</span>;
}

/** One opportunity as a row shows it: every fact already in words. */
export interface RowOpportunity {
  readonly id: string;
  readonly program: Program;
  readonly title: string;
  readonly summary: string;
  readonly status: { readonly label: string; readonly colour: LabelColour };
  /** Its proposal deadline has passed. */
  readonly closed: boolean;
  readonly deadline: string;
  readonly value: string;
  readonly location: string;
  readonly remoteOk: boolean;
}

/**
 * Every opportunity shows the same facts in the same order: program and status, title, closing
 * date, value, location and Remote OK, then its summary. Where the list is wide enough the facts
 * sit in aligned columns beside the title; where it is not, each is a stacked card. The switch
 * follows the width of the list itself, not of the window.
 */
export function OpportunityRows({
  opportunities,
  titleLevel,
  withTestIds = false,
  watch,
}: {
  opportunities: readonly RowOpportunity[];
  titleLevel: 3 | 4;
  /** The opportunity list's own test IDs for each row's status and proposal deadline. The home page's rows carry none. */
  withTestIds?: boolean;
  /** What a row offers after its summary: the opportunity list's Watch, where the person may watch it. */
  watch?: (opportunity: RowOpportunity) => ReactNode;
}) {
  return (
    <ul className="dm-rows">
      {opportunities.map((opportunity) => {
        const titleId = `opportunity-${opportunity.program}-${opportunity.id}`;
        const offered = watch?.(opportunity) ?? null;
        return (
          <li key={`${opportunity.program}-${opportunity.id}`} className="dm-row">
            <article aria-labelledby={titleId} className="dm-row-grid">
              <div className="dm-row-head">
                <div className="dm-row-labels">
                  <Label>{PROGRAM_NAMES[opportunity.program]}</Label>
                  <Label colour={opportunity.status.colour} testId={withTestIds ? "opportunity-status" : undefined}>
                    {opportunity.status.label}
                  </Label>
                </div>
                <Heading level={titleLevel} id={titleId} style={look.title}>
                  <Link href={`/opportunities/${opportunity.program}/${opportunity.id}`}>{opportunity.title}</Link>
                </Heading>
              </div>
              <ul className="dm-facts">
                <li>
                  {opportunity.closed ? "Closed" : "Closes"}{" "}
                  <span data-testid={withTestIds ? "opportunity-proposal-deadline" : undefined}>{opportunity.deadline}</span>
                </li>
                <li>{opportunity.value}</li>
                {opportunity.location ? <li>{opportunity.location}</li> : null}
                {opportunity.remoteOk ? <li>Remote OK</li> : null}
              </ul>
              {opportunity.summary ? <p className="dm-row-summary">{opportunity.summary}</p> : null}
              {offered ? <div className="dm-row-watch">{offered}</div> : null}
            </article>
          </li>
        );
      })}
    </ul>
  );
}

// The original site's own program illustrations, served from `public/images`. Their sizes are
// the files' own.
const ILLUSTRATIONS: Readonly<Record<Program, { src: string; width: number; height: number }>> = {
  "code-with-us": { src: "/images/code_with_us.svg", width: 350, height: 216 },
  "team-with-us": { src: "/images/team_with_us.svg", width: 1814, height: 1156 },
  "sprint-with-us": { src: "/images/sprint_with_us.svg", width: 312, height: 217 },
};

/** The original site's descriptions of the three programs, in its order. */
export const PROGRAM_PANELS: readonly { id: Program; text: string; budget?: string }[] = [
  { id: "code-with-us", text: "Commit Code. Get Paid.", budget: "Opportunities up to $70,000." },
  {
    id: "team-with-us",
    text: "Provide individual tech resources to work with an existing Agile Team. Get paid on a time and materials basis.",
  },
  {
    id: "sprint-with-us",
    text: "Supply an Agile Team to work with a government product manager in a modern DevOps environment.",
    budget: "Opportunities up to $5,000,000.",
  },
];

/**
 * The program panels: a gold rule, the program's illustration, its name, what it is, its budget
 * limit where it has one, and Learn More. Three across where they fit, stacked where they do not.
 * The illustrations are decorative: the program's name is the panel's heading.
 */
export function ProgramPanels({ headingLevel }: { headingLevel: 2 | 3 }) {
  return (
    <ul className="dm-panels">
      {PROGRAM_PANELS.map((program) => {
        const name = PROGRAM_NAMES[program.id];
        const illustration = ILLUSTRATIONS[program.id];
        return (
          <li key={program.id} className="dm-panel">
            <section aria-labelledby={`program-${program.id}`} className="dm-panel-body">
              <img
                className="dm-panel-image"
                src={illustration.src}
                width={illustration.width}
                height={illustration.height}
                alt=""
              />
              <Heading level={headingLevel} id={`program-${program.id}`} style={look.section}>
                {name}
              </Heading>
              <p className="dm-panel-text">{program.text}</p>
              {program.budget ? <p className="dm-panel-budget">{program.budget}</p> : null}
              <p className="dm-panel-text">
                <Link href={`/learn-more/${program.id}`}>
                  Learn More<Hidden> about {name}</Hidden>
                </Link>
              </p>
            </section>
          </li>
        );
      })}
    </ul>
  );
}

// The widths below are the facts' columns, so that each fact lines up from one opportunity to the
// next. No token carries a column width. Narrow screens (the header's switch point) take the
// smaller text and tighter padding the phone drafts use.
const css = `
.dm-label {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-height: var(--layout-padding-large);
  padding: var(--layout-padding-hair) var(--layout-padding-small);
  border: var(--layout-border-width-small) solid;
  border-radius: var(--layout-border-radius-small);
  font: var(--typography-regular-label);
  color: var(--typography-color-primary);
  white-space: nowrap;
}
.dm-label-grey { background-color: var(--theme-gray-20); border-color: var(--surface-color-border-dark); }
.dm-label-green { background-color: var(--support-surface-color-success); border-color: var(--support-border-color-success); }
.dm-label-blue { background-color: var(--support-surface-color-info); border-color: var(--support-border-color-info); }
.dm-label-yellow { background-color: var(--support-surface-color-warning); border-color: var(--support-border-color-warning); }
.dm-label-red { background-color: var(--support-surface-color-danger); border-color: var(--support-border-color-danger); }
.dm-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.dm-rows {
  container-type: inline-size;
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.dm-row {
  padding-block: var(--layout-padding-medium);
  border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.dm-row-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "head" "facts" "summary" "watch";
  row-gap: var(--layout-margin-small);
}
.dm-row-head {
  grid-area: head;
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.dm-row-head > h3, .dm-row-head > h4 { margin: var(--layout-margin-none); }
.dm-row-head > :is(h3, h4) > a.bcds-react-aria-Link { font: inherit; }
.dm-row-labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--layout-margin-small);
}
.dm-facts {
  grid-area: facts;
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--layout-margin-small);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-secondary);
}
.dm-facts > li:first-child {
  flex-basis: 100%;
  color: var(--typography-color-primary);
}
.dm-facts > li:not(:first-child):not(:last-child)::after {
  content: "·" / "";
  margin-inline-start: var(--layout-margin-small);
}
.dm-row-summary {
  grid-area: summary;
  margin: var(--layout-margin-none);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-secondary);
}
.dm-row-watch { grid-area: watch; }
@container (min-width: 760px) {
  .dm-rows { gap: var(--layout-margin-medium); }
  .dm-row-grid {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "head facts" "summary facts" "watch facts";
    grid-template-rows: auto auto 1fr;
    column-gap: var(--layout-margin-medium);
  }
  .dm-facts {
    display: grid;
    grid-template-columns: 190px 70px 70px 80px;
    column-gap: var(--layout-margin-medium);
    align-self: start;
    color: var(--typography-color-primary);
  }
  .dm-facts > li:not(:first-child):not(:last-child)::after { content: none; }
}
@container (min-width: 1000px) {
  .dm-row-grid { column-gap: var(--layout-margin-xlarge); }
  .dm-facts {
    grid-template-columns: 280px 80px 80px 80px;
    column-gap: var(--layout-margin-xlarge);
  }
}

.dm-panels {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: var(--layout-margin-large);
}
.dm-panel {
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-top: var(--layout-border-width-large) solid var(--theme-primary-gold);
  border-radius: var(--layout-border-radius-medium);
}
.dm-panel-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--layout-margin-medium);
  padding: var(--layout-padding-large);
}
.dm-panel-body > * { margin: var(--layout-margin-none); }
.dm-panel-image { width: 160px; height: auto; }
.dm-panel-text { font: var(--typography-regular-body); color: var(--typography-color-primary); }
.dm-panel-budget { font: var(--typography-bold-body); color: var(--typography-color-primary); }
@media (max-width: 767.98px) {
  .dm-panel-body { padding: var(--layout-padding-medium); gap: var(--layout-margin-small); }
  .dm-panel-image { width: 120px; }
  .dm-panel-text { font: var(--typography-regular-small-body); }
  .dm-panel-budget { font: var(--typography-bold-small-body); }
}
`;

/** The style sheet for the components above, placed once by each screen that uses them. */
export function MarketplaceStyles() {
  return <style>{css}</style>;
}
