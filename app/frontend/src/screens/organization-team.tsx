import { useCallback, useEffect, useState } from "react";
import {
  AlertDialog,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  Heading,
  Modal,
  Select,
  TextField,
} from "@bcgov/design-system-react-components";
import {
  AFFILIATION_EVENT_LABELS,
  capabilitySummary,
  mayManageTeam,
  offersChangeOwner,
  ownershipTransferRefusal,
  rowControls,
  teamShown,
} from "@rules/organizations";
import type { Account } from "../api/accounts";
import {
  Organization,
  TeamMember,
  acceptMembership,
  endMembership,
  fetchOrganization,
  fetchTeam,
  inviteToTeam,
  setAdministratorRights,
  transferOwnership,
} from "../api/organizations";
import { look } from "../app/marketplace";
import { Actions, Region, Waiting } from "../app/opportunity-kit";
import {
  ChangelogRows,
  Commands,
  DialogBody,
  DialogText,
  MembershipWords,
  PageAlert,
  SaveStatus,
  TeamRows,
} from "../app/organization-kit";
import { readMoment } from "../lib/dates";
import {
  InvitationOutcome,
  addressesToInvite,
  fieldProblem,
  forgetOutcome,
  keepOutcome,
  keptOutcome,
} from "../lib/invitations";

/**
 * The management page's Team members and Changelog tabs (organization-edit · team,
 * team-administrator, invite-*, admin-rights-confirm, remove-member-confirm, change-owner,
 * changelog), drawn with the organization kit (decision record 0080).
 *
 * The team is everyone whose membership stands, the owner first; a pending invitee is marked and
 * counts towards neither the team's size nor its capabilities (R-3.7, R-3.34). Each row offers
 * only what the viewer may do there, by the same rules the service applies (R-3.9–R-3.13).
 */

const MEMBERSHIP_LABELS = { OWNER: "Owner", ADMIN: "Administrator", MEMBER: "Member" } as const;

/** The membership a row's label names: Pending while the invitation waits, otherwise its kind. */
export function membershipWords(member: Pick<TeamMember, "membershipType" | "membershipStatus">): MembershipWords {
  return member.membershipStatus === "PENDING" ? "Pending" : MEMBERSHIP_LABELS[member.membershipType];
}

/** The statement a person giving administrator rights confirms first (R-3.12; design gap 8). */
export const ADMIN_RIGHTS_STATEMENT =
  "An organization administrator can invite people to the team, remove members, give and withdraw other members’ administrator rights, and put the organization forward on proposals. They cannot change the organization’s profile or archive it.";

const lowerFirst = (text: string) => (text ? text[0]?.toLowerCase() + text.slice(1) : text);

type Change = () => Promise<{ kind: "saved" } | { kind: "refused"; reasons: readonly string[] }>;

