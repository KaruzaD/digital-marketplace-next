import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Heading,
  InlineAlert,
  Link,
  Modal,
  TextField,
} from "@bcgov/design-system-react-components";
import {
  accountKindLabel,
  accountStatusLabel,
  compareListedAccounts,
  nameMatchesSearch,
} from "@rules/users";
import { Account, downloadContactList, fetchAccounts } from "../api/accounts";
import { look } from "../app/marketplace";
import { NotFound } from "../app/not-found";
import { DataTable, PageTitle, Waiting } from "../app/opportunity-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { useNarrow } from "../app/site-header";
import { AccountStatus, DialogBody, SaveStatus, Toolbar, UserPage } from "../app/user-kit";

/**
 * Digital Marketplace Users, at `/users` (user-list). An administrator browses everyone
 * registered, narrows the list by name, opens a person's profile, and exports a contact list
 * (R-4.14, R-4.32). Anyone else is shown the missing page and no request is made, as the service
 * would refuse it (R-4.21).
 */
export function UserListScreen() {
  return (
    <RequireSignIn title="Digital Marketplace Users" loadingLabel="Loading users…">
      {(viewer) => (viewer.type === "ADMIN" ? <UserList /> : <NotFound />)}
    </RequireSignIn>
  );
}

const caption = "Everyone registered, active accounts first, then by account type and name";

function UserList() {
  useScreenTitle("Digital Marketplace Users");
  const [answer, setAnswer] = useState<readonly Account[] | "loading" | "refused">("loading");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let current = true;
    void fetchAccounts().then((found) => {
      if (current) setAnswer(found.kind === "listed" ? [...found.accounts].sort(compareListedAccounts) : "refused");
    });
    return () => {
      current = false;
    };
  }, []);

  const shown = useMemo(
    () => (Array.isArray(answer) ? answer.filter((account) => nameMatchesSearch(account.name, search)) : []),
    [answer, search],
  );

  if (answer === "refused") return <NotFound />;
  return (
    <UserPage>
      <PageTitle>Digital Marketplace Users</PageTitle>
      {answer === "loading" ? (
        <Waiting label="Loading users" />
      ) : (
        <>
          <Toolbar>
            <TextField
              type="search"
              label="Search by name"
              value={search}
              onChange={setSearch}
              data-testid="user-list-search"
            />
            <Button variant="secondary" onPress={() => setExporting(true)} data-testid="contact-list-open-export">
              Export contact list
            </Button>
          </Toolbar>
          <UserRows accounts={shown} />
          <SaveStatus>
            {search.trim() ? `${shown.length} of ${answer.length} ${answer.length === 1 ? "person" : "people"} shown` : null}
          </SaveStatus>
          <ExportContactList isOpen={exporting} onClose={() => setExporting(false)} />
        </>
      )}
    </UserPage>
  );
}

/**
 * The rows of the list. On a wide screen a table with a column for each fact; below the header's
 * switch point each account is a stacked card, its name first and its facts on one line beneath.
 * The switch is read in script, as the header's is, so each row and its test IDs appear once.
 */
function UserRows({ accounts }: { accounts: readonly Account[] }) {
  if (useNarrow()) {
    return (
      <>
        <p id="user-list-caption" className="op-note">
          {caption}
        </p>
        <ul className="us-cards" aria-labelledby="user-list-caption">
          {accounts.map((account) => (
            <li key={account.id} data-testid="user-list-row">
              <article className="us-card" aria-labelledby={`user-${account.id}`}>
                <Heading level={2} id={`user-${account.id}`} style={look.title}>
                  <Link href={`/users/${account.id}`} data-testid="user-list-profile-link">
                    {account.name}
                  </Link>
                </Heading>
                <div className="us-card-facts">
                  <AccountStatus testId="user-list-status-badge">{accountStatusLabel(account.status)}</AccountStatus>
                  <span data-testid="user-list-account-type">{accountKindLabel(account.type)}</span>
                  <span>
                    Administrator: <span data-testid="user-list-admin-check">{account.type === "ADMIN" ? "Yes" : "No"}</span>
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
      {accounts.map((account) => (
        <tr key={account.id} data-testid="user-list-row">
          <td>
            <AccountStatus testId="user-list-status-badge">{accountStatusLabel(account.status)}</AccountStatus>
          </td>
          <td>
            <span data-testid="user-list-account-type">{accountKindLabel(account.type)}</span>
          </td>
          <td>
            <Link href={`/users/${account.id}`} data-testid="user-list-profile-link">
              {account.name}
            </Link>
          </td>
          <td>
            <span data-testid="user-list-admin-check">{account.type === "ADMIN" ? "Yes" : "No"}</span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

/**
 * The contact-list export (R-4.32). Export is unavailable until at least one account type and
 * one field are ticked, and the reason is said before the buttons.
 */
function ExportContactList({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [kinds, setKinds] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState(false);
  const ready = kinds.length > 0 && fields.length > 0;

  function close() {
    if (working) return;
    setKinds([]);
    setFields([]);
    setFailed(false);
    onClose();
  }

  async function exportList() {
    if (!ready || working) return;
    setWorking(true);
    setFailed(false);
    const saved = await downloadContactList(kinds, fields);
    setWorking(false);
    if (saved) close();
    else setFailed(true);
  }

  return (
    <Modal isOpen={isOpen} isDismissable onOpenChange={(open) => (open ? undefined : close())}>
      <Dialog isCloseable data-testid="contact-list-modal">
        <DialogBody>
            <Heading level={2} slot="title" style={look.section}>
              Export contact list
            </Heading>
            <p className="op-text">The file lists active accounts only.</p>
            <CheckboxGroup
              label="Account types"
              description="Administrators are included with public sector employees."
              isRequired
              value={kinds}
              onChange={setKinds}
            >
              <Checkbox value="GOV" data-testid="contact-list-user-type">
                Public sector employees
              </Checkbox>
              <Checkbox value="VENDOR" data-testid="contact-list-user-type">
                Vendors
              </Checkbox>
            </CheckboxGroup>
            <CheckboxGroup label="Fields" isRequired value={fields} onChange={setFields}>
              <Checkbox value="firstName" data-testid="contact-list-field">
                First name
              </Checkbox>
              <Checkbox value="lastName" data-testid="contact-list-field">
                Last name
              </Checkbox>
              <Checkbox value="email" data-testid="contact-list-field">
                Email address
              </Checkbox>
              <Checkbox value="organizationName" data-testid="contact-list-field">
                Organization name
              </Checkbox>
            </CheckboxGroup>
            {failed ? (
              <InlineAlert
                variant="danger"
                role="alert"
                title="The contact list could not be exported"
                description="Nothing was saved. Please try again."
              />
            ) : null}
            {ready ? null : (
              <p id="contact-list-export-hint" className="op-note">
                Choose at least one account type and one field to export.
              </p>
            )}
            <ButtonGroup alignment="end" ariaLabel="Export actions">
              <Button variant="secondary" isDisabled={working} onPress={close} data-testid="contact-list-cancel-button">
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={!ready || working}
                aria-describedby={ready ? undefined : "contact-list-export-hint"}
                onPress={() => void exportList()}
                data-testid="contact-list-export-button"
              >
                Export
              </Button>
            </ButtonGroup>
        </DialogBody>
      </Dialog>
    </Modal>
  );
}
