import { useEffect, useState } from "react";
import { AlertDialog, Button, Link, Modal, Text } from "@bcgov/design-system-react-components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { fileContentAddress } from "@rules/files";
import { SWU_PHASES, SWU_PHASE_NAMES } from "@rules/other-program-drafts";
import { isAcceptingProposals, proposalStatusLabel } from "@rules/proposals";
import { Scoresheet, rankLabel } from "@rules/proposal-evaluation";
import { TEAM_PROGRAM_NAMES, TeamProgram, offeredTeamProposalActions, organizationIsLocked } from "@rules/team-proposals";
import { Account, changeOwnAccount } from "../api/accounts";
import { downloadFile } from "../api/files";
import { TeamMember, fetchTeam } from "../api/organizations";
import { OtherProgramOpportunity, fetchOtherProgramOpportunity } from "../api/other-programs";
import { ActingFor, fetchOrganizationsActingFor } from "../api/proposals";
import { TeamProposal, TeamProposalSaveAnswer, changeTeamProposal, deleteTeamProposal, fetchTeamProposal } from "../api/team-proposals";
import { NotFound } from "../app/not-found";
import { Actions, DataTable, Details, PageTitle, Region, SectionTitle, Waiting, type Detail } from "../app/opportunity-kit";
import { Focused, ProposalActions, ProposalHead, ProposalPage, ProposalStatus, ProposalTabs } from "../app/proposal-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { deadlineLabel, momentLabel } from "./opportunity-parts";
import { ProposalHistory } from "./proposal-cwu-edit";
import { TermsDialog } from "./proposal-cwu-form";
import { TeamProposalForm, areaName, teamSummary, teamValuesFrom } from "./proposal-team-form";

/**
 * Manage a Sprint With Us or Team With Us proposal, at
 * `/opportunities/<program>/:opportunityId/proposals/:proposalId/edit` (proposal-swu-edit,
 * proposal-twu-edit; decision records 0058 and 0078), drawn as its stories draw it: the head with
 * the status label, the details, the links, the action bar, the tabs, then the tab's region. Edit
 * turns the Proposal tab into the create page's long form, filled in, with the head, details and
 * tabs above it.
 *
 * It is the vendor's page: the vendor who wrote it, or who owns or administers its organization.
 * Anybody else is shown the missing page (R-2.24). A draft may be edited, submitted or deleted; a
 * submitted one edited or withdrawn, its organization staying until it is withdrawn (R-2.22); a
 * withdrawn one edited or put back in (R-2.4, R-2.23). Every submission passes through the terms
 * dialog (R-2.3), and a refusal — the organization no longer qualified, the deadline passed — is said
 * under the action bar in the service's words (R-2.16). The History tab lists every change of state
 * to everyone who may read the proposal (R-2.9).
 */

type Tab = "proposal" | "scoresheet" | "history";
const TAB_NAMES: Readonly<Record<Tab, string>> = { proposal: "Proposal", scoresheet: "Scoresheet", history: "History" };

/** The Scoresheet tab appears once a decision has been made and the service gives the result (R-2.32). */
function tabsFor(proposal: TeamProposal): readonly Tab[] {
  const decided = (proposal.status === "AWARDED" || proposal.status === "NOT_AWARDED") && proposal.scoresheet !== undefined;
  return decided ? ["proposal", "scoresheet", "history"] : ["proposal", "history"];
}

const TITLES: Readonly<Record<TeamProgram, string>> = {
  "sprint-with-us": "Manage a Sprint With Us proposal",
  "team-with-us": "Manage a Team With Us proposal",
};

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | {
      readonly kind: "found";
      readonly proposal: TeamProposal;
      readonly opportunity: OtherProgramOpportunity;
      readonly organizations: readonly ActingFor[];
    };

export function ProposalTeamEditScreen({ program, opportunityId, proposalId }: { program: TeamProgram; opportunityId: string; proposalId: string }) {
  useScreenTitle(TITLES[program]);
  return (
    <RequireSignIn title={TITLES[program]} loadingLabel="Loading proposal…">
      {(account) => <ManageLoader program={program} account={account} opportunityId={opportunityId} proposalId={proposalId} />}
    </RequireSignIn>
  );
}

