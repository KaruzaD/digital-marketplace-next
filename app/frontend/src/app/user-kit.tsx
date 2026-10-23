import { useEffect, useRef, type ReactNode } from "react";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import { Label, type LabelColour } from "./marketplace";
import { Details, OpportunityPage, Region, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";

/**
 * The pieces the users domain's screens are put together from in the chosen direction, as
 * `design/catalogue/user-kit.tsx` draws them (design/DESIGN.md, "User screens in the chosen
 * direction"): the page frame, the two account choices, a labelled group, the field grid, the
 * error summary, and the profile's own pieces — its section links, the account's facts and status
 * label, the read-only details, the capability rows and the status an immediate save reports into
 * (decision records 0074 and 0077) — and the user list's toolbar, phone cards and export dialog
 * body (decision record 0086).
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
.us-group, .us-form, .us-dialog, .us-row, .us-card { display: flex; flex-direction: column; }
.us-group > *, .us-form > *, .us-dialog > *, .us-row > *, .us-card > * { margin: var(--layout-margin-none); }
.us-group { gap: var(--layout-margin-small); align-items: flex-start; }
.us-form { gap: var(--layout-margin-medium); }
.us-group-label { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.us-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--layout-margin-medium);
}
.us-toolbar > * { margin: var(--layout-margin-none); }
.op-regions .us-toolbar > .bcds-react-aria-TextField { flex: 0 1 320px; }
.us-rows, .us-cards {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.us-row, .us-card {
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.us-row-line, .us-card-facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-small);
}
.us-row-line { justify-content: space-between; }
.us-row-line > *, .us-card-facts > * { margin: var(--layout-margin-none); }
.us-card-facts { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.us-dialog { gap: var(--layout-margin-medium); padding: var(--layout-padding-large); }
.us-description { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); margin: var(--layout-margin-none); }
.us-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.us-saved { margin: var(--layout-margin-none); font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.us-saved:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.us-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
@media (max-width: 767.98px) {
  .us-dialog { padding: var(--layout-padding-medium); }
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

/** A label and what it labels, `small` apart: the terms links and the agreement box; a checkbox and its hint. */
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

/**
 * An account's status, coloured as the direction colours status (rule 3): green while the account
 * is active, grey once it has been deactivated. The label always says the status in words.
 */
export function accountColour(status: string): LabelColour {
  return status.toLowerCase().startsWith("active") ? "green" : "grey";
}

export function AccountStatus({ testId, children }: { testId?: string; children: string }) {
  return (
    <Label colour={accountColour(children)} testId={testId}>
      {children}
    </Label>
  );
}

export type ProfileTab = { readonly key: string; readonly label: string };

/**
 * The profile's sections. Each has its own address (the profile itself, or `?tab=…`), so they
 * are links in a navigation landmark, drawn as the manage page's tabs: small text along a rule,
 * the current one marked by `aria-current="page"`, a bar and bold text. They wrap on a phone.
 */
export function ProfileTabs({ base, current, tabs }: { base: string; current: string; tabs: readonly ProfileTab[] }) {
  return (
    <nav className="op-tabs" aria-label="Profile sections">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={tab.key === "profile" ? base : `${base}?tab=${tab.key}`}
              aria-current={tab.key === current ? "page" : undefined}
              data-testid={`profile-tab-${tab.key}`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The account's facts as terms and values: its type, its status as a coloured label, and its identifier. */
export function AccountFacts({ type, status, id }: { type: string; status?: string; id?: string }) {
  const items: Detail[] = [{ term: "Account type", value: type, testId: "profile-account-type" }];
  if (status) items.push({ term: "Status", value: <AccountStatus testId="profile-status-badge">{status}</AccountStatus> });
  if (id) items.push({ term: "Account ID", value: id, testId: "profile-user-identifier" });
  return <Details items={items} />;
}

/**
 * The Details region: the picture or the sentence standing in for it, the read-only fields in as
 * many columns as fit, then the region's action.
 */
export function DetailsRegion({ picture, fields, children }: { picture: ReactNode; fields: ReactNode; children?: ReactNode }) {
  return (
    <Region id="details-heading" title="Details">
      {picture}
      <div className="us-fields">{fields}</div>
      {children}
    </Region>
  );
}

/** The user list's search field and its export button on one line, the button at the far end. */
export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="us-toolbar">{children}</div>;
}

/** A dialog's content, `medium` apart inside the dialog's own padding (`medium` on a phone). */
export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="us-dialog">{children}</div>;
}

/**
 * The status region a control that saves at once reports its outcome in. It is on the page before
 * anything is saved, so the outcome is announced; while it is empty it takes no room in the
 * column, but stays in the accessibility tree.
 */
export function SaveStatus({ children }: { children?: ReactNode }) {
  return (
    <p role="status" className="us-saved">
      {children}
    </p>
  );
}
