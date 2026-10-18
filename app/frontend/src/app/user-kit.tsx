import { useEffect, useRef, type ReactNode } from "react";
import { InlineAlert } from "@bcgov/design-system-react-components";
import { OpportunityPage } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";

/**
 * The pieces the users domain's screens are put together from in the chosen direction, as
 * `design/catalogue/user-kit.tsx` draws them (design/DESIGN.md, "User screens in the chosen
 * direction"). Started with what sign-in, sign-up, completing a profile, signing out and the
 * notices use: the page frame, the two account choices, a labelled group, the field grid and the
 * error summary. The profile's own pieces (its section links, account facts, read-only details,
 * capability rows, the list's cards) belong to the screens that show them and are added here when
 * those screens are restyled (decision record 0074).
 */

const css = `
.us-choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--layout-margin-large);
  align-items: stretch;
}
.us-choices > * { margin: var(--layout-margin-none); }
.us-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  align-items: start;
}
.us-fields > * { margin: var(--layout-margin-none); }
.us-group, .us-form { display: flex; flex-direction: column; }
.us-group > *, .us-form > * { margin: var(--layout-margin-none); }
.us-group { gap: var(--layout-margin-small); align-items: flex-start; }
.us-form { gap: var(--layout-margin-medium); }
.us-group-label { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.us-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.us-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
`;

/**
 * A whole screen of this domain: the opportunity page frame (the direction's style sheets, the
 * regions `large` apart, `medium` on a phone) with this kit's style sheet. The root layout already
 * puts every screen in the page container (decision record 0069).
 */
export function UserPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

/** The two kinds of account, side by side where each has 320 pixels and stacked where they do not. */
export function Choices({ children }: { children: ReactNode }) {
  return <div className="us-choices">{children}</div>;
}

/** A label and what it labels, `small` apart: the terms links and the agreement box. */
export function Group({ children }: { children: ReactNode }) {
  return <div className="us-group">{children}</div>;
}

/** A form's fields in as many columns as fit, each at least 280 pixels; one column on a phone. */
export function Fields({ children }: { children: ReactNode }) {
  return <div className="us-fields">{children}</div>;
}

/**
 * A form's error summary: a danger alert that takes focus when it appears, with its title in the
 * alert's own title markup (the design system's InlineAlert drops `title` when it has content of
 * its own) and a link to each problem.
 */
export function ErrorSummary({ title, children }: { title: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  return (
    <div ref={box} tabIndex={-1} className="us-focus">
      <InlineAlert variant="danger" role="alert">
        <AlertTitle>{title}</AlertTitle>
        <ul className="us-errors">{children}</ul>
      </InlineAlert>
    </div>
  );
}