export function TeamTab({
  viewer,
  organization,
  onChanged,
}: {
  viewer: Account;
  organization: Organization;
  onChanged: (organization: Organization) => void;
}) {
  const [team, setTeam] = useState<readonly TeamMember[] | "loading" | "failed">("loading");
  // The outcome outlives a reload of the tab, until the next action (R-3.30).
  const [outcome, setOutcome] = useState<InvitationOutcome | null>(() => keptOutcome(organization.id));
  const [failure, setFailure] = useState<readonly string[] | null>(null);
  const [saved, setSaved] = useState("");
  const [inviting, setInviting] = useState(false);
  const [givingRightsTo, setGivingRightsTo] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const [changingOwner, setChangingOwner] = useState(false);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    const found = await fetchTeam(organization.id);
    setTeam(found.kind === "listed" ? found.members : "failed");
  }, [organization.id]);

  useEffect(() => {
    let current = true;
    void fetchTeam(organization.id).then((found) => {
      if (current) setTeam(found.kind === "listed" ? found.members : "failed");
    });
    return () => {
      current = false;
    };
  }, [organization.id]);

  /** After a change: the team again, and the organization, whose size, owner and changelog follow it. */
  async function refresh() {
    await load();
    const read = await fetchOrganization(organization.id);
    if (read.kind === "found") onChanged(read.organization);
  }

  /** Makes a change; `done` is what the status region says once it is made, for a change made at once. */
  async function act(change: Change, done = "") {
    if (working) return false;
    setWorking(true);
    setFailure(null);
    setSaved("");
    clearOutcome();
    const answer = await change();
    setWorking(false);
    if (answer.kind === "refused") {
      setFailure(answer.reasons.length > 0 ? answer.reasons : ["Try again in a moment."]);
      return false;
    }
    await refresh();
    setSaved(done);
    return true;
  }

  function clearOutcome() {
    setOutcome(null);
    forgetOutcome(organization.id);
  }

  async function invite(emails: readonly string[]) {
    setWorking(true);
    setFailure(null);
    setSaved("");
    // Every invitation is sent at once, so none waits on another's answer to leave the browser.
    const answers = await Promise.all(emails.map((email) => inviteToTeam(organization.id, email)));
    const refused: { email: string; reason: string }[] = [];
    const unregistered: string[] = [];
    let invalidType = false;
    answers.forEach((answer, index) => {
      const email = emails[index] ?? "";
      if (answer.kind === "not-registered") unregistered.push(email);
      else if (answer.kind === "invalid-type") invalidType = true;
      else if (answer.kind === "refused") refused.push({ email, reason: answer.reasons.join(" ") || "the invitation could not be sent." });
    });
    const answered = { refused, unregistered, invalidType };
    keepOutcome(organization.id, answered);
    setOutcome(answered);
    setWorking(false);
    setInviting(false);
    await refresh();
  }

  const members = team === "loading" || team === "failed" ? [] : teamShown(team);
  const activeCount = members.filter((member) => member.membershipStatus === "ACTIVE").length;
  const manages = mayManageTeam(viewer, organization.viewerMembership);
  const changeOwnerOffered = offersChangeOwner(viewer, members);
  const owner = members.find((member) => member.membershipType === "OWNER" && member.membershipStatus === "ACTIVE");
  const summary = capabilitySummary(members);

  const addTeamMembers = (
    <Button
      variant="primary"
      onPress={() => {
        clearOutcome();
        setFailure(null);
        setSaved("");
        setInviting(true);
      }}
      data-testid="organization-add-team-members-button"
    >
      Add team members
    </Button>
  );

  const rows = members.map((member) => {
    const shownName = member.name || "Name not given";
    return {
      key: member.affiliationId,
      name: member.userId === viewer.id ? `${shownName} (you)` : shownName,
      membership: membershipWords(member),
      capabilities: member.capabilities.length,
      commands: (
        <MemberCommands
          viewer={viewer}
          organization={organization}
          member={member}
          working={working}
          onGiveRights={() => setGivingRightsTo(member)}
          onRemoveRights={() =>
            void act(() => setAdministratorRights(member.affiliationId, false), `Administrator rights removed from ${shownName}.`)
          }
          onRemove={() => setRemoving(member)}
          onApprove={() => void act(() => acceptMembership(member.affiliationId), `${shownName} has joined the team.`)}
        />
      ),
    };
  });

  return (
    <>
      <Region id="tab-heading" title="Team members">
        {outcome?.invalidType ? (
          <PageAlert testId="organization-invalid-membership-type-error" variant="danger" role="alert" title="The invitation was not sent: invalid membership type">
            <p className="op-text">
              An invitation can only be for a member or an owner. Administrator rights are given after the person has joined.
            </p>
          </PageAlert>
        ) : null}
        {outcome && (outcome.refused.length > 0 || outcome.unregistered.length > 0) ? (
          // What the invitations came back with is the tab's one field-error message (R-3.8, R-3.30).
          <div className="og-body" data-testid="field-error">
            {outcome.refused.length > 0 ? (
              <PageAlert
                testId="organization-invite-refused"
                variant="danger"
                role="alert"
                title={outcome.refused.length === 1 ? "1 invitation was not sent" : `${outcome.refused.length} invitations were not sent`}
              >
                <ul className="og-errors">
                  {outcome.refused.map((entry) => (
                    <li key={entry.email}>
                      {entry.email}: {lowerFirst(entry.reason)}
                    </li>
                  ))}
                </ul>
              </PageAlert>
            ) : null}
            {outcome.unregistered.map((email) => (
              <PageAlert
                key={email}
                testId="organization-invite-unregistered"
                variant="warning"
                role="alert"
                title={`${email} is not registered with the Digital Marketplace`}
              >
                <p className="op-text">They have been emailed an invitation to sign up. They are not on your team.</p>
              </PageAlert>
            ))}
          </div>
        ) : null}
        {failure ? (
          <PageAlert testId="field-error" variant="danger" role="alert" title="That change could not be made">
            <p className="op-text">{failure.join(" ")}</p>
          </PageAlert>
        ) : null}
        {team === "loading" ? (
          <Waiting label="Loading the team" />
        ) : team === "failed" ? (
          <PageAlert variant="danger" role="alert" title="The team could not be loaded">
            <p className="op-text">Try again in a moment.</p>
          </PageAlert>
        ) : (
          <>
            <p className="op-text">
              Team size: {activeCount} active {activeCount === 1 ? "member" : "members"}. An invited person joins the team, and counts
              towards its size and capabilities, once they accept.
            </p>
            {manages && changeOwnerOffered ? (
              <ButtonGroup ariaLabel="Team actions">
                {addTeamMembers}
                <Button variant="secondary" onPress={() => setChangingOwner(true)} data-testid="organization-change-owner-button">
                  Change owner
                </Button>
              </ButtonGroup>
            ) : manages ? (
              <Actions>{addTeamMembers}</Actions>
            ) : null}
            <TeamRows rows={rows} />
            <Region id="capabilities-heading" title="Team capabilities" level={3} testId="organization-team-capabilities">
              <p className="op-text">Only active members count. An invited person’s capabilities count once they accept.</p>
              {summary.held.length === 0 ? (
                <p className="op-text">No active member holds a capability yet.</p>
              ) : (
                <ul className="op-list">
                  {summary.held.map((name) => (
                    <li key={name} data-testid="organization-team-capability">
                      {name}: held
                    </li>
                  ))}
                </ul>
              )}
            </Region>
            {/* Kept apart from the summary, so a capability only a pending invitee holds is never named in it (decision record 0052). */}
            {summary.missing.length > 0 ? (
              <Region id="missing-capabilities-heading" title="Capabilities the team does not have" level={3}>
                <ul className="op-list">
                  {summary.missing.map((name) => (
                    <li key={name}>{name}: not held</li>
                  ))}
                </ul>
              </Region>
            ) : null}
          </>
        )}
      </Region>
      <SaveStatus>{saved}</SaveStatus>
      <InviteDialog open={inviting} working={working} onCancel={() => setInviting(false)} onSend={(emails) => void invite(emails)} />
      <AdminRightsDialog
        member={givingRightsTo}
        working={working}
        onCancel={() => setGivingRightsTo(null)}
        onConfirm={(member) => {
          // A confirmed dialog closes at once; what the service answers is shown on the tab.
          setGivingRightsTo(null);
          void act(() => setAdministratorRights(member.affiliationId, true));
        }}
      />
      <RemoveDialog
        organization={organization}
        member={removing}
        working={working}
        onCancel={() => setRemoving(null)}
        onConfirm={(member) => {
          setRemoving(null);
          void act(() => endMembership(member.affiliationId));
        }}
      />
      <ChangeOwnerDialog
        open={changingOwner}
        viewer={viewer}
        organization={organization}
        owner={owner ?? null}
        members={members}
        working={working}
        onCancel={() => setChangingOwner(false)}
        onConfirm={(affiliationId) => {
          setChangingOwner(false);
          void act(() => transferOwnership(affiliationId));
        }}
      />
    </>
  );
}