function ManageLoader({ program, account, opportunityId, proposalId }: { program: TeamProgram; account: Account; opportunityId: string; proposalId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const vendor = account.type === "VENDOR";
  useEffect(() => {
    if (!vendor) return;
    let current = true;
    void Promise.all([fetchTeamProposal(program, proposalId), fetchOtherProgramOpportunity(program, opportunityId), fetchOrganizationsActingFor()]).then(
      ([answer, opportunity, organizations]) => {
        if (!current) return;
        setLoaded(
          answer.kind === "found" && opportunity.kind === "found"
            ? { kind: "found", proposal: answer.proposal, opportunity: opportunity.opportunity, organizations }
            : { kind: "missing" },
        );
      },
    );
    return () => {
      current = false;
    };
  }, [program, proposalId, opportunityId, vendor]);

  if (!vendor || loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <ProposalPage>
        <PageTitle>{TITLES[program]}</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    );
  }
  if (loaded.proposal.opportunity.id !== opportunityId.toLowerCase()) return <NotFound />;
  return <Manage program={program} account={account} initial={loaded.proposal} opportunity={loaded.opportunity} organizations={loaded.organizations} />;
}

type Notice =
  | { readonly kind: "done"; readonly text: string }
  | { readonly kind: "not-submitted"; readonly reasons: readonly string[] }
  | { readonly kind: "refused"; readonly title: string; readonly reasons: readonly string[] };

/**
 * The people of the proposal's organization, for the membership and capabilities its team table
 * shows; nothing when the organization's team cannot be read.
 */
function useOrganizationTeam(organizationId: string | undefined): ReadonlyMap<string, TeamMember> | null {
  const [team, setTeam] = useState<ReadonlyMap<string, TeamMember> | null>(null);
  useEffect(() => {
    setTeam(null);
    if (!organizationId) return;
    let current = true;
    void fetchTeam(organizationId).then((answer) => {
      if (current && answer.kind === "listed") setTeam(new Map(answer.members.map((member) => [member.userId, member])));
    });
    return () => {
      current = false;
    };
  }, [organizationId]);
  return team;
}

