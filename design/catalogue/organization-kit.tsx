import { useEffect, useRef, type ReactNode } from "react";
import { FileTrigger } from "react-aria-components";
import { Button, ButtonGroup, Form, Heading, InlineAlert, Link, TextField } from "@bcgov/design-system-react-components";
import { Label, look, type LabelColour } from "./marketplace";
import { Actions, DataTable, Details, OpportunityPage, PageTitle, Panel, Region, SectionTitle, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";
import { useNarrow, type Viewer } from "./site";

// The pieces the organizations domain's screens are put together from in the chosen direction (design/DESIGN.md,
// "Organization screens in the chosen direction"): the page frame, the management page's head and tabs, the profile
// fields read-only and as a form, the team, list and changelog rows (a table on a wide screen, stacked cards on a
// phone), the membership and requirement labels, the pagination, the terms page and the response reference. Built on
// opportunity-kit.tsx and marketplace.tsx; this project's own compositions of design-system components and tokens,
// none of them a design-system component.

// The person invited in the request stories, by the address those stories send. The other viewers are the users
// domain's (user-kit.tsx): Test Vendor One (vendor1@example.com) owns Northwind Digital Co-operative and Test Vendor Two
// (vendor2@example.com) administers it.
export const INVITED_VENDOR: Viewer = { role: "vendor", email: "vendor.four@example.com" };

export const ORG_ID = "4a9e1c20-6d3b-4f1a-8e2c-000000000201";
export const ORG_NAME = "Northwind Digital Co-operative";
export const ORG_BASE = `/organizations/${ORG_ID}/edit`;

// A membership in words. Owner, Administrator and Member are kinds of membership, not states, so they are grey, the
// direction's neutral. Pending is a state that waits on someone, and is yellow, as a pending team member is on the
// proposal screens. The label always carries its meaning in words.
export function membershipColour(membership: string): LabelColour {
  return membership.toLowerCase().startsWith("pending") ? "yellow" : "grey";
}

export function Membership({ children }: { children: string }) {
  const testId = children === "Owner" ? "organization-owner-badge" : children === "Pending" ? "organization-pending-badge" : undefined;
  return (
    <Label colour={membershipColour(children)} testId={testId}>
      {children}
    </Label>
  );
}

const css = `
.og-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  align-items: start;
}
.og-fields > * { margin: var(--layout-margin-none); }
.og-form, .og-body, .og-group, .og-card, .og-dialog { display: flex; flex-direction: column; }
.og-form > *, .og-body > *, .og-group > *, .og-card > *, .og-dialog > * { margin: var(--layout-margin-none); }
.og-form, .og-body { gap: var(--layout-margin-medium); }
.og-group { gap: var(--layout-margin-small); align-items: flex-start; }
.og-group-label { font: var(--typography-regular-label); color: var(--typography-color-primary); }
.og-logo { max-width: 100%; height: auto; }
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
.og-card-name { font: var(--typography-bold-body); color: var(--typography-color-primary); }
.og-card-name > a.bcds-react-aria-Link { font: inherit; }
.og-card-facts, .og-commands {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-small);
}
.og-card-facts { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.og-reqs {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
  font: var(--typography-regular-body);
  color: var(--typography-color-primary);
}
.og-reqs > li { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-small); }
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
.og-dialog { gap: var(--layout-margin-medium); padding: var(--layout-padding-large); }
.og-errors, .og-answer-list { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.og-answer-list > li + li { margin-top: var(--layout-margin-xsmall); }
.og-saved { margin: var(--layout-margin-none); font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.og-saved:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.og-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
@media (max-width: 767.98px) {
  .og-dialog { padding: var(--layout-padding-medium); }
}
`;

// A whole page of this domain: the opportunity page frame (the page container, the direction's style sheets, the
// regions `large` apart, `medium` on a phone) with this kit's style sheet.
export function OrganizationPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

// The management page's head: "Edit Organization" in small secondary text, the qualified labels (green: a state in good
// standing), the legal name as the H1 in the design system's H3 size; then the Organization ID as a detail.
export function OrganizationHead({ swu = false, twu = false }: { swu?: boolean; twu?: boolean }) {
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
        <PageTitle>{ORG_NAME}</PageTitle>
      </div>
      <Details items={[{ term: "Organization ID", value: ORG_ID, testId: "organization-identifier" }]} />
    </>
  );
}