/** The commands a row offers, tertiary and in a row that wraps; nothing where the viewer may do nothing. */
function MemberCommands({
  viewer,
  organization,
  member,
  working,
  onGiveRights,
  onRemoveRights,
  onRemove,
  onApprove,
}: {
  viewer: Account;
  organization: Organization;
  member: TeamMember;
  working: boolean;
  onGiveRights: () => void;
  onRemoveRights: () => void;
  onRemove: () => void;
  onApprove: () => void;
}) {
  const controls = rowControls(viewer, organization.viewerMembership, member);
  const shownName = member.name || "Name not given";
  if (!controls.approve && !controls.giveAdminRights && !controls.removeAdminRights && !controls.remove) return null;
  return (
    <Commands>
      {controls.approve ? (
        <Button
          variant="tertiary"
          size="small"
          isDisabled={working}
          aria-label={`Approve ${shownName}`}
          onPress={onApprove}
          data-testid="organization-member-approve-button"
        >
          Approve
        </Button>
      ) : null}
      {controls.giveAdminRights ? (
        <Button
          variant="tertiary"
          size="small"
          isDisabled={working}
          aria-label={`Give administrator rights to ${shownName}`}
          onPress={onGiveRights}
          data-testid="organization-member-admin-toggle"
        >
          Give administrator rights
        </Button>
      ) : null}
      {controls.removeAdminRights ? (
        <Button
          variant="tertiary"
          size="small"
          isDisabled={working}
          aria-label={`Remove administrator rights from ${shownName}`}
          onPress={onRemoveRights}
          data-testid="organization-member-admin-toggle"
        >
          Remove administrator rights
        </Button>
      ) : null}
      {controls.remove ? (
        <Button
          variant="tertiary"
          size="small"
          danger
          isDisabled={working}
          aria-label={`Remove ${shownName}`}
          onPress={onRemove}
          data-testid="organization-member-remove-button"
        >
          Remove
        </Button>
      ) : null}
    </Commands>
  );
}

