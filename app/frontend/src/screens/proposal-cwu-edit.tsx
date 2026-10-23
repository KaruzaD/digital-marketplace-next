import { useEffect, useState } from "react";
import { AlertDialog, Button, InlineAlert, Link, Modal, Text } from "@bcgov/design-system-react-components";
import { useNavigate, useRouterState, useSearch } from "@tanstack/react-router";
import { fileContentAddress } from "@rules/files";
import {
  ProposalProblem,
  isAcceptingProposals,
  offeredProposalActions,
  proposalHistoryLabel,
  proposalStatusLabel,
} from "@rules/proposals";
import { rankLabel } from "@rules/proposal-evaluation";
import { Account, changeOwnAccount } from "../api/accounts";
import { downloadFile } from "../api/files";
import {
  ActingFor,
  CwuProposal,
  ProposalSaveAnswer,
  changeCwuProposal,
  deleteCwuProposal,
  fetchCwuProposal,
  fetchOrganizationsActingFor,
} from "../api/proposals";
import { NotFound } from "../app/not-found";
import { Actions, DataTable, Details, PageTitle, Region, Waiting, type Detail } from "../app/opportunity-kit";
import { Focused, ProposalActions, ProposalHead, ProposalPage, ProposalTabs } from "../app/proposal-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { deadlineLabel, momentLabel, rewardLabel } from "./opportunity-parts";
import { CwuProposalForm, ProblemSummary, TermsDialog, submissionProblems, valuesFrom } from "./proposal-cwu-form";

/**
 * Manage a Code With Us proposal, at
 * `/opportunities/code-with-us/:opportunityId/proposals/:proposalId/edit` (proposal-cwu-edit),
 * drawn as its stories draw it: the head with the status label, the details, the links, the action
 * bar, the tabs, then the tab's region. Edit turns the Proposal tab into the create page's long
 * form, filled in, with the head, details and tabs above it.
 *
 * It is the vendor's page: the vendor who wrote the proposal, or who owns or administers its
 * organization. Anybody else — another vendor, staff — and a draft that has been deleted are shown
 * the missing page (R-2.4, R-2.24). A draft may be edited, submitted or deleted; a submitted one
 * edited or withdrawn; a withdrawn one edited or put back in (R-2.4, R-2.23). Every submission
 * passes through the terms dialog (R-2.3); one the service refuses because the deadline has passed
 * says so under the action bar (R-2.15). The History tab lists every change of state (R-2.9).
 */

type Tab = "proposal" | "history";
const TABS: readonly Tab[] = ["proposal", "history"];
const TAB_NAMES: Readonly<Record<Tab, string>> = { proposal: "Proposal", history: "History" };
const TAB_LIST = TABS.map((key) => ({ key, label: TAB_NAMES[key] }));

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | { readonly kind: "found"; readonly proposal: CwuProposal; readonly organizations: readonly ActingFor[] };

export function ProposalCwuEditScreen({ opportunityId, proposalId }: { opportunityId: string; proposalId: string }) {
  useScreenTitle("Manage a Code With Us proposal");
  return (
    <RequireSignIn title="Manage a Code With Us proposal" loadingLabel="Loading proposal…">
      {(account) => <ManageLoader account={account} opportunityId={opportunityId} proposalId={proposalId} />}
    </RequireSignIn>
  );
}

function ManageLoader({ account, opportunityId, proposalId }: { account: Account; opportunityId: string; proposalId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const vendor = account.type === "VENDOR";
  useEffect(() => {
    if (!vendor) return;
    let current = true;
    void Promise.all([fetchCwuProposal(proposalId), fetchOrganizationsActingFor()]).then(([answer, organizations]) => {
      if (!current) return;
      setLoaded(answer.kind === "found" ? { kind: "found", proposal: answer.proposal, organizations } : { kind: "missing" });
    });
    return () => {
      current = false;
    };
  }, [proposalId, vendor]);

  if (!vendor || loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <ProposalPage>
        <PageTitle>Manage a Code With Us proposal</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    );
  }
  if (loaded.proposal.opportunity.id !== opportunityId.toLowerCase()) return <NotFound />;
  return <Manage account={account} initial={loaded.proposal} organizations={loaded.organizations} />;
}

/** What the page says after something it did. */
type Notice =
  | { readonly kind: "done"; readonly text: string }
  | { readonly kind: "draft-saved" }
  | { readonly kind: "not-submitted"; readonly reasons: readonly string[] }
  | { readonly kind: "incomplete"; readonly problems: readonly ProposalProblem[] }
  | { readonly kind: "refused"; readonly title: string; readonly reasons: readonly string[] };

/** What the create page said it had just done, handed over as it moved here. */
function useArrivalNotice(): Notice | null {
  const saved = useRouterState({ select: (state) => (state.location.state as { proposalSaved?: string } | undefined)?.proposalSaved });
  if (saved === "draft") return { kind: "draft-saved" };
  if (saved === "submitted") return { kind: "done", text: "Your proposal has been submitted." };
  return null;
}