function Manage({
  program,
  account,
  initial,
  opportunity,
  organizations,
}: {
  program: TeamProgram;
  account: Account;
  initial: TeamProposal;
  opportunity: OtherProgramOpportunity;
  organizations: readonly ActingFor[];
}) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const [proposal, setProposal] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [notice, setNoticeState] = useState<Notice | null>(null);
  // Each notice is a new message, focused as it appears.
  const [noticeVersion, setNoticeVersion] = useState(0);
  const [dialog, setDialog] = useState<"terms" | "withdraw" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);
  const people = useOrganizationTeam(proposal.organization?.id);

  function setNotice(next: Notice | null) {
    setNoticeState(next);
    setNoticeVersion((version) => version + 1);
  }

  const tabs = tabsFor(proposal);
  const tab: Tab = tabs.includes(search.tab as Tab) ? (search.tab as Tab) : "proposal";
  const base = `/opportunities/${program}/${opportunity.id}/proposals/${proposal.id}`;
  const offers = offeredTeamProposalActions(proposal.status);
  const status = proposalStatusLabel(proposal.status);
  const title = proposal.opportunity.title || "Untitled opportunity";
  // The organization already named stays a choice even when the vendor no longer administers it.
  const named = proposal.organization;
  const choices = named && !organizations.some((organization) => organization.id === named.id) ? [...organizations, named] : organizations;
  const names: Record<string, string> = {};
  for (const phase of SWU_PHASES) for (const member of proposal.phases[phase]?.members ?? []) names[member.member.id] = member.member.name;
  for (const member of proposal.team) names[member.member.id] = member.member.name;

  const head = <ProposalHead eyebrow={TITLES[program]} program={program} status={status} title={title} />;
  const identifiers: Detail[] = [
    { term: "Proposal ID", value: proposal.id, testId: "proposal-identifier" },
    { term: "Opportunity ID", value: opportunity.id, testId: "opportunity-identifier" },
  ];
  const tabLinks = <ProposalTabs base={`${base}/edit`} current={tab} tabs={tabs.map((key) => ({ key, label: TAB_NAMES[key] }))} />;

  function goToTab(next: Tab) {
    const params = { opportunityId: opportunity.id, proposalId: proposal.id };
    const to = program === "sprint-with-us" ? "/opportunities/sprint-with-us/$opportunityId/proposals/$proposalId/edit" : "/opportunities/team-with-us/$opportunityId/proposals/$proposalId/edit";
    void navigate({ to, params, search: { tab: next } as never });
  }

  function settle(answer: TeamProposalSaveAnswer, done: string, refusedTitle: string) {
    if (answer.kind === "saved") {
      setProposal(answer.proposal);
      setNotice({ kind: "done", text: done });
      return;
    }
    const reasons = answer.kind === "refused" ? answer.reasons : ["The service could not do that. Try again."];
    if (refusedTitle === "Your proposal was not submitted") setNotice({ kind: "not-submitted", reasons });
    else setNotice({ kind: "refused", title: refusedTitle, reasons });
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    const accepted = await changeOwnAccount(account.id, "acceptTerms");
    const answer: TeamProposalSaveAnswer = accepted.kind === "saved" ? await changeTeamProposal(program, proposal.id, "submit") : { kind: "failed" };
    setBusy(false);
    setDialog(null);
    settle(answer, "Your proposal has been submitted.", "Your proposal was not submitted");
  }

  async function withdraw() {
    if (busy) return;
    setBusy(true);
    const answer = await changeTeamProposal(program, proposal.id, "withdraw");
    setBusy(false);
    setDialog(null);
    settle(answer, "Your proposal has been withdrawn.", "Your proposal was not withdrawn");
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    const answer = await deleteTeamProposal(program, proposal.id);
    setBusy(false);
    setDialog(null);
    if (answer.kind === "saved") {
      void navigate({ to: "/dashboard" });
      return;
    }
    settle(answer, "", "Your proposal was not deleted");
  }

  if (tab === "proposal" && editing) {
    return (
      <TeamProposalForm
        key={formVersion}
        program={program}
        purpose="edit"
        opportunity={opportunity}
        organizations={choices}
        initial={teamValuesFrom(proposal, opportunity)}
        initialAttachments={proposal.attachments}
        initialNames={names}
        organizationLocked={organizationIsLocked(proposal.status)}
        // A submitted proposal is saved as it stands; there is nothing more to submit.
        offerSubmit={proposal.status !== "SUBMITTED"}
        head={
          <>
            {head}
            <Details items={identifiers} />
            {tabLinks}
            <SectionTitle id="tab-heading">Proposal</SectionTitle>
          </>
        }
        intro={<p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>}
        summary={teamSummary(program, opportunity, status)}
        refusalTitle="Your changes were not saved"
        onSend={async (action, content) => {
          if (action === "save") return changeTeamProposal(program, proposal.id, "edit", content);
          const accepted = await changeOwnAccount(account.id, "acceptTerms");
          if (accepted.kind !== "saved") return { kind: "failed" };
          const saved = await changeTeamProposal(program, proposal.id, "edit", content);
          if (saved.kind !== "saved" || saved.proposal.status === "SUBMITTED") return saved;
          return changeTeamProposal(program, proposal.id, "submit");
        }}
        onSaved={(saved, action) => {
          setProposal(saved);
          setEditing(false);
          setFormVersion((version) => version + 1);
          setNotice({
            kind: "done",
            text: action === "submit" ? "Your changes have been saved and your proposal submitted." : "Your changes have been saved.",
          });
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <ProposalPage>
      {head}
      <Details
        items={[
          ...(proposal.submittedAt && proposal.status !== "DRAFT"
            ? [{ term: "Submitted", value: momentLabel(proposal.submittedAt), testId: "proposal-submitted-at" }]
            : []),
          ...identifiers,
          { term: "Proposal deadline", value: deadlineLabel(proposal.opportunity.proposalDeadline) },
        ]}
      />
      <Actions>
        <Link href={`/opportunities/${program}/${opportunity.id}`}>View the opportunity</Link>
        <Link href={`${base}/export`} data-testid="proposal-export-link">
          Printable copy
        </Link>
      </Actions>
      <ProposalActions>
        {offers.edit || offers.submit || offers.withdraw || offers.delete ? (
          <>
            {offers.edit ? (
              <Button
                variant="secondary"
                onPress={() => {
                  setNotice(null);
                  setEditing(true);
                  if (tab !== "proposal") goToTab("proposal");
                }}
                data-testid="proposal-edit-button"
              >
                Edit
              </Button>
            ) : null}
            {offers.submit ? (
              <Button
                variant="primary"
                isDisabled={busy}
                onPress={() => {
                  setNotice(null);
                  setDialog("terms");
                }}
                data-testid="proposal-submit"
              >
                Submit proposal
              </Button>
            ) : null}
            {offers.withdraw ? (
              <Button variant="secondary" danger isDisabled={busy} onPress={() => setDialog("withdraw")} data-testid="proposal-withdraw-button">
                Withdraw
              </Button>
            ) : null}
            {offers.delete ? (
              <Button variant="secondary" danger isDisabled={busy} onPress={() => setDialog("delete")} data-testid="proposal-delete-button">
                Delete
              </Button>
            ) : null}
          </>
        ) : null}
      </ProposalActions>
      <NoticeArea key={noticeVersion} notice={notice} />
      {tabLinks}
      <Region id="tab-heading" title={TAB_NAMES[tab]}>
        {tab === "proposal" ? <TeamProposalDetails program={program} proposal={proposal} opportunity={opportunity} people={people} /> : null}
        {tab === "scoresheet" && proposal.scoresheet ? <ScoresheetDetails program={program} proposal={proposal} scoresheet={proposal.scoresheet} /> : null}
        {tab === "history" ? <ProposalHistory proposal={proposal} /> : null}
      </Region>
      <TermsDialog
        isOpen={dialog === "terms"}
        isSending={busy}
        onCancel={() => setDialog(null)}
        onConfirm={() => void submit()}
        programName={TEAM_PROGRAM_NAMES[program]}
        programTerms={`/content/${program}-terms-and-conditions`}
      />
      <Modal isOpen={dialog === "withdraw"} isDismissable onOpenChange={(open) => (!open && !busy ? setDialog(null) : undefined)}>
        <AlertDialog
          variant="warning"
          title="Withdraw this proposal?"
          data-testid="proposal-withdraw-dialog"
          buttons={
            <>
              <Button variant="secondary" isDisabled={busy} onPress={() => setDialog(null)} data-testid="proposal-dialog-cancel">
                Keep proposal
              </Button>
              <Button variant="primary" isDisabled={busy} onPress={() => void withdraw()} data-testid="proposal-withdraw-confirm">
                Withdraw proposal
              </Button>
            </>
          }
        >
          <p className="op-text">
            {isAcceptingProposals({ status: opportunity.status, proposalDeadline: opportunity.proposalDeadline }, new Date())
              ? `It will no longer be considered. You can submit it again only while the opportunity is accepting proposals, until ${deadlineLabel(proposal.opportunity.proposalDeadline)}. You and the administrators will be sent a withdrawal notice.`
              : "It will no longer be considered, and the opportunity is no longer accepting proposals, so it cannot be submitted again. You and the administrators will be sent a withdrawal notice."}
          </p>
        </AlertDialog>
      </Modal>
      <Modal isOpen={dialog === "delete"} isDismissable onOpenChange={(open) => (!open && !busy ? setDialog(null) : undefined)}>
        <AlertDialog
          variant="destructive"
          title="Delete this proposal?"
          data-testid="proposal-delete-dialog"
          buttons={
            <>
              <Button variant="secondary" isDisabled={busy} onPress={() => setDialog(null)} data-testid="proposal-dialog-cancel">
                Cancel
              </Button>
              <Button variant="primary" danger isDisabled={busy} onPress={() => void remove()} data-testid="proposal-delete-confirm">
                Delete proposal
              </Button>
            </>
          }
        >
          <p className="op-text">The draft and everything in it will be removed, and it can no longer be opened. This cannot be undone.</p>
        </AlertDialog>
      </Modal>
    </ProposalPage>
  );
}

function NoticeArea({ notice }: { notice: Notice | null }) {
  if (notice?.kind === "not-submitted" || notice?.kind === "refused") {
    return (
      <Focused testId={notice.kind === "not-submitted" ? "proposal-submit-refused-message" : "proposal-refused-message"}>
        <TitledAlert variant="danger" role="alert" title={notice.kind === "not-submitted" ? "Your proposal was not submitted" : notice.title}>
          {notice.reasons.map((reason) => (
            <Text elementType="p" key={reason}>
              {reason}
            </Text>
          ))}
        </TitledAlert>
      </Focused>
    );
  }
  return <div role="status">{notice?.kind === "done" ? <p className="op-text">{notice.text}</p> : null}</div>;
}

const dollars = (amount: number) => `$${Math.round(amount).toLocaleString("en-CA")}`;
const rate = (amount: number) => `$${amount.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const notEntered = (value: string) => (value.trim() === "" ? "Not entered yet" : value);

/**
 * What a Team With Us team bids by the hour: each rate weighted by its resource's target allocation,
 * added up (proposal-twu-edit, default: "Bid: $220.00 an hour").
 */
export function hourlyBid(team: readonly { readonly hourlyRate: number; readonly resource: { readonly targetAllocation: number | null } }[]): number {
  return team.reduce((sum, member) => sum + member.hourlyRate * ((member.resource.targetAllocation ?? 100) / 100), 0);
}

/**
 * The proposal as it stands, read-only, each part a region of the tab (proposal-swu-edit and
 * proposal-twu-edit, default). Given the organization's people, a Sprint With Us team also shows
 * each member's membership and capabilities.
 */
export function TeamProposalDetails({
  program,
  proposal,
  opportunity,
  people = null,
  questions = true,
}: {
  program: TeamProgram;
  proposal: TeamProposal;
  opportunity: OtherProgramOpportunity;
  people?: ReadonlyMap<string, TeamMember> | null;
  /** Whether the responses to the questions are a part here; the evaluate page gives them a tab of their own. */
  questions?: boolean;
}) {
  const sprint = program === "sprint-with-us";
  const contact = proposal.organization?.contact;
  return (
    <>
      <Region id="tab-organization" title="Organization" level={3}>
        <Details
          items={[
            { term: "Legal name", value: proposal.organization?.legalName ?? "Not chosen yet", testId: "proposal-organization" },
            ...(contact
              ? [
                  { term: "Contact name", value: contact.name || "Not entered" },
                  { term: "Contact email", value: contact.email || "Not entered" },
                  ...(contact.phone ? [{ term: "Contact phone", value: contact.phone }] : []),
                ]
              : []),
          ]}
        />
      </Region>
      <Region id="tab-team" title="Team" level={3}>
        {sprint ? (
          <>
            {SWU_PHASES.filter((phase) => proposal.phases[phase]).map((phase) => {
              const team = proposal.phases[phase]!;
              const name = `${SWU_PHASE_NAMES[phase]} phase`;
              return (
                <div key={phase} className="op-region">
                  {team.members.length === 0 ? (
                    <p className="op-text">{`${name}: nobody named yet.`}</p>
                  ) : (
                    <DataTable
                      captionId={`team-caption-${phase}`}
                      caption={`${name} team`}
                      columns={people ? ["Team member", "Scrum master", "Membership", "Capabilities"] : ["Team member", "Scrum master"]}
                    >
                      {team.members.map((member) => {
                        const person = people?.get(member.member.id);
                        return (
                          <tr key={member.member.id}>
                            <td>{member.member.name}</td>
                            <td>{member.scrumMaster ? "Yes" : "No"}</td>
                            {people ? (
                              <>
                                <td>
                                  <ProposalStatus bare>{person?.membershipStatus === "ACTIVE" ? "Active" : person?.membershipStatus === "PENDING" ? "Membership pending" : "Not a member"}</ProposalStatus>
                                </td>
                                <td>{person && person.capabilities.length > 0 ? person.capabilities.join(", ") : "None recorded"}</td>
                              </>
                            ) : null}
                          </tr>
                        );
                      })}
                    </DataTable>
                  )}
                  <p className="op-text">{`${name} proposed cost: ${dollars(team.proposedCost)}`}</p>
                </div>
              );
            })}
            <p className="op-text">{`Total proposed cost: ${dollars(proposal.totalProposedCost ?? 0)} of the ${dollars(proposal.opportunity.budget)} maximum budget.`}</p>
          </>
        ) : (
          <>
            {proposal.team.length === 0 ? (
              <p className="op-text">Nobody named yet.</p>
            ) : (
              <>
                <DataTable captionId="team-caption" caption="Team members, by the resource each is named against" columns={["Resource", "Team member", "Hourly rate"]}>
                  {proposal.team.map((member) => (
                    <tr key={member.member.id}>
                      <td>{`${areaName(member.resource.serviceArea)}${member.resource.targetAllocation !== null ? `, ${member.resource.targetAllocation}% of full time` : ""}`}</td>
                      <td>{member.member.name}</td>
                      <td>{rate(member.hourlyRate)}</td>
                    </tr>
                  ))}
                </DataTable>
                <p className="op-text">{`Bid: ${rate(hourlyBid(proposal.team))} an hour, each rate weighted by its resource's target allocation.`}</p>
              </>
            )}
            {proposal.totalProposedCost !== null ? (
              <p className="op-text">{`Estimated cost over the contract: ${dollars(proposal.totalProposedCost)} of the ${dollars(proposal.opportunity.budget)} maximum budget.`}</p>
            ) : null}
          </>
        )}
      </Region>
      {questions ? (
        <Region id="tab-questions" title={sprint ? "Team questions" : "Resource questions"} level={3}>
          {opportunity.questions.length === 0 ? (
            <p className="op-text">This opportunity asks no questions.</p>
          ) : (
            <ol className="op-list">
              {opportunity.questions.map((question, order) => {
                const response = proposal.responses.find((entry) => entry.order === order)?.response ?? "";
                return (
                  <li key={order}>
                    <div className="op-region">
                      <p className="op-text">{question.question}</p>
                      <p className="op-text">{`Response: ${notEntered(response)}`}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Region>
      ) : null}
      {sprint ? (
        <Region id="tab-references" title="References" level={3}>
          {proposal.references.length === 0 ? (
            <p className="op-text">No references have been added.</p>
          ) : (
            proposal.references.map((reference, index) => (
              <p key={index} className="op-text">
                {[reference.name, reference.company, reference.email, reference.phone].filter((part) => part.trim() !== "").join(", ")}
              </p>
            ))
          )}
        </Region>
      ) : null}
      <Region id="tab-attachments" title="Attachments" level={3}>
        {proposal.attachments.length === 0 ? (
          <p className="op-text">No attachments have been added.</p>
        ) : (
          <ul className="op-list" data-testid="attachment-list">
            {proposal.attachments.map((attachment) => (
              <li key={attachment.id} data-testid="attachment-existing-row">
                <Link
                  href={fileContentAddress(attachment.id)}
                  data-testid="attachment-download-link"
                  onClick={(event) => {
                    event.preventDefault();
                    void downloadFile(attachment.id, attachment.name);
                  }}
                >
                  {`Download ${attachment.name}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Region>
    </>
  );
}

const percent = (value: number | null) => (value === null ? "Not scored" : `${value}%`);

/**
 * The vendor's result once a decision has been made (R-2.32): the anonymous name evaluators saw
 * (R-2.5), each stage's score, the weighted total and the rank.
 */
function ScoresheetDetails({ program, proposal, scoresheet }: { program: TeamProgram; proposal: TeamProposal; scoresheet: Scoresheet }) {
  const sprint = program === "sprint-with-us";
  return (
    <>
      {proposal.anonymousProponentName ? (
        <p className="op-text">
          During evaluation, evaluators saw this proposal as <span data-testid="proposal-anonymous-name">{proposal.anonymousProponentName}</span>.
        </p>
      ) : null}
      <Details
        items={[
          { term: sprint ? "Team questions" : "Resource questions", value: percent(scoresheet.questions) },
          { term: sprint ? "Code challenge" : "Challenge", value: percent(scoresheet.challenge) },
          ...(sprint ? [{ term: "Team scenario", value: percent(scoresheet.scenario) }] : []),
          { term: "Price", value: percent(scoresheet.price) },
          { term: "Total", value: percent(scoresheet.total), testId: "proposal-total-score" },
          ...(scoresheet.rank ? [{ term: "Rank", value: rankLabel(scoresheet.rank), testId: "proposal-rank" }] : []),
        ]}
      />
      <p className="op-note">
        The total combines each stage's score in the proportions the opportunity states. The price score is this proposal's share of the
        lowest bid still in contention.
      </p>
    </>
  );
}
