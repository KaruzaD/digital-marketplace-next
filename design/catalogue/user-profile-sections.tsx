import type { ReactNode } from "react";
import { Button, Checkbox, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region } from "./opportunity-kit";
import { AccountFacts, ProfileTabs, ReadOnlyDetails, SaveStatus, STAFF_TABS, UserPage, VENDOR_TABS } from "./user-kit";

// The profile's sections other than the profile itself, as the users domain's stories draw them, and the two profile
// sections a refused section shows instead (design/DESIGN.md, "User screens in the chosen direction"). Each is reached
// both by identifier (`/users/:userId?tab=…`) and as the signed-in person (`/users/me?tab=…`); `base` is the address.
// The words are the stories' own; capability names and descriptions, and the privacy policy, are placeholders.

const CAPABILITIES = [
  { key: "backend", name: "Backend development", held: true, expanded: true, description: "Building and maintaining server-side services and data stores." },
  { key: "frontend", name: "Frontend development", held: true, expanded: false, description: "Building accessible user interfaces for the web." },
  { key: "research", name: "User research", held: false, expanded: false, description: "Planning and running research with the people who use a service." },
];

// A vendor's capabilities: one row each, the checkbox and its description toggle on one line where they fit, the
// description beneath when it is shown. Choices save as they are made.
export function CapabilitiesPage({ base }: { base: string }) {
  return (
    <UserPage>
      <PageTitle>Capabilities</PageTitle>
      <ProfileTabs base={base} current="capabilities" tabs={VENDOR_TABS} />
      <p className="op-text">
        Tick each capability you have. Your choices are saved as you make them, and you may leave them all unticked.
      </p>
      <ul className="us-rows" aria-label="Capabilities">
        {CAPABILITIES.map((c) => (
          <li key={c.key} className="us-row" data-testid="capability-row">
            <div className="us-row-line">
              <Checkbox defaultSelected={c.held} data-testid="capability-checkbox">{c.name}</Checkbox>
              <Button
                variant="tertiary"
                size="small"
                aria-expanded={c.expanded}
                aria-controls={`capability-${c.key}-description`}
                data-testid="capability-description-toggle"
              >
                {c.expanded ? `Hide description of ${c.name}` : `Show description of ${c.name}`}
              </Button>
            </div>
            <div id={`capability-${c.key}-description`} hidden={!c.expanded}>
              {c.expanded && <p className="us-description" data-testid="capability-description">{c.description}</p>}
            </div>
          </li>
        ))}
      </ul>
      <SaveStatus />
    </UserPage>
  );
}

// Notifications: the address notices go to, a way to correct it, and the new-opportunities checkbox, which saves at
// once. `tabs` is left out where the story behind a dialog trims the section links. A dialog story passes it as
// `children`.
export function NotificationsPage({ base, tabs = true, children }: { base: string; tabs?: boolean; children?: ReactNode }) {
  return (
    <UserPage>
      <PageTitle>Notifications</PageTitle>
      {tabs ? <ProfileTabs base={base} current="notifications" tabs={VENDOR_TABS} /> : null}
      <p className="op-text" data-testid="notifications-email-address">
        Notifications are sent to vendor1@example.com. If this address is wrong, <Link href={base}>correct it on your profile</Link>.
      </p>
      <Checkbox defaultSelected data-testid="notifications-new-opportunities-checkbox">
        Email me when new opportunities are posted
      </Checkbox>
      {tabs ? <SaveStatus /> : null}
      {children}
    </UserPage>
  );
}

// The legal section: the privacy policy, the terms and conditions with when they were agreed, and the programs' terms.
// `updated` is the state after an administrator announced changed terms.
export function LegalPage({ base, updated = false }: { base: string; updated?: boolean }) {
  return (
    <UserPage>
      <PageTitle>Policies, Terms &amp; Agreements</PageTitle>
      {updated ? null : <ProfileTabs base={base} current="legal" tabs={VENDOR_TABS} />}
      <Region id="privacy-heading" title="Privacy policy" testId="legal-privacy-policy">
        <p className="op-text">[Privacy policy text supplied by the service.]</p>
        <p className="op-text">You agreed to this policy when your account was created.</p>
      </Region>
      <Region id="terms-heading" title="Terms and conditions">
        {updated ? (
          <div data-testid="legal-terms-updated-warning">
            <InlineAlert
              variant="warning"
              title="The terms and conditions have changed"
              description="Review and agree to the updated terms and conditions to continue using the Digital Marketplace."
              buttons={
                <Button variant="primary" data-testid="legal-accept-updated-terms-button">Review and agree to the updated terms</Button>
              }
            />
          </div>
        ) : null}
        <p className="op-text">
          <Link href="/content/terms-and-conditions" data-testid="legal-app-terms-link">Read the Digital Marketplace terms and conditions</Link>
        </p>
        <p className="op-text" data-testid="legal-accepted-on">
          {updated
            ? "You last agreed to terms and conditions on September 1, 2026 at 10:30 a.m."
            : "You agreed to the terms and conditions on September 1, 2026 at 10:30 a.m."}
        </p>
      </Region>
      <Region id="program-terms-heading" title="Program terms">
        <ul className="op-list">
          <li><Link href="/content/code-with-us-terms-and-conditions" data-testid="legal-program-terms-link">Code With Us terms and conditions</Link></li>
          <li><Link href="/content/sprint-with-us-terms-and-conditions" data-testid="legal-program-terms-link">Sprint With Us terms and conditions</Link></li>
          <li><Link href="/content/team-with-us-terms-and-conditions" data-testid="legal-program-terms-link">Team With Us terms and conditions</Link></li>
        </ul>
      </Region>
    </UserPage>
  );
}

// What an administrator who asked for a section of a vendor's profile that only the vendor is offered is shown
// instead: the profile section, with no section links (R-4.34).
export function VendorProfileForAdministrator() {
  return (
    <UserPage>
      <PageTitle>User Profile</PageTitle>
      <AccountFacts type="Vendor" status="Active" />
      <ReadOnlyDetails username="test-vendor-1" name="Test Vendor One" email="vendor1@example.com" />
      <Region id="permissions-heading" title="Permissions">
        <Checkbox data-testid="profile-admin-checkbox">Administrator</Checkbox>
      </Region>
      <Region id="status-heading" title="Account status">
        <Actions>
          <Button variant="secondary" danger data-testid="profile-deactivate-button">Deactivate account</Button>
        </Actions>
      </Region>
    </UserPage>
  );
}

// What a public sector employee who asked for a section their own profile does not offer is shown instead: their
// profile section (R-4.34, R-4.33).
export function PublicSectorOwnProfile() {
  return (
    <UserPage>
      <PageTitle>User Profile</PageTitle>
      <ProfileTabs base="/users/me" current="profile" tabs={STAFF_TABS} />
      <AccountFacts type="Public sector employee" />
      <ReadOnlyDetails username="test-gov" name="Test Public Servant" email="gov@example.com" jobTitle="Procurement officer">
        <Actions>
          <Button variant="primary" data-testid="profile-edit-button">Edit profile</Button>
        </Actions>
      </ReadOnlyDetails>
      <Region id="permissions-heading" title="Permissions">
        <p className="op-text" data-testid="profile-permissions-label">You do not have administrator permissions.</p>
      </Region>
    </UserPage>
  );
}
