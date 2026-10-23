import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { PROFILE_FIELDS, ProfileField, mayChangeOrganization } from "@rules/organizations";
import type { Account } from "../api/accounts";
import {
  Organization,
  archiveOrganization,
  fetchOrganization,
  updateOrganizationProfile,
} from "../api/organizations";
import { useSession } from "../auth/session";
import { useGoTo } from "../app/go-to";
import { useLoadingShown } from "../app/loading";
import { NotFound } from "../app/not-found";
import { Actions, PageTitle, Region, Waiting } from "../app/opportunity-kit";
import {
  ArchiveRegion,
  DialogText,
  ManagementTop,
  OrganizationPage,
  OrganizationTabKey,
  ReadOnlyFields,
  StoredLogo,
  organizationTabOf,
} from "../app/organization-kit";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import {
  ADDRESS_FIELDS,
  CONTACT_FIELDS,
  DETAILS_FIELDS,
  FIELD_TEST_IDS,
  OrganizationForm,
  valuesOf,
} from "./organization-form";
import { ChangelogTab, TeamTab } from "./organization-team";
import { SwuQualificationTab, TwuQualificationTab } from "./organization-qualification";

/**
 * An organization's management page, at `/organizations/:orgId/edit` (organization-edit).
 *
 * Opened by a service administrator and by the organization's owner and administrators; anyone
 * else, and anyone at an archived or unknown organization, is shown the missing page (R-3.3).
 * The Organization tab shows the profile read-only, and offers Edit and Archive to the owner and
 * a service administrator alone; an organization administrator who is not the owner sees the
 * profile with neither control (R-3.18). The Team members and Changelog tabs are in
 * `organization-team.tsx` (slice 12), and the two qualification tabs in
 * `organization-qualification.tsx` (slice 13).
 */

export function OrganizationEditScreen({ orgId }: { orgId: string }) {
  const session = useSession();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const [answer, setAnswer] = useState<Organization | "loading" | "missing" | "failed">("loading");
  const viewer = session.status === "signed-in" ? session.account : null;
  const viewerId = viewer?.id ?? null;
  const settled = session.status !== "starting";

  useEffect(() => {
    if (!settled || !viewerId) return;
    let current = true;
    setAnswer("loading");
    void fetchOrganization(orgId).then((found) => {
      if (!current) return;
      setAnswer(found.kind === "found" ? found.organization : found.kind);
    });
    return () => {
      current = false;
    };
  }, [orgId, settled, viewerId]);

  const loading = !settled || (viewer !== null && answer === "loading");
  const loadingShown = useLoadingShown(loading);
  if (loading) {
    if (!loadingShown) return null;
    return (
      <OrganizationPage>
        <PageTitle>Edit Organization</PageTitle>
        <Waiting label="Loading organization" />
      </OrganizationPage>
    );
  }
  if (!viewer || answer === "missing" || answer === "loading") return <NotFound />;
  if (answer === "failed") return <Failed />;
  if (!answer.active) return <NotFound />;
  return <ManageOrganization viewer={viewer} organization={answer} tab={organizationTabOf(search.tab)} onChanged={setAnswer} />;
}

function Failed() {
  useScreenTitle("Edit Organization");
  return (
    <OrganizationPage>
      <PageTitle>Edit Organization</PageTitle>
      <TitledAlert variant="danger" role="alert" title="The organization could not be loaded">
        <p className="op-text">Try again in a moment.</p>
      </TitledAlert>
    </OrganizationPage>
  );
}

function ManageOrganization({
  viewer,
  organization,
  tab,
  onChanged,
}: {
  viewer: Account;
  organization: Organization;
  tab: OrganizationTabKey;
  onChanged: (organization: Organization) => void;
}) {
  useScreenTitle("Edit Organization");
  return (
    <OrganizationPage>
      <ManagementTop
        id={organization.id}
        legalName={organization.legalName}
        swu={organization.swuQualified}
        twu={organization.twuQualified}
        current={tab}
      />
      {tab === "organization" ? (
        <OrganizationTab viewer={viewer} organization={organization} onChanged={onChanged} />
      ) : tab === "team" ? (
        <TeamTab viewer={viewer} organization={organization} onChanged={onChanged} />
      ) : tab === "swu-qualification" ? (
        <SwuQualificationTab organization={organization} />
      ) : tab === "twu-qualification" ? (
        <TwuQualificationTab viewer={viewer} organization={organization} onChanged={onChanged} />
      ) : (
        <ChangelogTab organization={organization} />
      )}
    </OrganizationPage>
  );
}

