import { useState } from "react";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { mayQualifyServiceAreas, offersProgramTermsAcceptance } from "@rules/organizations";
import { SERVICE_AREAS } from "@rules/other-program-drafts";
import type { Account } from "../api/accounts";
import { Organization, qualifyServiceAreas } from "../api/organizations";
import { Actions, Region } from "../app/opportunity-kit";
import { PageAlert, Requirements, SaveStatus } from "../app/organization-kit";
import { readMoment } from "../lib/dates";

/**
 * The management page's two qualification tabs (organization-edit, slice 13): each program's
 * requirements with whether each is met, the terms and when they were accepted, and — on the Team
 * With Us tab — the approved service areas, which a service administrator alone may change
 * (R-3.25–R-3.28). What is met is the service's answer, read from the organization's record, so the
 * tab and the qualified marks never disagree. Drawn as the catalogue's `swu-qualification`,
 * `swu-qualified`, `twu-qualification`, `twu-administrator` and `service-areas-editing` stories
 * (decision record 0081).
 */

/**
 * How this screen labels and values each service area, as the catalogue story draws them
 * (organization-edit · service-areas-editing): a sentence-case label, and a kebab-case id as the
 * checkbox value. The service speaks in its own keys; the form translates at its edge.
 */
const SENTENCE_CASE: Record<string, string> = {
  FULL_STACK_DEVELOPER: "Full stack developer",
  DATA_PROFESSIONAL: "Data professional",
  AGILE_COACH: "Agile coach",
  DEVOPS_SPECIALIST: "DevOps specialist",
  SERVICE_DESIGNER: "Service designer",
};
const SERVICE_AREA_CHOICES = SERVICE_AREAS.map((area) => ({
  key: area.key as string,
  id: area.key.toLowerCase().replace(/_/g, "-"),
  label: SENTENCE_CASE[area.key] ?? area.name,
}));

const areaName = (key: string) => SERVICE_AREA_CHOICES.find((area) => area.key === key)?.label ?? key;
const areaId = (key: string) => SERVICE_AREA_CHOICES.find((area) => area.key === key)?.id ?? key;
const areaKey = (id: string) => SERVICE_AREA_CHOICES.find((area) => area.id === id)?.key ?? id;

function NotQualified({ program }: { program: string }) {
  return (
    <div data-testid="organization-not-qualified-notice">
      <InlineAlert
        variant="info"
        title={`This organization is not qualified for ${program}`}
        description={`It can propose on ${program} opportunities once every requirement below is met.`}
      />
    </div>
  );
}

/**
 * The terms region: when they were accepted, or that they have not been, and the link to the
 * terms page. The link offers to accept only to the person the terms page offers Accept to.
 */
function TermsRegion({
  organization,
  program,
  slug,
  acceptedOn,
  testIdPrefix,
}: {
  organization: Organization;
  program: string;
  slug: string;
  acceptedOn: string | null;
  testIdPrefix: "swu" | "twu";
}) {
  const accepted = acceptedOn ? readMoment(acceptedOn) : null;
  const offersAccept = offersProgramTermsAcceptance(organization.viewerMembership, acceptedOn);
  return (
    <Region id="terms-heading" title="Terms and conditions" level={3}>
      {accepted ? (
        <p className="op-text" data-testid={`organization-${testIdPrefix}-terms-accepted-on`}>
          Accepted on <time dateTime={accepted.dateTime}>{accepted.label}</time>
        </p>
      ) : (
        <p className="op-text">The {program} terms and conditions have not been accepted for this organization.</p>
      )}
      <p className="op-text">
        <Link href={`/organizations/${organization.id}/${slug}`} data-testid={`organization-view-${testIdPrefix}-terms-link`}>
          {offersAccept ? `Read and accept the ${program} terms and conditions` : `Read the ${program} terms and conditions`}
        </Link>
      </p>
    </Region>
  );
}

export function SwuQualificationTab({ organization }: { organization: Organization }) {
  const met = organization.swuRequirements;
  return (
    <Region id="tab-heading" title="Sprint With Us qualification">
      {organization.swuQualified ? (
        <p className="op-text">This organization is qualified to propose on Sprint With Us opportunities.</p>
      ) : (
        <NotQualified program="Sprint With Us" />
      )}
      <Requirements
        label="Sprint With Us requirements"
        items={[
          { testId: "organization-swu-requirement-two-members", met: met.twoMembers, text: "At least two active team members" },
          {
            testId: "organization-swu-requirement-all-capabilities",
            met: met.allCapabilities,
            text: "Active team members between them hold every capability",
          },
          {
            testId: "organization-swu-requirement-terms-accepted",
            met: met.termsAccepted,
            text: "Sprint With Us terms and conditions accepted",
          },
        ]}
      />
      {organization.swuQualified ? null : (
        <p className="op-text">Invited people who have not yet accepted do not count towards team size or capabilities.</p>
      )}
      <TermsRegion
        organization={organization}
        program="Sprint With Us"
        slug="sprint-with-us-terms-and-conditions"
        acceptedOn={organization.acceptedSWUTerms}
        testIdPrefix="swu"
      />
    </Region>
  );
}