export type OrganizationTabKey = "organization" | "team" | "swu-qualification" | "twu-qualification" | "changelog";

const TABS: { key: OrganizationTabKey; label: string }[] = [
  { key: "organization", label: "Organization" },
  { key: "team", label: "Team members" },
  { key: "swu-qualification", label: "Sprint With Us qualification" },
  { key: "twu-qualification", label: "Team With Us qualification" },
  { key: "changelog", label: "Changelog" },
];

// The management page's tabs. Each has its own address (`?tab=…`), so they are links in a navigation landmark, drawn as
// the opportunity manage page's tabs: small text along a rule, the current one marked by `aria-current="page"`, a bar
// and bold text, never colour alone. They wrap onto further lines on a phone.
export function OrganizationTabs({ current }: { current: OrganizationTabKey }) {
  return (
    <nav className="op-tabs" aria-label="Organization sections">
      <ul>
        {TABS.map((tab) => (
          <li key={tab.key}>
            <Link
              href={`${ORG_BASE}?tab=${tab.key}`}
              aria-current={tab.key === current ? "page" : undefined}
              data-testid={`organization-tab-${tab.key}`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// The management page down to its tabs: the head, the Organization ID and the tabs, in that order.
export function ManagementTop({ current, swu, twu }: { current: OrganizationTabKey; swu?: boolean; twu?: boolean }) {
  return (
    <>
      <OrganizationHead swu={swu} twu={twu} />
      <OrganizationTabs current={current} />
    </>
  );
}

// ——— The organization's profile ———

export type FieldKey =
  | "legalName"
  | "website"
  | "street"
  | "street2"
  | "city"
  | "region"
  | "mailCode"
  | "country"
  | "contactName"
  | "contactTitle"
  | "contactEmail"
  | "contactPhone";

export type Values = Partial<Record<FieldKey, string>>;

type Field = { id: string; label: string; testId: string; optional?: boolean; limited?: boolean; type?: "url" | "email" | "tel"; description?: string };

// Every field of the registration (R-3.22): required ones up to 100 characters, the contact email in a valid format, the
// optional ones marked "(optional)" in the label.
const FIELDS: Record<FieldKey, Field> = {
  legalName: { id: "org-legal-name", label: "Legal name", testId: "organization-legal-name-field", limited: true, description: "Up to 100 characters." },
  website: { id: "org-website", label: "Website", testId: "organization-website-field", optional: true, type: "url", description: "The full address, like https://example.com" },
  street: { id: "org-street", label: "Street address", testId: "organization-street-address-field", limited: true },
  street2: { id: "org-street-2", label: "Address line 2", testId: "organization-address-line-2-field", optional: true, limited: true },
  city: { id: "org-city", label: "City", testId: "organization-city-field", limited: true },
  region: { id: "org-region", label: "Province or state", testId: "organization-region-field", limited: true },
  mailCode: { id: "org-mail-code", label: "Postal code or ZIP code", testId: "organization-mail-code-field", limited: true },
  country: { id: "org-country", label: "Country", testId: "organization-country-field", limited: true },
  contactName: { id: "org-contact-name", label: "Contact name", testId: "organization-contact-name-field", limited: true },
  contactTitle: { id: "org-contact-title", label: "Contact title", testId: "organization-contact-title-field", optional: true, limited: true },
  contactEmail: { id: "org-contact-email", label: "Contact email address", testId: "organization-contact-email-field", type: "email" },
  contactPhone: { id: "org-contact-phone", label: "Contact phone number", testId: "organization-contact-phone-field", optional: true, type: "tel" },
};

export function fieldId(key: FieldKey): string {
  return FIELDS[key].id;
}

const DETAILS_FIELDS: FieldKey[] = ["legalName", "website"];
const ADDRESS_FIELDS: FieldKey[] = ["street", "street2", "city", "region", "mailCode", "country"];
const CONTACT_FIELDS: FieldKey[] = ["contactName", "contactTitle", "contactEmail", "contactPhone"];

// The stories' organization, as the service holds it.
export const NORTHWIND: Values = {
  legalName: ORG_NAME,
  website: "https://northwind.example.com",
  street: "100 Example Street",
  street2: "",
  city: "Victoria",
  region: "British Columbia",
  mailCode: "V0V 0V0",
  country: "Canada",
  contactName: "Test Vendor One",
  contactTitle: "Director",
  contactEmail: "vendor1@example.com",
  contactPhone: "250-555-0100",
};

function ReadField({ field, values }: { field: FieldKey; values: Values }) {
  const f = FIELDS[field];
  return <TextField label={f.label} value={values[field] ?? ""} isReadOnly data-testid={f.testId} />;
}

function EditField({ field, values, errors, editing }: { field: FieldKey; values: Values; errors: Values; editing: boolean }) {
  const f = FIELDS[field];
  const description = editing && field === "contactPhone" ? "Clear this field to remove the number." : f.description;
  const error = errors[field];
  return (
    <TextField
      id={f.id}
      label={f.optional ? `${f.label} (optional)` : f.label}
      type={f.type}
      isRequired={!f.optional}
      maxLength={f.limited ? 100 : undefined}
      description={description}
      defaultValue={values[field] ?? ""}
      isInvalid={error ? true : undefined}
      errorMessage={error}
      data-testid={f.testId}
    />
  );
}

function ReadFields({ fields, values }: { fields: FieldKey[]; values: Values }) {
  return (
    <div className="og-fields">
      {fields.map((field) => (
        <ReadField key={field} field={field} values={values} />
      ))}
    </div>
  );
}

function EditFields({ fields, values, errors, editing }: { fields: FieldKey[]; values: Values; errors: Values; editing: boolean }) {
  return (
    <div className="og-fields">
      {fields.map((field) => (
        <EditField key={field} field={field} values={values} errors={errors} editing={editing} />
      ))}
    </div>
  );
}

const STORED_LOGO = "/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000811?type=blob";

// The read-only profile: the logo (or the line saying there is none), the legal name and website, then the address and
// the contact, each an H3 in bold body text over its fields, in as many columns as fit.
export function ProfileDetails({ values = NORTHWIND, storedLogo = false }: { values?: Values; storedLogo?: boolean }) {
  return (
    <>
      {storedLogo ? (
        <div className="og-group" role="group" aria-labelledby="logo-label">
          <p className="og-group-label" id="logo-label">
            Logo
          </p>
          {/* Kept inside its column: the files domain's image rule, not spacing. */}
          <img src={STORED_LOGO} alt={`${ORG_NAME} logo`} className="og-logo" data-testid="organization-current-logo" />
        </div>
      ) : (
        <p className="op-note">No logo has been added.</p>
      )}
      <ReadFields fields={DETAILS_FIELDS} values={values} />
      <Region id="address-heading" title="Address" level={3}>
        <ReadFields fields={ADDRESS_FIELDS} values={values} />
      </Region>
      <Region id="contact-heading" title="Contact" level={3}>
        <ReadFields fields={CONTACT_FIELDS} values={values} />
      </Region>
    </>
  );
}

// The Organization tab, read-only. The owner and a service administrator are offered Edit organization, the screen's
// primary action; an organization administrator is told only the owner can change the details (R-3.18).
export function OrganizationTab({ canEdit, storedLogo = false }: { canEdit: boolean; storedLogo?: boolean }) {
  return (
    <Region id="tab-heading" title="Organization">
      {canEdit ? (
        <Actions>
          <Button variant="primary" data-testid="organization-edit-button">
            Edit organization
          </Button>
        </Actions>
      ) : (
        <p className="op-text">Only the organization’s owner can change these details.</p>
      )}
      <ProfileDetails storedLogo={storedLogo} />
    </Region>
  );
}

// The section that ends the Organization tab where Archive is offered (R-3.6, R-3.18).
export function ArchiveRegion() {
  return (
    <Region id="archive-heading" title="Archive this organization">
      <p className="op-text">
        An archived organization leaves the organization list and its members’ lists of organizations, and can no longer be used on proposals. Its records are kept.
      </p>
      <Actions>
        <Button variant="secondary" danger data-testid="organization-archive-button">
          Archive organization
        </Button>
      </Actions>
    </Region>
  );
}

// The logo chooser while no logo is stored: the line saying so and the trigger. The file rules are the files domain's.
function LogoChooser() {
  return (
    <div className="og-group">
      <p className="op-note">No logo has been added.</p>
      <FileTrigger acceptedFileTypes={["image/*"]}>
        <Button variant="secondary" data-testid="organization-logo-button">
          Choose a logo (optional)
        </Button>
      </FileTrigger>
    </div>
  );
}

// The logo chooser after a refused logo (R-8.30, R-8.21): the stored logo kept, the refusal, which takes focus when it
// appears, the file rule and the trigger. The files domain's image picker with "Logo" in place of "Profile picture".
function RefusedLogo({ fileName }: { fileName: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  return (
    <div className="og-group" role="group" aria-labelledby="logo-label">
      <p className="og-group-label" id="logo-label">
        Logo (optional)
      </p>
      <img src={STORED_LOGO} alt={`${ORG_NAME} logo`} className="og-logo" />
      <div ref={box} tabIndex={-1} className="og-focus" data-testid="organization-logo-refused-error">
        <InlineAlert variant="danger" role="alert">
          <AlertTitle>{fileName} cannot be used as a logo</AlertTitle>
          <p className="op-text">Choose a JPEG or PNG image. Its name must end in .jpg, .jpeg or .png. The current logo has been kept.</p>
        </InlineAlert>
      </div>
      <p id="logo-file-rule" className="op-note">
        A JPEG or PNG image, up to 10 MB. A logo wider or taller than 500 pixels is made smaller to fit, keeping its proportions. Anyone can see the logo,
        including people who are not signed in.
      </p>
      <FileTrigger acceptedFileTypes={["image/jpeg", "image/png"]}>
        <Button variant="secondary" aria-describedby="logo-file-rule" data-testid="organization-logo-button">
          Choose a different logo
        </Button>
      </FileTrigger>
    </div>
  );
}

export type Problem = { field: FieldKey; text: string };

// Why the submit button is unavailable, placed directly before it and named by its `aria-describedby`: a sentence while
// nothing is wrong yet, or the danger list of problems, each linking to its field. The list updates as the person
// works, so it neither takes focus nor is an alert.
function SubmitReason({ id, problems, verb }: { id: string; problems: Problem[]; verb: string }) {
  if (problems.length === 0) {
    return (
      <p id={id} className="op-note">
        Fill in every required field to {verb}.
      </p>
    );
  }
  return (
    <div id={id}>
      <InlineAlert variant="danger">
        <AlertTitle>
          Fix {problems.length} fields to {verb}
        </AlertTitle>
        <ul className="og-errors">
          {problems.map((problem) => (
            <li key={problem.field} data-testid="field-error">
              <Link href={`#${fieldId(problem.field)}`}>{problem.text}</Link>
            </li>
          ))}
        </ul>
      </InlineAlert>
    </div>
  );
}

// The registration form (R-3.22): three panels — Organization details, Address, Contact — then the reason Create is
// unavailable, and the submit row. `ready` means every required field is valid, so Create is offered and no reason shows.
export function CreateForm({ values = {}, errors = {}, problems = [], ready = false }: { values?: Values; errors?: Values; problems?: Problem[]; ready?: boolean }) {
  return (
    <Form validationBehavior="aria">
      <div className="og-form">
        <Panel id="org-details-heading" title="Organization details">
          <LogoChooser />
          <EditFields fields={DETAILS_FIELDS} values={values} errors={errors} editing={false} />
        </Panel>
        <Panel id="org-address-heading" title="Address">
          <EditFields fields={ADDRESS_FIELDS} values={values} errors={errors} editing={false} />
        </Panel>
        <Panel id="org-contact-heading" title="Contact">
          <EditFields fields={CONTACT_FIELDS} values={values} errors={errors} editing={false} />
        </Panel>
        {ready ? null : <SubmitReason id="org-submit-hint" problems={problems} verb="create the organization" />}
        <ButtonGroup ariaLabel="Organization actions">
          <Button
            type="submit"
            variant="primary"
            isDisabled={!ready}
            aria-describedby={ready ? undefined : "org-submit-hint"}
            data-testid="organization-submit-button"
          >
            Create organization
          </Button>
          <Button variant="secondary" data-testid="organization-create-cancel">
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  );
}

// The Organization tab in edit mode: the same fields as the registration, filled in, with Save changes and Cancel. Save
// is unavailable while any field is invalid, with the problems listed before it. `refusedLogo` is the file the service
// has just refused.
export function EditForm({
  values = NORTHWIND,
  errors = {},
  problems = [],
  refusedLogo,
}: {
  values?: Values;
  errors?: Values;
  problems?: Problem[];
  refusedLogo?: string;
}) {
  const invalid = problems.length > 0;
  return (
    <Form validationBehavior="aria">
      <div className="og-form">
        <SectionTitle id="tab-heading">Edit organization</SectionTitle>
        <p className="op-text">Fields not marked “(optional)” are required.</p>
        {refusedLogo ? <RefusedLogo fileName={refusedLogo} /> : <LogoChooser />}
        <EditFields fields={DETAILS_FIELDS} values={values} errors={errors} editing />
        <Region id="address-heading" title="Address" level={3}>
          <EditFields fields={ADDRESS_FIELDS} values={values} errors={errors} editing />
        </Region>
        <Region id="contact-heading" title="Contact" level={3}>
          <EditFields fields={CONTACT_FIELDS} values={values} errors={errors} editing />
        </Region>
        {invalid ? <SubmitReason id="org-save-hint" problems={problems} verb="save your changes" /> : null}
        <ButtonGroup ariaLabel="Organization actions">
          <Button
            type="submit"
            variant="primary"
            isDisabled={invalid}
            aria-describedby={invalid ? "org-save-hint" : undefined}
            data-testid="organization-save-button"
          >
            Save changes
          </Button>
          <Button variant="secondary" data-testid="organization-cancel-edit-button">
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  );
}

// ——— The team ———

type TeamMember = { id: string; name: string; membership: "Owner" | "Administrator" | "Member" | "Pending"; capabilities: number };

// Northwind's team: its owner, an administrator, an ordinary member and an invitation still pending (R-3.7, R-3.34).
const TEAM: TeamMember[] = [
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000003", name: "Test Vendor One", membership: "Owner", capabilities: 2 },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000004", name: "Test Vendor Two", membership: "Administrator", capabilities: 2 },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000007", name: "Test Vendor Four", membership: "Member", capabilities: 1 },
  { id: "0b6f2c1e-5a7d-4c3e-9f10-000000000006", name: "Test Vendor Three", membership: "Pending", capabilities: 1 },
];

// The commands a row offers. Nothing on the owner's row; administrator rights on active members; Approve on a pending
// row for a service administrator alone (R-3.9, R-3.10, R-3.11, R-3.12).
function MemberCommands({ member, asAdministrator }: { member: TeamMember; asAdministrator: boolean }) {
  if (member.membership === "Owner") return null;
  return (
    <div className="og-commands">
      {member.membership === "Administrator" ? (
        <Button variant="tertiary" size="small" aria-label={`Remove administrator rights from ${member.name}`} data-testid="organization-member-admin-toggle">
          Remove administrator rights
        </Button>
      ) : null}
      {member.membership === "Member" ? (
        <Button variant="tertiary" size="small" aria-label={`Give administrator rights to ${member.name}`} data-testid="organization-member-admin-toggle">
          Give administrator rights
        </Button>
      ) : null}
      {member.membership === "Pending" && asAdministrator ? (
        <Button variant="tertiary" size="small" aria-label={`Approve ${member.name}`} data-testid="organization-member-approve-button">
          Approve
        </Button>
      ) : null}
      <Button variant="tertiary" size="small" danger aria-label={`Remove ${member.name}`} data-testid="organization-member-remove-button">
        Remove
      </Button>
    </div>
  );
}

const TEAM_CAPTION = "Everyone who belongs to or has been invited to this organization";

// The team: a table on a wide screen, one stacked card per person on a phone (rule 7). The switch is read in script, as
// the header's is, so each row and its test IDs appear once.
function TeamRows({ asAdministrator }: { asAdministrator: boolean }) {
  const name = (member: TeamMember) => (member.membership === "Owner" && !asAdministrator ? `${member.name} (you)` : member.name);
  if (useNarrow()) {
    return (
      <>
        <p id="team-caption" className="op-note">
          {TEAM_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="team-caption">
          {TEAM.map((member) => (
            <li key={member.id} className="og-card" data-testid="organization-team-member-row">
              <p className="og-card-name">{name(member)}</p>
              <div className="og-card-facts">
                <Membership>{member.membership}</Membership>
                <span>Capabilities: {member.capabilities}</span>
              </div>
              <MemberCommands member={member} asAdministrator={asAdministrator} />
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <DataTable captionId="team-caption" caption={TEAM_CAPTION} columns={["Name", "Membership", "Capabilities", "Actions"]}>
      {TEAM.map((member) => (
        <tr key={member.id} data-testid="organization-team-member-row">
          <td>{name(member)}</td>
          <td>
            <Membership>{member.membership}</Membership>
          </td>
          <td>{member.capabilities}</td>
          <td>
            <MemberCommands member={member} asAdministrator={asAdministrator} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

// Capability names are illustrative: the spec does not carry the service's list.
const CAPABILITIES = [
  { name: "Backend development", held: true },
  { name: "Frontend development", held: true },
  { name: "Delivery management", held: true },
  { name: "User research", held: false },
];

// The Team members tab. `alert` is a page alert about the last invitation, shown first in the tab. A service
// administrator is also offered Change owner, because the organization has members besides its owner (R-3.13).
export function TeamTab({ asAdministrator = false, alert }: { asAdministrator?: boolean; alert?: ReactNode }) {
  return (
    <Region id="tab-heading" title="Team members">
      {alert}
      <p className="op-text">
        Team size: 3 active members. An invited person joins the team, and counts towards its size and capabilities, once they accept.
      </p>
      {asAdministrator ? (
        <ButtonGroup ariaLabel="Team actions">
          <Button variant="primary" data-testid="organization-add-team-members-button">
            Add team members
          </Button>
          <Button variant="secondary" data-testid="organization-change-owner-button">
            Change owner
          </Button>
        </ButtonGroup>
      ) : (
        <Actions>
          <Button variant="primary" data-testid="organization-add-team-members-button">
            Add team members
          </Button>
        </Actions>
      )}
      <TeamRows asAdministrator={asAdministrator} />
      <Region id="capabilities-heading" title="Team capabilities" level={3} testId="organization-team-capabilities">
        <p className="op-text">Only active members count. An invited person’s capabilities count once they accept.</p>
        <ul className="op-list">
          {CAPABILITIES.map((capability) => (
            <li key={capability.name} data-testid="organization-team-capability">
              {capability.name}: {capability.held ? "held" : "not held"}
            </li>
          ))}
        </ul>
      </Region>
    </Region>
  );
}

// An alert that carries a test ID: the design system's InlineAlert passes no `data-*`, so a wrapper holds it. With content
// of its own, the alert's title is written in its own title markup (the site shell's gap 4).
export function PageAlert({
  testId,
  variant,
  title,
  role,
  children,
}: {
  testId: string;
  variant: "info" | "warning" | "danger";
  title: string;
  role?: "alert";
  children: ReactNode;
}) {
  return (
    <div data-testid={testId}>
      <InlineAlert variant={variant} role={role}>
        <AlertTitle>{title}</AlertTitle>
        {children}
      </InlineAlert>
    </div>
  );
}

// The body of the two small dialogs (Add team members, Change owner): `large` inside, `medium` on a phone.
export function DialogBody({ children }: { children: ReactNode }) {
  return <div className="og-dialog">{children}</div>;
}

// ——— Qualification ———

export type Requirement = { testId: string; met: boolean; text: string };

// One program's requirements as a list, each beginning with Met (green) or Not met (yellow: it waits on the
// organization) in words, then the requirement.
export function Requirements({ label, items }: { label: string; items: Requirement[] }) {
  return (
    <ul className="og-reqs" aria-label={label}>
      {items.map((item) => (
        <li key={item.testId} data-testid={item.testId}>
          <Label colour={item.met ? "green" : "yellow"}>{item.met ? "Met" : "Not met"}</Label>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

// The status region an immediate save reports into (withdrawing rights, approving, saving service areas). It is on the
// page before anything is saved, so the outcome is announced; while empty it takes no room but stays in the
// accessibility tree.
export function SaveStatus() {
  return <p role="status" className="og-saved" />;
}

// ——— The organization list ———

export type ListedOrganization = {
  id: string;
  name: string;
  // Whether the viewer may open it: they own or administer it, or are a service administrator (R-3.3).
  open: boolean;
  // Owner, team size and qualification, shown only to whom R-3.21 allows.
  details?: { owner: string; size: number; swu: boolean; twu: boolean };
};

function OrganizationName({ organization }: { organization: ListedOrganization }) {
  const name = <span data-testid="organization-list-name">{organization.name}</span>;
  return organization.open ? (
    <Link href={`/organizations/${organization.id}/edit`} data-testid="organization-list-name-link">
      {name}
    </Link>
  ) : (
    name
  );
}

const yesNo = (value: boolean) => (value ? "Yes" : "No");

// The list: a table on a wide screen, one stacked card per organization on a phone, its name first and its facts on one
// line beneath (rule 7). `full` is whether the owner and qualification columns are offered at all (R-3.21).
export function OrganizationRows({ organizations, full, caption }: { organizations: ListedOrganization[]; full: boolean; caption: string }) {
  if (useNarrow()) {
    return (
      <>
        <p id="organization-list-caption" className="op-note">
          {caption}
        </p>
        <ul className="og-cards" aria-labelledby="organization-list-caption">
          {organizations.map((o) => (
            <li key={o.id} data-testid="organization-list-row">
              <article className="og-card" aria-labelledby={`organization-${o.id}`}>
                <Heading level={2} id={`organization-${o.id}`} style={look.title}>
                  <OrganizationName organization={o} />
                </Heading>
                {o.details ? (
                  <div className="og-card-facts">
                    <span>
                      Owner: <span data-testid="organization-list-owner">{o.details.owner}</span>
                    </span>
                    <span>
                      Team size: <span data-testid="organization-list-team-size">{o.details.size}</span>
                    </span>
                    <span>
                      Sprint With Us qualified: <span data-testid="organization-swu-qualified-mark">{yesNo(o.details.swu)}</span>
                    </span>
                    <span>
                      Team With Us qualified: <span data-testid="organization-twu-qualified-mark">{yesNo(o.details.twu)}</span>
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
          <td>
            <OrganizationName organization={o} />
          </td>
          {full ? (
            <>
              <td>{o.details ? <span data-testid="organization-list-owner">{o.details.owner}</span> : null}</td>
              <td>{o.details ? <span data-testid="organization-list-team-size">{o.details.size}</span> : null}</td>
              <td>{o.details ? <span data-testid="organization-swu-qualified-mark">{yesNo(o.details.swu)}</span> : null}</td>
              <td>{o.details ? <span data-testid="organization-twu-qualified-mark">{yesNo(o.details.twu)}</span> : null}</td>
            </>
          ) : null}
        </tr>
      ))}
    </DataTable>
  );
}

// The list's pages, fifty organizations each (R-3.1). Links, because each page has its own address; the current page
// carries `aria-current="page"` and bold text, and a number alone is named "Page N".
export function Pagination({ page, pages }: { page: number; pages: number }) {
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="og-pages" aria-label="Pages of organizations" data-testid="organization-list-pagination">
      <ul>
        <li>
          Page {page} of {pages}
        </li>
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
              {n}
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

// ——— The changelog ———

export type ChangelogEntry = { when: string; event: string; member: string; by: string };

const CHANGELOG_CAPTION = "Changes to administrator rights and ownership, newest first";

// The changelog: a table on a wide screen, one card per entry on a phone, the change and whom it concerned first, then
// when and who made it.
export function ChangelogRows({ entries }: { entries: ChangelogEntry[] }) {
  if (useNarrow()) {
    return (
      <>
        <p id="changelog-caption" className="op-note">
          {CHANGELOG_CAPTION}
        </p>
        <ul className="og-cards" aria-labelledby="changelog-caption">
          {entries.map((e) => (
            <li key={e.when} className="og-card" data-testid="organization-changelog-entry">
              <p className="og-card-name">
                {e.event}: {e.member}
              </p>
              <div className="og-card-facts">
                <span>{e.when}</span>
                <span>Made by {e.by}</span>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <DataTable captionId="changelog-caption" caption={CHANGELOG_CAPTION} columns={["Date", "Change", "Member", "Made by"]}>
      {entries.map((e) => (
        <tr key={e.when} data-testid="organization-changelog-entry">
          <td>{e.when}</td>
          <td>{e.event}</td>
          <td>{e.member}</td>
          <td>{e.by}</td>
        </tr>
      ))}
    </DataTable>
  );
}

// ——— The program terms pages ———

export type TermsProgram = "Sprint With Us" | "Team With Us";

// A program's terms for one organization: the organization's name in small secondary text over the H1, any line about
// acceptance, the terms text in a panel, then whatever the viewer may do.
export function TermsPage({ program, notice, children }: { program: TermsProgram; notice?: ReactNode; children: ReactNode }) {
  return (
    <OrganizationPage>
      <div className="op-head">
        <p className="op-eyebrow">{ORG_NAME}</p>
        <PageTitle>{program} Terms &amp; Conditions</PageTitle>
      </div>
      {notice}
      <Panel id="terms-heading" title="Terms and conditions" testId="organization-terms-body">
        <p className="op-text">[{program} terms and conditions text, supplied by the service.]</p>
      </Panel>
      {children}
    </OrganizationPage>
  );
}

// ——— Response references ———

// An address that answers with data, not a page: the small "Response reference" line and the H1, then the request and
// the answer, each a Region whose pairs are Details, with each test ID on the value (or on the list inside it) it names.
export function ResponseReference({
  title,
  idPrefix,
  requestTitle = "Request",
  request,
  answer,
}: {
  title: string;
  idPrefix: string;
  requestTitle?: string;
  request: Detail[];
  answer: Detail[];
}) {
  return (
    <OrganizationPage>
      <div className="op-head">
        <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
        <PageTitle>{title}</PageTitle>
      </div>
      <Region id={`${idPrefix}-request`} title={requestTitle}>
        <Details items={request} />
      </Region>
      <Region id={`${idPrefix}-answer`} title="Answer">
        <Details items={answer} />
      </Region>
    </OrganizationPage>
  );
}

// The three requests organization-request names, each carrying its action's test ID. Every state lists all three, then
// says which was sent and by whom. The methods are the design's reading of the addresses; the contract names the
// operations, not the methods (see DESIGN.md, "Organization screens in the chosen direction", gaps).
export const ORGANIZATION_REQUESTS: Detail[] = [
  {
    term: "Register an organization",
    value:
      "POST /api/organizations, sending the registration: legal name, street address, city, region, mail code, country, contact name and contact email, all required; website address, second street line, contact title and contact phone, optional",
    testId: "organization-request-register",
  },
  {
    term: "Change an organization’s profile",
    value: `PUT /api/organizations/${ORG_ID}, sending the profile-update operation with the same fields as a registration`,
    testId: "organization-request-change-profile",
  },
  {
    term: "Archive an organization",
    value: `DELETE /api/organizations/${ORG_ID}, which marks the organization inactive rather than removing it`,
    testId: "organization-request-archive",
  },
];

// A list inside a response's value: the organizations offered, the refusal's messages in the order given.
export function AnswerList({ ordered = false, testId, items }: { ordered?: boolean; testId?: string; items: string[] }) {
  const Element = ordered ? "ol" : "ul";
  return (
    <Element className="og-answer-list" data-testid={testId}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Element>
  );
}
