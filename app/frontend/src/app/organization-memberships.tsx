import type { ReactNode } from "react";
import { Link } from "@bcgov/design-system-react-components";
import { DataTable } from "./opportunity-kit";
import { Membership, type MembershipWords } from "./organization-kit";
import { useNarrow } from "./site-header";

/**
 * A vendor's own organizations as rows, as `design/catalogue/organization-memberships.tsx` draws
 * them: the owned and the affiliated organizations, each a table on a wide screen and stacked
 * cards on a phone, `membership-owned-table` and `membership-affiliated-table` on the table or on
 * the cards' list (decision record 0080). The switch is read in script, as the header's is, so
 * each row and its test IDs appear once.
 */

export type OwnedRow = { readonly key: string; readonly name: ReactNode; readonly members: number; readonly swu: boolean };

export type AffiliatedRow = {
  readonly key: string;
  readonly name: ReactNode;
  readonly membership: MembershipWords;
  readonly commands: ReactNode;
};

const OWNED_CAPTION = "Owned organizations, with team size and Sprint With Us qualification";
const AFFILIATED_CAPTION = "Organizations you are a member of or have been invited to";

/** The organization's name, linking to its management page. */
export function OrganizationLink({ id, children }: { id: string; children: string }) {
  return (
    <Link href={`/organizations/${id}/edit`} data-testid="membership-organization-link">
      {children}
    </Link>
  );
}

export function OwnedRows({ rows }: { rows: readonly OwnedRow[] }) {
  const narrow = useNarrow();
  if (narrow) {
    return (
      <>
        <p id="owned-caption" className="op-note">
          {OWNED_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="owned-caption" data-testid="membership-owned-table">
          {rows.map((row) => (
            <li key={row.key} className="og-card">
              <p className="og-card-name">{row.name}</p>
              <div className="og-card-facts">
                <span>
                  Team members: <span data-testid="membership-team-member-count">{row.members}</span>
                </span>
                <span>
                  Sprint With Us qualified: <span data-testid="organization-swu-qualified-mark">{row.swu ? "Yes" : "No"}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <DataTable
      captionId="owned-caption"
      caption={OWNED_CAPTION}
      columns={["Organization", "Team members", "Sprint With Us qualified"]}
      testId="membership-owned-table"
    >
      {rows.map((row) => (
        <tr key={row.key}>
          <td>{row.name}</td>
          <td>
            <span data-testid="membership-team-member-count">{row.members}</span>
          </td>
          <td>
            <span data-testid="organization-swu-qualified-mark">{row.swu ? "Yes" : "No"}</span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

export function AffiliatedRows({ rows }: { rows: readonly AffiliatedRow[] }) {
  const narrow = useNarrow();
  if (narrow) {
    return (
      <>
        <p id="affiliated-caption" className="op-note">
          {AFFILIATED_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="affiliated-caption" data-testid="membership-affiliated-table">
          {rows.map((row) => (
            <li key={row.key} className="og-card">
              <p className="og-card-name">{row.name}</p>
              <div className="og-card-facts">
                <Membership>{row.membership}</Membership>
              </div>
              {row.commands}
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <DataTable
      captionId="affiliated-caption"
      caption={AFFILIATED_CAPTION}
      columns={["Organization", "Membership", "Actions"]}
      testId="membership-affiliated-table"
    >
      {rows.map((row) => (
        <tr key={row.key}>
          <td>{row.name}</td>
          <td>
            <Membership>{row.membership}</Membership>
          </td>
          <td>{row.commands}</td>
        </tr>
      ))}
    </DataTable>
  );
}