export function TwuQualificationTab({
  viewer,
  organization,
  onChanged,
}: {
  viewer: Account;
  organization: Organization;
  onChanged: (organization: Organization) => void;
}) {
  const [editing, setEditing] = useState(false);
  // What the last save announced, in the status region the tab keeps in both its states.
  const [saved, setSaved] = useState<string | null>(null);
  const mayEdit = mayQualifyServiceAreas(viewer);

  if (editing && mayEdit) {
    return (
      <Region id="tab-heading" title="Team With Us qualification">
        <ServiceAreasForm
          organization={organization}
          onSaved={(changed) => {
            onChanged(changed);
            setSaved("Service areas saved.");
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </Region>
    );
  }

  return (
    <Region id="tab-heading" title="Team With Us qualification">
      {organization.twuQualified ? (
        <p className="op-text">This organization is qualified to propose on Team With Us opportunities.</p>
      ) : (
        <NotQualified program="Team With Us" />
      )}
      <Requirements
        label="Team With Us requirements"
        items={[
          {
            testId: "organization-twu-requirement-service-area",
            met: organization.serviceAreas.length > 0,
            text: "Approved for at least one service area",
          },
          {
            testId: "organization-twu-requirement-terms-accepted",
            met: Boolean(organization.acceptedTWUTerms),
            text: "Team With Us terms and conditions accepted",
          },
        ]}
      />
      <Region id="areas-heading" title="Approved service areas" level={3}>
        {mayEdit ? null : <p className="op-text">Only an administrator can change which service areas an organization is approved for.</p>}
        {organization.serviceAreas.length > 0 ? (
          <ul className="op-list">
            {organization.serviceAreas.map((area) => (
              <li key={area} data-testid="organization-service-area">
                {areaName(area)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="op-text">This organization is not approved for any service area.</p>
        )}
        {mayEdit ? (
          <Actions>
            <Button
              variant="secondary"
              onPress={() => {
                setSaved(null);
                setEditing(true);
              }}
              data-testid="organization-edit-service-areas-button"
            >
              Edit service areas
            </Button>
          </Actions>
        ) : null}
        {mayEdit ? <SaveStatus>{saved}</SaveStatus> : null}
      </Region>
      <TermsRegion
        organization={organization}
        program="Team With Us"
        slug="team-with-us-terms-and-conditions"
        acceptedOn={organization.acceptedTWUTerms}
        testIdPrefix="twu"
      />
    </Region>
  );
}

/**
 * The administrator's service-area approvals: every recognised area as a checkbox, starting from
 * the current approvals. Saving replaces them with exactly what is ticked (R-3.28). A refusal keeps
 * the form open and says why.
 */
function ServiceAreasForm({
  organization,
  onSaved,
  onCancel,
}: {
  organization: Organization;
  onSaved: (organization: Organization) => void;
  onCancel: () => void;
}) {
  const [ticked, setTicked] = useState<string[]>(organization.serviceAreas.map(areaId));
  const [saving, setSaving] = useState(false);
  const [refused, setRefused] = useState<readonly string[] | null>(null);

  async function save() {
    if (saving) return;
    setSaving(true);
    setRefused(null);
    const answer = await qualifyServiceAreas(organization.id, ticked.map(areaKey));
    setSaving(false);
    if (answer.kind === "saved") onSaved(answer.organization);
    else setRefused(answer.reasons);
  }

  return (
    <Region id="areas-heading" title="Approved service areas" level={3}>
      <p className="op-text">Saving replaces this organization’s approvals with exactly the areas ticked.</p>
      {refused ? (
        <PageAlert variant="danger" role="alert" title="The service areas could not be saved">
          <p className="op-text">{refused.join(" ") || "Try again in a moment."}</p>
        </PageAlert>
      ) : null}
      <CheckboxGroup label="Service areas this organization is approved for" value={ticked} onChange={setTicked}>
        {SERVICE_AREA_CHOICES.map((area) => (
          <Checkbox key={area.id} value={area.id} data-testid="organization-service-area-checkbox">
            {area.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <ButtonGroup ariaLabel="Service area actions">
        <Button variant="primary" onPress={() => void save()} data-testid="organization-save-service-areas-button">
          Save service areas
        </Button>
        <Button variant="secondary" onPress={onCancel} data-testid="organization-cancel-service-areas-button">
          Cancel
        </Button>
      </ButtonGroup>
      <SaveStatus>{saving ? "Saving service areas…" : null}</SaveStatus>
    </Region>
  );
}
