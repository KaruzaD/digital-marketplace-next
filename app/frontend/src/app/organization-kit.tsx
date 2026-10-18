import type { ReactNode } from "react";
import { Heading, Link } from "@bcgov/design-system-react-components";
import { fileAddress } from "../api/files";
import type { ListedOrganization } from "../api/organizations";
import { Label, look } from "./marketplace";
import { DataTable, Details, OpportunityPage, PageTitle } from "./opportunity-kit";
import { useNarrow } from "./site-header";

/**
 * The pieces the organizations domain's screens are put together from in the chosen direction, as
 * `design/catalogue/organization-kit.tsx` draws them (design/DESIGN.md, "Organization screens in
 * the chosen direction"): the page frame, the management page's head and tabs, the profile
 * read-only and the form's field grid, the archive region, and the list's rows and pages (a table
 * on a wide screen, stacked cards on a phone). This project's own compositions of design-system
 * components and tokens; none of them is a design-system component (decision record 0079).
 *
 * The team, changelog, requirement and membership pieces are added when the screens of slices 12
 * and 13 are restyled.
 */

const css = `
.og-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  align-items: start;
  margin: var(--layout-margin-none);
}
.og-fields > * { margin: var(--layout-margin-none); min-width: 0; }
.og-fields .bcds-react-aria-TextField { width: 100%; }
.og-field { display: flex; flex-direction: column; gap: var(--layout-margin-xsmall); }
.og-field dt { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.og-field dd {
  margin: var(--layout-margin-none);
  font: var(--typography-regular-body);
  color: var(--typography-color-primary);
  overflow-wrap: anywhere;
}
.og-form, .og-body, .og-group, .og-card { display: flex; flex-direction: column; }
.og-form > *, .og-body > *, .og-group > *, .og-card > * { margin: var(--layout-margin-none); }
.og-form, .og-body { gap: var(--layout-margin-medium); }
.og-group { gap: var(--layout-margin-small); align-items: flex-start; }
.og-group-label { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.og-logo { max-width: 100%; height: auto; }
.og-cell { display: flex; flex-direction: column; align-items: flex-start; gap: var(--layout-margin-small); }
.og-cards {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.og-card {
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.og-card-name > a.bcds-react-aria-Link { font: inherit; }
.og-card-facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-small);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-secondary);
}
.og-pages ul {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-small) var(--layout-margin-medium);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-primary);
}
.og-pages a.bcds-react-aria-Link { font: inherit; }
.og-pages a[aria-current="page"] { font-weight: var(--typography-font-weights-bold); }
.og-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.og-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
`;

/**
 * A whole screen of this domain: the opportunity page frame (the direction's style sheets, the
 * regions `large` apart, `medium` on a phone) with this kit's style sheet. The root layout already
 * puts every screen in the page container (decision record 0069).
 */
export function OrganizationPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

export type OrganizationTabKey = "organization" | "team" | "swu-qualification" | "twu-qualification" | "changelog";

export const ORGANIZATION_TABS: readonly { readonly key: OrganizationTabKey; readonly label: string }[] = [
  { key: "organization", label: "Organization" },
  { key: "team", label: "Team members" },
  { key: "swu-qualification", label: "Sprint With Us qualification" },
  { key: "twu-qualification", label: "Team With Us qualification" },
  { key: "changelog", label: "Changelog" },
];

/** The tab an address asks for; anything else is the Organization tab. */
export function organizationTabOf(asked: unknown): OrganizationTabKey {
  return ORGANIZATION_TABS.find((tab) => tab.key === asked)?.key ?? "organization";
}

/**
 * The management page down to its tabs: "Edit Organization" in small secondary text, the
 * qualified labels (green: a state in good standing), the legal name as the H1 in the H3 size; the
 * Organization ID as a detail; then the tabs, links in a navigation landmark marked by
 * `aria-current="page"`, a bar and bold text.
 */
