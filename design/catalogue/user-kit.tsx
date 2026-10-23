import { useEffect, useRef, type ReactNode } from "react";
import { InlineAlert, Link, TextField } from "@bcgov/design-system-react-components";
import { Label, type LabelColour } from "./marketplace";
import { Details, OpportunityPage, Region, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";
import type { Viewer } from "./site";

// The pieces the users domain's screens are put together from in the chosen direction (design/DESIGN.md, "User screens
// in the chosen direction"): the page frame, the profile's section links, the account's facts and status label, the
// read-only details, the sign-in choices, the capability rows, the user list's phone cards, the export dialog's body and
// the error summary. Built on opportunity-kit.tsx and marketplace.tsx; this project's own compositions of design-system
// components and tokens, none of them a design-system component.

// Who each state is seen by. The addresses are the stories' own test data, so a person looking at their own profile
// sees their own address in the header.
export const VENDOR_ONE: Viewer = { role: "vendor", email: "vendor1@example.com" };
export const VENDOR_TWO: Viewer = { role: "vendor", email: "vendor2@example.com" };
export const PUBLIC_SERVANT: Viewer = { role: "government", email: "gov@example.com" };
export const ADMINISTRATOR: Viewer = { role: "administrator", email: "admin@example.com" };

// An account's status, coloured as the direction colours status (rule 3): green while the account is active, grey once
// it has been deactivated. The label always says the status in words.
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
.us-card-name { font: var(--typography-bold-body); }
.us-card-name > a.bcds-react-aria-Link { font: inherit; }
.us-card-facts { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.us-description { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); margin: var(--layout-margin-none); }
.us-dialog { gap: var(--layout-margin-medium); padding: var(--layout-padding-large); }
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

// A whole page of this domain: the opportunity page frame (the page container, the direction's style sheets, the
// regions `large` apart, `medium` on a phone) with this kit's style sheet.
export function UserPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

export type ProfileTab = { key: string; label: string };

// The sections a vendor's own profile offers, and those a public sector employee's or an administrator's own profile
// offers (design/DESIGN.md, "Which sections a profile offers").
export const VENDOR_TABS: ProfileTab[] = [
  { key: "profile", label: "Profile" },
  { key: "capabilities", label: "Capabilities" },
  { key: "organizations", label: "Organizations" },
  { key: "notifications", label: "Notifications" },
  { key: "legal", label: "Legal" },
];
export const STAFF_TABS: ProfileTab[] = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
];

// The profile's sections. Each has its own address (the profile itself, or `?tab=…`), so they are links in a navigation
// landmark, drawn as the opportunity manage page's tabs: small text along a rule, the current one marked by
// `aria-current="page"`, a bar and bold text, never colour alone. They wrap onto further lines on a phone.
export function ProfileTabs({ base, current, tabs }: { base: string; current: string; tabs: ProfileTab[] }) {
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

// The account's facts, as terms and values: its type, its status as a coloured label (shown only to an administrator),
// and its identifier. A story shows only the facts its earlier version showed.
export function AccountFacts({ type, status, id }: { type: string; status?: string; id?: string }) {
  const items: Detail[] = [{ term: "Account type", value: type, testId: "profile-account-type" }];
  if (status) items.push({ term: "Status", value: <AccountStatus testId="profile-status-badge">{status}</AccountStatus> });
  if (id) items.push({ term: "Account ID", value: id, testId: "profile-user-identifier" });
  return <Details items={items} />;
}

// The profile's details as read-only fields, so the label, the value and the read-only state are exposed the same way
// in view and in edit. The fields sit in as many columns as fit.
export function ReadOnlyDetails({
  username,
  name,
  email,
  jobTitle,
  noPicture = false,
  children,
}: {
  username?: string;
  name: string;
  email?: string;
  jobTitle?: string;
  noPicture?: boolean;
  children?: ReactNode;
}) {
  return (
    <Region id="details-heading" title="Details">
      {noPicture ? <p className="op-note">No profile picture has been added.</p> : null}
      <div className="us-fields">
        {username ? <TextField label="Sign-in username" value={username} isReadOnly data-testid="idp-username-field" /> : null}
        <TextField label="Name" value={name} isReadOnly data-testid="name-field" />
        {email ? <TextField label="Email address" value={email} isReadOnly data-testid="email-field" /> : null}
        {jobTitle ? <TextField label="Job title" value={jobTitle} isReadOnly data-testid="job-title-field" /> : null}
      </div>
      {children}
    </Region>
  );
}

// A group of a label and what it labels, `small` apart: the profile picture's label, its line and its trigger; a
// checkbox and its hint or refusal.
export function Group({ children }: { children: ReactNode }) {
  return <div className="us-group">{children}</div>;
}

// The two kinds of account, side by side where they fit and stacked where they do not.
export function Choices({ children }: { children: ReactNode }) {
  return <div className="us-choices">{children}</div>;
}

// The status region a control that saves at once reports its outcome in. It is on the page before anything is saved,
// so the outcome is announced; while it is empty it takes no room in the column, but stays in the accessibility tree.
export function SaveStatus() {
  return <p role="status" className="us-saved" />;
}

// A form's error summary: a danger alert that takes focus when it appears, with its title in the alert's own title
// markup (the design system's InlineAlert drops `title` when it has content of its own) and a link to each problem.
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