/**
 * Inviting people by email address, several at once. Each is sent as an ordinary member's
 * invitation (R-3.7, R-3.17); a field may hold several addresses pasted in together. An address
 * that is not a valid one is reported against its field and nothing is sent until each is.
 */
function InviteDialog({
  open,
  working,
  onCancel,
  onSend,
}: {
  open: boolean;
  working: boolean;
  onCancel: () => void;
  onSend: (emails: readonly string[]) => void;
}) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open) {
      setEmails([""]);
      setChecked(false);
    }
  }, [open]);

  const allEmpty = addressesToInvite(emails).length === 0;
  const problemAt = (index: number): string => fieldProblem(emails[index] ?? "", index === 0 && allEmpty);

  function send() {
    setChecked(true);
    if (emails.some((_, index) => problemAt(index) !== "")) return;
    onSend(addressesToInvite(emails));
  }

  return (
    <Modal isOpen={open} isDismissable onOpenChange={(isOpen) => (!isOpen && !working ? onCancel() : undefined)}>
      <Dialog isCloseable data-testid="organization-invite-dialog">
        <DialogBody>
          <Heading level={2} slot="title" style={look.section}>
            Add team members
          </Heading>
          <p className="op-text">
            Each person is emailed an invitation and joins the team as a member once they accept. Only people with a vendor account can be
            invited. Anyone not yet registered is emailed an invitation to sign up instead.
          </p>
          {emails.map((email, index) => (
            <TextField
              key={index}
              label={`Email address ${index + 1}`}
              type="email"
              isRequired={index === 0}
              value={email}
              onChange={(value) => setEmails((current) => current.map((entry, at) => (at === index ? value : entry)))}
              isInvalid={checked && problemAt(index) !== ""}
              errorMessage={problemAt(index)}
              data-testid="organization-invite-email-field"
            />
          ))}
          <Actions>
            <Button variant="tertiary" onPress={() => setEmails((current) => [...current, ""])} data-testid="organization-invite-add-email">
              Add another email address
            </Button>
          </Actions>
          <ButtonGroup alignment="end" ariaLabel="Invitation actions">
            <Button variant="secondary" isDisabled={working} onPress={onCancel} data-testid="organization-dialog-cancel">
              Cancel
            </Button>
            <Button variant="primary" isDisabled={working} onPress={send} data-testid="organization-invite-submit">
              Send invitations
            </Button>
          </ButtonGroup>
        </DialogBody>
      </Dialog>
    </Modal>
  );
}