function Manage({ account, initial, organizations }: { account: Account; initial: CwuProposal; organizations: readonly ActingFor[] }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const arrival = useArrivalNotice();
  const [proposal, setProposal] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [notice, setNoticeState] = useState<Notice | null>(arrival);
  // Each notice is a new message, focused as it appears.
  const [noticeVersion, setNoticeVersion] = useState(0);
  const [dialog, setDialog] = useState<"terms" | "withdraw" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);

  function setNotice(next: Notice | null) {
    setNoticeState(next);
    setNoticeVersion((version) => version + 1);
  }

  const tab: Tab = TABS.includes(search.tab as Tab) ? (search.tab as Tab) : "proposal";
  const opportunityId = proposal.opportunity.id;
  const base = `/opportunities/code-with-us/${opportunityId}/proposals/${proposal.id}`;
  const offers = offeredProposalActions(proposal.status);
  const status = proposalStatusLabel(proposal.status);
  const title = proposal.opportunity.title || "Untitled opportunity";
  // The organization already named stays a choice even when the vendor no longer administers it.
  const named = proposal.proponent.tag === "organization" ? proposal.proponent.value : null;
  const choices = named && !organizations.some((organization) => organization.id === named.id) ? [...organizations, named] : organizations;

  const head = <ProposalHead eyebrow="Manage a Code With Us proposal" program="code-with-us" status={status} title={title} />;
  const identifiers: Detail[] = [
    { term: "Proposal ID", value: proposal.id, testId: "proposal-identifier" },
    { term: "Opportunity ID", value: opportunityId, testId: "opportunity-identifier" },
  ];
  const tabs = <ProposalTabs base={`${base}/edit`} current={tab} tabs={TAB_LIST} />;

  function goToTab(next: Tab) {
    void navigate({
      to: "/opportunities/code-with-us/$opportunityId/proposals/$proposalId/edit",
      params: { opportunityId, proposalId: proposal.id },
      search: { tab: next } as never,
    });
  }

  /** The answer to a change: the proposal as it now stands, or why not. */
  function settle(answer: ProposalSaveAnswer, done: string, refusedTitle: string) {
    if (answer.kind === "saved") {
      setProposal(answer.proposal);
      setNotice({ kind: "done", text: done });
      return;
    }
    const reasons = answer.kind === "refused" ? answer.reasons : ["The service could not do that. Try again."];
    if (refusedTitle === "Your proposal was not submitted") setNotice({ kind: "not-submitted", reasons });
    else setNotice({ kind: "refused", title: refusedTitle, reasons });
  }

  /**
   * Submit proposal: what it holds is checked first, and then the terms are asked for (R-2.3,
   * R-2.13). Once the deadline has passed nothing is worth completing, so the submission goes to the
   * service, whose refusal says why (R-2.15).
   */
  function askToSubmit() {
    const late = !isAcceptingProposals(proposal.opportunity, new Date());
    const problems = late ? [] : submissionProblems(valuesFrom(proposal));
    if (problems.length > 0) {
      setNotice({ kind: "incomplete", problems });
      return;
    }
    setNotice(null);
    setDialog("terms");
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    const accepted = await changeOwnAccount(account.id, "acceptTerms");
    const answer: ProposalSaveAnswer = accepted.kind === "saved" ? await changeCwuProposal(proposal.id, "submit") : { kind: "failed" };
    setBusy(false);
    setDialog(null);
    settle(answer, "Your proposal has been submitted.", "Your proposal was not submitted");
  }

  async function withdraw() {
    if (busy) return;
    setBusy(true);
    const answer = await changeCwuProposal(proposal.id, "withdraw");
    setBusy(false);
    setDialog(null);
    settle(answer, "Your proposal has been withdrawn.", "Your proposal was not withdrawn");
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    const answer = await deleteCwuProposal(proposal.id);
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
      <CwuProposalForm
        key={formVersion}
        purpose="edit"
        opportunityId={opportunityId}
        head={
          <>
            {head}
            <Details items={identifiers} />
            {tabs}
          </>
        }
        intro={<p className="pf-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>}
        summary={{
          program: "code-with-us",
          title,
          closes: deadlineLabel(proposal.opportunity.proposalDeadline),
          facts: [rewardLabel(proposal.opportunity.reward)],
          status,
        }}
        initial={valuesFrom(proposal)}
        initialAttachments={proposal.attachments}
        organizations={choices}
        refusalTitle="Your changes were not saved"
        onSend={async (action, submission) => {
          if (action === "save") return changeCwuProposal(proposal.id, "edit", submission);
          const accepted = await changeOwnAccount(account.id, "acceptTerms");
          if (accepted.kind !== "saved") return { kind: "failed" };
          const saved = await changeCwuProposal(proposal.id, "edit", submission);
          if (saved.kind !== "saved" || saved.proposal.status === "SUBMITTED") return saved;
          return changeCwuProposal(proposal.id, "submit");
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
        <Link href={`/opportunities/code-with-us/${opportunityId}`}>View the opportunity</Link>
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
              <Button variant="primary" isDisabled={busy} onPress={askToSubmit} data-testid="proposal-submit">
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
      <NoticeArea key={noticeVersion} notice={notice} onDismiss={() => setNotice(null)} />
      {tabs}
      <Region id="tab-heading" title={TAB_NAMES[tab]}>
        {tab === "proposal" ? <ProposalDetails proposal={proposal} /> : null}
        {tab === "history" ? <ProposalHistory proposal={proposal} /> : null}
      </Region>
      <TermsDialog isOpen={dialog === "terms"} isSending={busy} onCancel={() => setDialog(null)} onConfirm={() => void submit()} />
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
            {`It will no longer be considered. You can submit it again only while the opportunity is accepting proposals, until ${deadlineLabel(
              proposal.opportunity.proposalDeadline,
            )}. You and the administrators will be sent a withdrawal notice.`}
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

function NoticeArea({ notice, onDismiss }: { notice: Notice | null; onDismiss: () => void }) {
  if (notice?.kind === "incomplete") {
    return (
      <div className="op-region">
        <ProblemSummary problems={notice.problems} />
        <p className="op-text">Edit the proposal to complete it, then submit it.</p>
      </div>
    );
  }
  if (notice?.kind === "draft-saved") {
    // Said on arrival from the create page, where focus starts at the new page's H1 (the root
    // layout), so the alert is announced as a status rather than taking focus from it.
    return (
      <div role="status">
        <InlineAlert
          variant="success"
          title="Draft Proposal Saved"
          description="Your draft Code With Us proposal has been saved. You can return to this page to complete and submit your proposal prior to the opportunity's proposal deadline."
          isCloseable
          onClose={onDismiss}
        />
      </div>
    );
  }
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

const notEntered = (value: string) => (value.trim() === "" ? "Not entered yet" : value);
// An organization's contact, as the opportunity screens word a blank one.
const orNotEntered = (value: string) => (value.trim() === "" ? "Not entered" : value);

/**
 * The proposal as it stands, read-only, each part a region of the tab, with its result once a
 * decision has been made (R-2.32). The read-only proposal page shows the score on its own, so it
 * leaves the result out.
 */
export function ProposalDetails({ proposal, showResult = true }: { proposal: CwuProposal; showResult?: boolean }) {
  const { proponent } = proposal;
  const decided = showResult && (proposal.status === "AWARDED" || proposal.status === "NOT_AWARDED");
  const proponentItems: Detail[] =
    proponent.tag === "organization"
      ? [
          { term: "Proponent type", value: "Organization" },
          { term: "Organization", value: proponent.value.legalName },
          ...(proponent.value.contact
            ? [
                { term: "Contact name", value: orNotEntered(proponent.value.contact.name) },
                { term: "Contact email", value: orNotEntered(proponent.value.contact.email) },
                ...(proponent.value.contact.phone ? [{ term: "Contact phone", value: proponent.value.contact.phone }] : []),
              ]
            : []),
        ]
      : [
          { term: "Proponent type", value: "Individual" },
          { term: "Legal name", value: notEntered(proponent.value.legalName) },
          { term: "Email address", value: notEntered(proponent.value.email) },
          ...(proponent.value.phone ? [{ term: "Phone number", value: proponent.value.phone }] : []),
          { term: "Address", value: notEntered(addressOf(proponent.value)) },
        ];
  return (
    <>
      {decided && typeof proposal.score === "number" ? (
        <Region id="tab-result" title="Result" level={3}>
          <Details
            items={[
              { term: "Score", value: `${proposal.score}%`, testId: "proposal-score" },
              ...(proposal.rank ? [{ term: "Rank", value: rankLabel(proposal.rank), testId: "proposal-rank" }] : []),
            ]}
          />
        </Region>
      ) : null}
      <Region id="tab-proponent" title="Proponent" level={3}>
        <Details items={proponentItems} />
      </Region>
      <Region id="tab-text" title="Proposal text" level={3}>
        <p className="op-text">{notEntered(proposal.proposalText)}</p>
      </Region>
      <Region id="tab-comments" title="Additional comments" level={3}>
        <p className="op-text">{notEntered(proposal.additionalComments)}</p>
      </Region>
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

function addressOf(individual: { street1: string; street2: string; city: string; region: string; mailCode: string; country: string }): string {
  const lines = [individual.street1, individual.street2, individual.city, `${individual.region} ${individual.mailCode}`.trim(), individual.country];
  return lines.map((line) => line.trim()).filter((line) => line !== "").join(", ");
}

/** Every change of state, newest first, with who made it and any note (R-2.9, R-2.35), in every program. */
export function ProposalHistory({ proposal }: { proposal: Pick<CwuProposal, "history"> }) {
  return (
    <DataTable
      captionId="history-caption"
      caption="Every change of state and every score entered, newest first"
      columns={["Date", "Entry", "By", "Note"]}
      testId="proposal-history-table"
    >
      {proposal.history.map((entry, index) => (
        <tr key={`${entry.createdAt}-${index}`}>
          <td>
            <time dateTime={entry.createdAt}>{momentLabel(entry.createdAt)}</time>
          </td>
          <td>{proposalHistoryLabel(entry)}</td>
          <td>{entry.createdBy?.name ?? "System"}</td>
          <td>{entry.note ?? ""}</td>
        </tr>
      ))}
    </DataTable>
  );
}