/** The fields named, read-only, as the tab shows them. */
function readOnly(organization: Organization, fields: readonly ProfileField[]) {
  return fields.map((field) => ({ label: PROFILE_FIELDS[field].label, value: organization[field], testId: FIELD_TEST_IDS[field] }));
}

function OrganizationTab({
  viewer,
  organization,
  onChanged,
}: {
  viewer: Account;
  organization: Organization;
  onChanged: (organization: Organization) => void;
}) {
  const [editing, setEditing] = useState(false);
  const mayChange = mayChangeOrganization(viewer, organization.viewerMembership);

  if (editing && mayChange) {
    return (
      <OrganizationForm
        kind="edit"
        initial={valuesOf(organization)}
        storedLogo={organization.logoImageFile}
        ownerName={organization.legalName}
        save={(profile, logo) => updateOrganizationProfile(organization.id, profile, logo)}
        onSaved={(saved) => {
          onChanged(saved);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <Region id="tab-heading" title="Organization">
      {mayChange ? (
        <Actions>
          <Button variant="primary" onPress={() => setEditing(true)} data-testid="organization-edit-button">
            Edit organization
          </Button>
        </Actions>
      ) : (
        <p className="op-text">Only the organization’s owner can change these details.</p>
      )}
      <StoredLogo fileId={organization.logoImageFile} legalName={organization.legalName} />
      <ReadOnlyFields fields={readOnly(organization, DETAILS_FIELDS)} />
      <Region id="address-heading" title="Address" level={3}>
        <ReadOnlyFields fields={readOnly(organization, ADDRESS_FIELDS)} />
      </Region>
      <Region id="contact-heading" title="Contact" level={3}>
        <ReadOnlyFields fields={readOnly(organization, CONTACT_FIELDS)} />
      </Region>
      {mayChange ? <ArchiveSection viewer={viewer} organization={organization} /> : null}
    </Region>
  );
}

/**
 * Archiving, by the owner or a service administrator (R-3.6, R-3.18). It asks first, saying what
 * archiving does, and — when a service administrator archives an organization — that its owner
 * will be emailed (R-3.24). Once archived, the organization has left the list it is taken to.
 */
function ArchiveSection({ viewer, organization }: { viewer: Account; organization: Organization }) {
  const goTo = useGoTo();
  const [asking, setAsking] = useState(false);
  const [working, setWorking] = useState(false);
  const [failed, setFailed] = useState<readonly string[] | null>(null);

  async function archive() {
    if (working) return;
    setWorking(true);
    setFailed(null);
    const answer = await archiveOrganization(organization.id);
    setWorking(false);
    setAsking(false);
    if (answer.kind === "saved") {
      goTo("/organizations");
      return;
    }
    setFailed(answer.reasons);
  }

  const administratorArchiving = viewer.type === "ADMIN" && organization.viewerMembership?.membershipType !== "OWNER";

  return (
    <ArchiveRegion>
      <p className="op-text">
        An archived organization leaves the organization list and its members’ lists of organizations, and can no longer be
        used on proposals. Its records are kept.
      </p>
      {failed ? (
        <TitledAlert variant="danger" role="alert" title="The organization could not be archived">
          <p className="op-text">{failed.join(" ") || "Try again in a moment."}</p>
        </TitledAlert>
      ) : null}
      <Actions>
        <Button variant="secondary" danger onPress={() => setAsking(true)} data-testid="organization-archive-button">
          Archive organization
        </Button>
      </Actions>
      <Modal isOpen={asking} isDismissable onOpenChange={(open) => (working ? undefined : setAsking(open))}>
        <AlertDialog
          variant="destructive"
          title={`Archive ${organization.legalName}?`}
          data-testid="organization-archive-dialog"
          buttons={
            <>
              <Button variant="secondary" isDisabled={working} onPress={() => setAsking(false)} data-testid="organization-dialog-cancel">
                Cancel
              </Button>
              <Button
                variant="primary"
                danger
                isDisabled={working}
                onPress={() => void archive()}
                data-testid="organization-archive-confirm"
              >
                Archive organization
              </Button>
            </>
          }
        >
          <DialogText>
            <p className="op-text">
              It will no longer appear in the organization list or in its members’ lists of organizations, and it cannot be used
              on proposals. Its records and memberships are kept.
            </p>
            {administratorArchiving ? (
              <p className="op-text">
                {organization.ownerName
                  ? `${organization.ownerName}, the owner, will be emailed that an administrator has archived it.`
                  : "The owner will be emailed that an administrator has archived it."}
              </p>
            ) : null}
          </DialogText>
        </AlertDialog>
      </Modal>
    </ArchiveRegion>
  );
}
