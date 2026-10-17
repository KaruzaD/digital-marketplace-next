import type { ReactNode } from "react";
import { AlertDialog, Button, Link, Modal } from "@bcgov/design-system-react-components";
import { Actions, DataTable, PageTitle, Region, Waiting } from "./opportunity-kit";
import { Membership, OrganizationPage } from "./organization-kit";
import { useNarrow } from "./site";
import { ProfileTabs, VENDOR_TABS } from "./user-kit";

// A vendor's own organizations, the Organizations section of their profile, written once and used by both the
// by-identifier (`/users/:userId?tab=organizations`) and the `/users/me?tab=organizations` stories with the address
// passed in (design/DESIGN.md, "Organization screens in the chosen direction"). The words are the stories' own.

type Owned = { id: string; name: string; members: number; swu: boolean };
type Affiliated = { id: string; name: string; membership: "Member" | "Administrator" | "Pending"; open: boolean };

const OWNED: Owned[] = [{ id: "4a9e1c20-6d3b-4f1a-8e2c-000000000201", name: "Northwind Digital Co-operative", members: 3, swu: true }];

// The organization name is a link only where the person owns or administers it (R-3.3).
const AFFILIATED: Affiliated[] = [
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000204", name: "Aurora Data Collective", membership: "Member", open: false },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000202", name: "Pacific Service Design Ltd.", membership: "Administrator", open: true },
  { id: "4a9e1c20-6d3b-4f1a-8e2c-000000000205", name: "Tidewater Analytics Inc.", membership: "Pending", open: false },
];

const OWNED_CAPTION = "Owned organizations, with team size and Sprint With Us qualification";
const AFFILIATED_CAPTION = "Organizations you are a member of or have been invited to";

function OrganizationLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/organizations/${id}/edit`} data-testid="membership-organization-link">
      {name}
    </Link>
  );
}

// Accept and Decline on a pending invitation; Leave on an active membership (R-3.9, R-3.10, R-3.32).
function Commands({ row }: { row: Affiliated }) {
  if (row.membership === "Pending") {
    return (
      <div className="og-commands">
        <Button variant="tertiary" size="small" aria-label={`Accept the invitation from ${row.name}`} data-testid="membership-approve-button">
          Accept
        </Button>
        <Button variant="tertiary" size="small" danger aria-label={`Decline the invitation from ${row.name}`} data-testid="membership-reject-button">
          Decline
        </Button>
      </div>
    );
  }
  return (
    <div className="og-commands">
      <Button variant="tertiary" size="small" danger aria-label={`Leave ${row.name}`} data-testid="membership-leave-button">
        Leave
      </Button>
    </div>
  );
}

// Owned organizations: a table on a wide screen, one stacked card each on a phone (rule 7). `membership-owned-table` is
// on the table or on the cards' list.
function OwnedRows() {
  if (useNarrow()) {
    return (
      <>
        <p id="owned-caption" className="op-note">
          {OWNED_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="owned-caption" data-testid="membership-owned-table">
          {OWNED.map((o) => (
            <li key={o.id} className="og-card">
              <p className="og-card-name">
                <OrganizationLink id={o.id} name={o.name} />
              </p>
              <div className="og-card-facts">
                <span>
                  Team members: <span data-testid="membership-team-member-count">{o.members}</span>
                </span>
                <span>
                  Sprint With Us qualified: <span data-testid="organization-swu-qualified-mark">{o.swu ? "Yes" : "No"}</span>
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
      {OWNED.map((o) => (
        <tr key={o.id}>
          <td>
            <OrganizationLink id={o.id} name={o.name} />
          </td>
          <td>
            <span data-testid="membership-team-member-count">{o.members}</span>
          </td>
          <td>
            <span data-testid="organization-swu-qualified-mark">{o.swu ? "Yes" : "No"}</span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

// Organizations the person belongs to or is invited to: a table on a wide screen, one stacked card each on a phone.
function AffiliatedRows() {
  if (useNarrow()) {
    return (
      <>
        <p id="affiliated-caption" className="op-note">
          {AFFILIATED_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="affiliated-caption" data-testid="membership-affiliated-table">
          {AFFILIATED.map((a) => (
            <li key={a.id} className="og-card">
              <p className="og-card-name">{a.open ? <OrganizationLink id={a.id} name={a.name} /> : a.name}</p>
              <div className="og-card-facts">
                <Membership>{a.membership}</Membership>
              </div>
              <Commands row={a} />
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
      {AFFILIATED.map((a) => (
        <tr key={a.id}>
          <td>{a.open ? <OrganizationLink id={a.id} name={a.name} /> : a.name}</td>
          <td>
            <Membership>{a.membership}</Membership>
          </td>
          <td>
            <Commands row={a} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

function CreateLink() {
  return (
    <Actions>
      <Link href="/organizations/create" isButton buttonVariant="primary" data-testid="organization-create-link">
        Create organization
      </Link>
    </Actions>
  );
}

// The page's head: the H1 and the profile's section links with Organizations current.
function Top({ base }: { base: string }) {
  return (
    <>
      <PageTitle>My Organizations</PageTitle>
      <ProfileTabs base={base} current="organizations" tabs={VENDOR_TABS} />
    </>
  );
}

// The section with what it holds: the organization the person owns, one they administer, one they are an ordinary
// member of, and an invitation waiting for their answer. `children` is a dialog open over it.
export function MembershipsPage({ base, children }: { base: string; children?: ReactNode }) {
  return (
    <OrganizationPage>
      <Top base={base} />
      <Region id="owned-heading" title="Organizations you own">
        <CreateLink />
        <OwnedRows />
      </Region>
      <Region id="affiliated-heading" title="Organizations you belong to">
        <p className="op-text">Leaving an organization takes you off its team. You would need to be invited again to rejoin.</p>
        <AffiliatedRows />
      </Region>
      {children}
    </OrganizationPage>
  );
}

// No organization owned and none belonged to: each section says so in words instead of showing an empty table.
export function MembershipsEmpty({ base }: { base: string }) {
  return (
    <OrganizationPage>
      <Top base={base} />
      <Region id="owned-heading" title="Organizations you own">
        <p className="op-text" data-testid="membership-empty-owned">
          You do not own any organizations. Create one to propose on Sprint With Us and Team With Us opportunities.
        </p>
        <CreateLink />
      </Region>
      <Region id="affiliated-heading" title="Organizations you belong to">
        <p className="op-text" data-testid="membership-empty-affiliated">
          You do not belong to any other organizations. An organization’s owner or administrators can invite you by email.
        </p>
      </Region>
    </OrganizationPage>
  );
}

export function MembershipsLoading({ base }: { base: string }) {
  return (
    <OrganizationPage>
      <Top base={base} />
      <Waiting label="Loading organizations" />
    </OrganizationPage>
  );
}

// Joining an organization, confirmed (R-3.9, R-3.31). The invitation email's accept choice opens the page with this
// dialog already open (R-3.35).
export function AcceptDialog() {
  return (
    <Modal isOpen isDismissable>
      <AlertDialog
        variant="confirmation"
        title="Join Tidewater Analytics Inc.?"
        data-testid="membership-accept-dialog"
        buttons={
          <>
            <Button variant="secondary" data-testid="membership-dialog-cancel">
              Cancel
            </Button>
            <Button variant="primary" data-testid="membership-confirm-button">
              Join organization
            </Button>
          </>
        }
      >
        <p className="op-text">
          You will join Tidewater Analytics Inc.’s team and can be put forward on its proposals. Its owner will be emailed that you accepted.
        </p>
      </AlertDialog>
    </Modal>
  );
}

// Declining an invitation, confirmed (R-3.32). The invitation email's decline choice opens the page with this dialog
// already open (R-3.35).
export function DeclineDialog() {
  return (
    <Modal isOpen isDismissable>
      <AlertDialog
        variant="destructive"
        title="Decline the invitation from Tidewater Analytics Inc.?"
        data-testid="membership-decline-dialog"
        buttons={
          <>
            <Button variant="secondary" data-testid="membership-dialog-cancel">
              Cancel
            </Button>
            <Button variant="primary" danger data-testid="membership-confirm-button">
              Decline invitation
            </Button>
          </>
        }
      >
        <p className="op-text">The invitation will be removed and you will not join the team. Its owner will be emailed that you declined.</p>
      </AlertDialog>
    </Modal>
  );
}

// Leaving an organization, confirmed (R-3.10, R-3.32). Nobody is emailed.
export function LeaveDialog() {
  return (
    <Modal isOpen isDismissable>
      <AlertDialog
        variant="destructive"
        title="Leave Aurora Data Collective?"
        data-testid="membership-leave-dialog"
        buttons={
          <>
            <Button variant="secondary" data-testid="membership-dialog-cancel">
              Cancel
            </Button>
            <Button variant="primary" danger data-testid="membership-confirm-button">
              Leave organization
            </Button>
          </>
        }
      >
        <p className="op-text">
          You will no longer be on Aurora Data Collective’s team or be put forward on its proposals. To rejoin, you would need to be invited again.
        </p>
      </AlertDialog>
    </Modal>
  );
}