export function ManagementTop({
  id,
  legalName,
  swu,
  twu,
  current,
}: {
  id: string;
  legalName: string;
  swu: boolean;
  twu: boolean;
  current: OrganizationTabKey;
}) {
  const base = `/organizations/${id}/edit`;
  return (
    <>
      <div className="op-head">
        <p className="op-eyebrow">Edit Organization</p>
        {swu || twu ? (
          <div className="op-labels">
            {swu ? (
              <Label colour="green" testId="organization-swu-qualified-badge">
                Sprint With Us qualified
              </Label>
            ) : null}
            {twu ? (
              <Label colour="green" testId="organization-twu-qualified-badge">
                Team With Us qualified
              </Label>
            ) : null}
          </div>
        ) : null}
        <PageTitle>{legalName}</PageTitle>
      </div>
      <Details items={[{ term: "Organization ID", value: id, testId: "organization-identifier" }]} />
      <nav className="op-tabs" aria-label="Organization sections">
        <ul>
          {ORGANIZATION_TABS.map((tab) => (
            <li key={tab.key}>
              <Link
                href={`${base}?tab=${tab.key}`}
                aria-current={tab.key === current ? "page" : undefined}
                data-testid={`organization-tab-${tab.key}`}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** A form's fields in as many columns as fit, each at least 280 pixels; one column on a phone. */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="og-fields">{children}</div>;
}

/** A label and what it labels, `small` apart. */
export function Group({ children }: { children: ReactNode }) {
  return <div className="og-group">{children}</div>;
}

export type ReadOnlyField = { label: string; value: string | null; testId: string };

/**
 * Profile fields read-only, in the form's columns. Each value is text in a description list, so
 * the tab reads as its values and not only its labels (decision record 0048); an empty one says
 * "Not entered".
 */
export function ReadOnlyFields({ fields }: { fields: readonly ReadOnlyField[] }) {
  return (
    <dl className="og-fields">
      {fields.map((field) => (
        <div key={field.testId} className="og-field">
          <dt>{field.label}</dt>
          <dd data-testid={field.testId}>{field.value ? field.value : "Not entered"}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The stored logo, or the line saying there is none. Kept inside its column by the files domain's
 * image rule, not by spacing.
 */
export function StoredLogo({ fileId, legalName }: { fileId: string | null; legalName: string }) {
  if (!fileId) return <p className="op-note">No logo has been added.</p>;
  return (
    <div className="og-group" role="group" aria-labelledby="logo-label">
      <p className="og-group-label" id="logo-label">
        Logo
      </p>
      <img src={fileAddress(fileId)} alt={`${legalName} logo`} className="og-logo" data-testid="organization-current-logo" />
    </div>
  );
}

/**
 * The region where Archive is offered. It sits inside the Organization tab's section, so the tab
 * offers Edit and Archive together (R-3.18; decision record 0049), with the H3 a nested section
 * needs drawn in the size the stories give a region heading.
 */
export function ArchiveRegion({ children }: { children: ReactNode }) {
  return (
    <section className="op-region" aria-labelledby="archive-heading">
      <Heading level={3} id="archive-heading" style={look.section}>
        Archive this organization
      </Heading>
      {children}
    </section>
  );
}

/** A dialog's body text, `medium` apart. */
export function DialogText({ children }: { children: ReactNode }) {
  return <div className="og-body">{children}</div>;
}

// ——— The organization list ———

const yesNo = (value: boolean) => (value ? "Yes" : "No");

// Owner, team size and the two qualification marks.
const DETAIL_COLUMNS = 4;

function OrganizationName({ organization }: { organization: ListedOrganization }) {
  const name = <span data-testid="organization-list-name">{organization.legalName}</span>;
  // The service sends the details exactly where the viewer may open the organization (R-3.3).
  return organization.details ? (
    <Link href={`/organizations/${organization.id}/edit`} data-testid="organization-list-name-link">
      {name}
    </Link>
  ) : (
    name
  );
}

/** The logo, which anyone may see (R-8.28), above the name; the name alone where there is none. */
function NameWithLogo({ organization }: { organization: ListedOrganization }) {
  if (!organization.logoImageFile) return <OrganizationName organization={organization} />;
  return (
    <span className="og-cell">
      <img src={fileAddress(organization.logoImageFile)} alt={`${organization.legalName} logo`} className="og-logo" />
      <OrganizationName organization={organization} />
    </span>
  );
}

/**
 * The list: a table on a wide screen, one stacked card per organization on a phone, its name first
 * and its facts on one line beneath (rule 7). The switch is read in script, as the header's is, so
 * each row and its test IDs appear once. `full` is whether the owner and qualification columns are
 * offered at all (R-3.21). A row the viewer is not told about is one cell across the table, so it
 * has no blank cells to read (decision record 0048).
 */
export function OrganizationRows({
  organizations,
  full,
  caption,
}: {
  organizations: readonly ListedOrganization[];
  full: boolean;
  caption: string;
}) {
  const narrow = useNarrow();
  if (narrow) {
    return (
      <>
        <p id="organization-list-caption" className="op-note">
          {caption}
        </p>
        <ul className="og-cards" aria-labelledby="organization-list-caption">
          {organizations.map((o) => (
            <li key={o.id} data-testid="organization-list-row">
              <article className="og-card" aria-labelledby={`organization-${o.id}`}>
                {o.logoImageFile ? <img src={fileAddress(o.logoImageFile)} alt={`${o.legalName} logo`} className="og-logo" /> : null}
                <Heading level={2} id={`organization-${o.id}`} className="og-card-name" style={look.title}>
                  <OrganizationName organization={o} />
                </Heading>
                {full && o.details ? (
                  <div className="og-card-facts">
                    <span>
                      Owner: <span data-testid="organization-list-owner">{o.details.ownerName}</span>
                    </span>
                    <span>
                      Team size: <span data-testid="organization-list-team-size">{o.details.numTeamMembers}</span>
                    </span>
                    <span>
                      Sprint With Us qualified: <span data-testid="organization-swu-qualified-mark">{yesNo(o.details.swuQualified)}</span>
                    </span>
                    <span>
                      Team With Us qualified: <span data-testid="organization-twu-qualified-mark">{yesNo(o.details.twuQualified)}</span>
                    </span>
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </>
    );
  }
  const columns = full ? ["Organization", "Owner", "Team size", "Sprint With Us qualified", "Team With Us qualified"] : ["Organization"];
  return (
    <DataTable captionId="organization-list-caption" caption={caption} columns={columns}>
      {organizations.map((o) => (
        <tr key={o.id} data-testid="organization-list-row">
          <td colSpan={full && !o.details ? DETAIL_COLUMNS + 1 : undefined}>
            <NameWithLogo organization={o} />
          </td>
          {full && o.details ? (
            <>
              <td>
                <span data-testid="organization-list-owner">{o.details.ownerName}</span>
              </td>
              <td>
                <span data-testid="organization-list-team-size">{o.details.numTeamMembers}</span>
              </td>
              <td>
                <span data-testid="organization-swu-qualified-mark">{yesNo(o.details.swuQualified)}</span>
              </td>
              <td>
                <span data-testid="organization-twu-qualified-mark">{yesNo(o.details.twuQualified)}</span>
              </td>
            </>
          ) : null}
        </tr>
      ))}
    </DataTable>
  );
}

/**
 * The list's pages, fifty organizations each (R-3.1). Links, because each page has its own
 * address; the current page carries `aria-current="page"` and bold text, and a number alone is
 * named "Page N".
 */
export function Pagination({ page, pages }: { page: number; pages: number }) {
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="og-pages" aria-label="Pages of organizations" data-testid="organization-list-pagination">
      <ul>
        <li>{`Page ${page} of ${pages}`}</li>
        {page > 1 ? (
          <li>
            <Link href={`/organizations?page=${page - 1}`} data-testid="organization-list-page-link">
              Previous page
            </Link>
          </li>
        ) : null}
        {numbers.map((n) => (
          <li key={n}>
            <Link
              href={`/organizations?page=${n}`}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
              data-testid="organization-list-page-link"
            >
              {String(n)}
            </Link>
          </li>
        ))}
        {page < pages ? (
          <li>
            <Link href={`/organizations?page=${page + 1}`} data-testid="organization-list-page-link">
              Next page
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