/** Giving administrator rights asks the giver to confirm what they allow first (R-3.12). */
function AdminRightsDialog({
  member,
  working,
  onCancel,
  onConfirm,
}: {
  member: TeamMember | null;
  working: boolean;
  onCancel: () => void;
  onConfirm: (member: TeamMember) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => setConfirmed(false), [member]);
  const name = member?.name || "this member";
  return (
    <Modal isOpen={member !== null} isDismissable onOpenChange={(open) => (!open && !working ? onCancel() : undefined)}>
      <AlertDialog
        variant="confirmation"
        title={`Give ${name} administrator rights?`}
        data-testid="organization-admin-rights-dialog"
        buttons={
          <>
            <Button variant="secondary" isDisabled={working} onPress={onCancel} data-testid="organization-dialog-cancel">
              Cancel
            </Button>
            <Button
              variant="primary"
              isDisabled={!confirmed}
              aria-describedby="admin-rights-hint"
              onPress={() => (member && !working ? onConfirm(member) : undefined)}
              data-testid="organization-admin-rights-confirm"
            >
              Give administrator rights
            </Button>
          </>
        }
      >
        <DialogText>
          <p className="op-text">{ADMIN_RIGHTS_STATEMENT}</p>
          <Checkbox isSelected={confirmed} onChange={setConfirmed} data-testid="organization-admin-terms-checkbox">
            I have read this statement and confirm it
          </Checkbox>
          <p id="admin-rights-hint" className="op-note">
            Confirm the statement to give administrator rights.
          </p>
        </DialogText>
      </AlertDialog>
    </Modal>
  );
}

/** Removing somebody from the team, or withdrawing an invitation, asks first (R-3.10). */
function RemoveDialog({
  organization,
  member,
  working,
  onCancel,
  onConfirm,
}: {
  organization: Organization;
  member: TeamMember | null;
  working: boolean;
  onCancel: () => void;
  onConfirm: (member: TeamMember) => void;
}) {
  const name = member?.name || "This person";
  return (
    <Modal isOpen={member !== null} isDismissable onOpenChange={(open) => (!open && !working ? onCancel() : undefined)}>
      <AlertDialog
        variant="destructive"
        title={`Remove ${name} from the team?`}
        data-testid="organization-member-remove-dialog"
        buttons={
          <>
            <Button variant="secondary" isDisabled={working} onPress={onCancel} data-testid="organization-dialog-cancel">
              Cancel
            </Button>
            <Button
              variant="primary"
              danger
              onPress={() => (member && !working ? onConfirm(member) : undefined)}
              data-testid="organization-member-remove-confirm"
            >
              Remove from team
            </Button>
          </>
        }
      >
        <p className="op-text">
          {member?.membershipStatus === "PENDING"
            ? `${name}’s invitation to ${organization.legalName}’s team will be withdrawn. They can be invited again later.`
            : `${name} will no longer be on ${organization.legalName}’s team, and will stop counting towards its size and capabilities. They can be invited again later.`}
        </p>
      </AlertDialog>
    </Modal>
  );
}

/**
 * Transferring ownership, by a service administrator, to a member who has joined (R-3.13). The
 * new owner is chosen first, then the transfer is confirmed in the same dialog, which closes as
 * soon as it is (decision record 0052). Its buttons are never shown disabled.
 */
