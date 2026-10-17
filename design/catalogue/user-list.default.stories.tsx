import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Heading, Link, TextField } from "@bcgov/design-system-react-components";
import { look } from "./marketplace";
import { DataTable, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS, useNarrow } from "./site";
import { ADMINISTRATOR, AccountStatus, UserPage } from "./user-kit";

// user-list · default — administrator browsing everyone registered (R-4.14, R-4.21)
const meta: Meta = { title: "users/user-list/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const users = [
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000001", status: "Active", type: "Public sector employee", name: "Test Administrator", admin: true },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000002", status: "Active", type: "Public sector employee", name: "Test Public Servant", admin: false },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000003", status: "Active", type: "Vendor", name: "Test Vendor One", admin: false },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000005", status: "Inactive", type: "Vendor", name: "Test Vendor Five", admin: false },
];

const caption = "Everyone registered, active accounts first, then by account type and name";

// Wide screens: a table with a column for each fact. Phones: each account is a stacked card, its name first and its
// facts on one line beneath (rule 7). The switch is read in script, as the header's is, so each row and its test IDs
// appear once.
function UserRows() {
  if (useNarrow()) {
    return (
      <>
        <p id="user-list-caption" className="op-note">{caption}</p>
        <ul className="us-cards" aria-labelledby="user-list-caption">
          {users.map((u) => (
            <li key={u.id} data-testid="user-list-row">
              <article className="us-card" aria-labelledby={`user-${u.id}`}>
                <Heading level={2} id={`user-${u.id}`} style={look.title}>
                  <Link href={`/users/${u.id}`} data-testid="user-list-profile-link">{u.name}</Link>
                </Heading>
                <div className="us-card-facts">
                  <AccountStatus testId="user-list-status-badge">{u.status}</AccountStatus>
                  <span data-testid="user-list-account-type">{u.type}</span>
                  <span>
                    Administrator: <span data-testid="user-list-admin-check">{u.admin ? "Yes" : "No"}</span>
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <DataTable captionId="user-list-caption" caption={caption} columns={["Status", "Account type", "Name", "Administrator"]}>
      {users.map((u) => (
        <tr key={u.id} data-testid="user-list-row">
          <td><AccountStatus testId="user-list-status-badge">{u.status}</AccountStatus></td>
          <td><span data-testid="user-list-account-type">{u.type}</span></td>
          <td><Link href={`/users/${u.id}`} data-testid="user-list-profile-link">{u.name}</Link></td>
          <td><span data-testid="user-list-admin-check">{u.admin ? "Yes" : "No"}</span></td>
        </tr>
      ))}
    </DataTable>
  );
}

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>Digital Marketplace Users</PageTitle>
        <div className="us-toolbar">
          <TextField type="search" label="Search by name" data-testid="user-list-search" />
          <Button variant="secondary" data-testid="contact-list-open-export">Export contact list</Button>
        </div>
        <UserRows />
      </UserPage>
    </SitePage>
  ),
};