function ChangeOwnerDialog({
  open,
  viewer,
  organization,
  owner,
  members,
  working,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  viewer: Account;
  organization: Organization;
  owner: TeamMember | null;
  members: readonly TeamMember[];
  working: boolean;
  onCancel: () => void;
  onConfirm: (affiliationId: string) => void;
}) {
  const [chosen, setChosen] = useState<string>("");
  const [checked, setChecked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (open) {
      setChosen("");
      setChecked(false);
      setConfirming(false);
    }
  }, [open]);
  const candidates = members.filter((member) => ownershipTransferRefusal(viewer, member) === null);
  const items = candidates.map((member) => ({ id: member.affiliationId, label: member.name || "Name not given" }));
  const newOwner = candidates.find((member) => member.affiliationId === chosen) ?? null;
  const ownerWords = owner ? `${owner.name}, the current owner,` : "The current owner";
  return (
    <Modal isOpen={open} isDismissable onOpenChange={(isOpen) => (!isOpen ? onCancel() : undefined)}>
      <Dialog isCloseable data-testid="organization-change-owner-dialog">
        {confirming && newOwner ? (
          <DialogBody>
            <Heading level={2} slot="title" style={look.section}>
              Make {newOwner.name || "this member"} the owner?
            </Heading>
            <p className="op-text">
              {newOwner.name || "This member"} will own {organization.legalName}. {ownerWords} will become an ordinary member.
            </p>
            <ButtonGroup alignment="end" ariaLabel="Change owner actions">
              <Button variant="secondary" onPress={() => setConfirming(false)} data-testid="organization-dialog-cancel">
                Back
              </Button>
              <Button
                variant="primary"
                onPress={() => (working ? undefined : onConfirm(newOwner.affiliationId))}
                data-testid="organization-change-owner-confirm"
              >
                Yes, change owner
              </Button>
            </ButtonGroup>
          </DialogBody>
        ) : (
          <DialogBody>
            <Heading level={2} slot="title" style={look.section}>
              Change owner
            </Heading>
            <p className="op-text">
              {ownerWords} will become an ordinary member. Only members who have accepted their invitation can be chosen.
            </p>
            <Select
              label="New owner"
              isRequired
              items={items}
              value={chosen === "" ? null : chosen}
              onChange={(key) => setChosen(key === null ? "" : String(key))}
              isInvalid={checked && newOwner === null}
              errorMessage="Choose the new owner"
              data-testid="organization-new-owner-field"
            />
            <ButtonGroup alignment="end" ariaLabel="Change owner actions">
              <Button variant="secondary" onPress={onCancel} data-testid="organization-dialog-cancel">
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  setChecked(true);
                  if (newOwner) setConfirming(true);
                }}
                data-testid="organization-change-owner-confirm"
              >
                Change owner
              </Button>
            </ButtonGroup>
          </DialogBody>
        )}
      </Dialog>
    </Modal>
  );
}

/**
 * Every grant and withdrawal of administrator rights and every transfer of ownership, newest
 * first, with whom it concerned, when, and who made it (R-3.33).
 */
export function ChangelogTab({ organization }: { organization: Organization }) {
  const entries = organization.changelog.map((entry) => {
    const when = readMoment(entry.createdAt);
    return {
      key: entry.id,
      when: when ? <time dateTime={when.dateTime}>{when.label}</time> : entry.createdAt,
      event: AFFILIATION_EVENT_LABELS[entry.event],
      member: entry.memberName,
      by: entry.createdByName,
    };
  });
  return (
    <Region id="tab-heading" title="Changelog">
      {entries.length === 0 ? (
        <p className="op-text" data-testid="organization-changelog-empty">
          No administrator rights have been given or withdrawn, and ownership has not been transferred.
        </p>
      ) : (
        <ChangelogRows entries={entries} />
      )}
    </Region>
  );
}
