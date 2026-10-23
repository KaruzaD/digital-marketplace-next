import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { AlertDialog, Button, Modal, Text } from "@bcgov/design-system-react-components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CwuStatus,
  OPPORTUNITY_INCOMPLETE,
  changeIsAnnounced,
  earliestDeadlineFor,
  isPermittedTransition,
  isUnpublished,
  mayAddAddendum,
  mayCancelOpportunity,
  mayDeleteOpportunity,
  mayEditOpportunity,
  mayManageOpportunity,
  mayPublishOpportunity,
  maySubmitForReview,
  statusLabel,
} from "@rules/opportunities";
import type { Account } from "../api/accounts";
import {
  CwuOpportunity,
  RunningAction,
  SaveAnswer,
  attachToCwuOpportunity,
  changeCwuOpportunity,
  deleteCwuOpportunity,
  fetchCwuOpportunity,
  runCwuOpportunity,
} from "../api/opportunities";
import { NotFound } from "../app/not-found";
import {
  ActionBar,
  Details,
  ManageTabs,
  OpportunityHead,
  OpportunityPage,
  PageTitle,
  Region,
  Waiting,
  type Detail,
} from "../app/opportunity-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { CwuOpportunityForm, PublishDialog, valuesFrom } from "./opportunity-cwu-form";
import { deadlineLabel, publishedLabel, rewardLabel, todayInPacific } from "./opportunity-parts";
import { AddendaTab, CancelDialog, HistoryTable, ReportingSection, Sent } from "./opportunity-running";
import { ProposalsTab } from "./opportunity-cwu-proposals-tab";

/**
 * Manage a Code With Us opportunity, at `/opportunities/code-with-us/:opportunityId/edit`
 * (opportunity-cwu-edit): its summary, its details in their form, and its history, each on its
 * own address (`?tab=…`). Only its author and administrators see it; anybody else is shown the
 * missing page (R-1.3, R-1.30).
 *
 * The action bar offers only what the person may do in the opportunity's state
 * (design/DESIGN.md, "Who is offered what on the manage page"): a draft's author may edit it,
 * submit it for review and delete it; an administrator may edit, publish and delete a draft or an
 * opportunity under review, and edit and cancel one that is published, at its evaluation stage or
 * in processing (R-1.20, R-1.22, R-1.28, R-1.53, R-1.56). Once it is no longer a draft, the Addenda
 * tab adds an addendum (R-1.32) and the Proposals tab lists what was submitted once it has closed
 * (R-1.31, R-2.25); the History tab takes a private note with files (R-1.33); and the
 * Summary tab reports its views, watchers and proposals once it is published (R-1.30).
 */

type Tab = "summary" | "opportunity" | "addenda" | "history" | "proposals";

type Loaded = { readonly kind: "loading" } | { readonly kind: "missing" } | { readonly kind: "found"; readonly opportunity: CwuOpportunity };

export function OpportunityCwuEditScreen({ opportunityId }: { opportunityId: string }) {
  useScreenTitle("Manage a Code With Us opportunity");
  return (
    <RequireSignIn title="Manage a Code With Us opportunity" loadingLabel="Loading opportunity…">
      {(account) => <ManageLoader account={account} opportunityId={opportunityId} />}
    </RequireSignIn>
  );
}

function ManageLoader({ account, opportunityId }: { account: Account; opportunityId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  useEffect(() => {
    let current = true;
    void fetchCwuOpportunity(opportunityId).then((answer) => {
      if (current) setLoaded(answer.kind === "found" ? { kind: "found", opportunity: answer.opportunity } : { kind: "missing" });
    });
    return () => {
      current = false;
    };
  }, [opportunityId]);

  if (loaded.kind === "loading") {
    return (
      <OpportunityPage>
        <PageTitle>Manage a Code With Us opportunity</PageTitle>
        <Waiting label="Loading opportunity" />
      </OpportunityPage>
    );
  }
  if (
    loaded.kind === "missing" ||
    !mayManageOpportunity(account, { status: loaded.opportunity.status, createdBy: loaded.opportunity.createdBy?.id ?? null })
  ) {
    return <NotFound />;
  }
  return <Manage account={account} initial={loaded.opportunity} />;
}

/** What the page says after something it did: done, refused as incomplete, or refused otherwise. */
export type Notice =
  | { readonly kind: "done"; readonly text: string }
  | { readonly kind: "incomplete"; readonly action: "submit" | "publish" }
  | { readonly kind: "refused"; readonly text: string };

const DONE: Readonly<Record<"submit" | "publish" | "save" | RunningAction["tag"], string>> = {
  submit: "The opportunity has been submitted for review. Every administrator has been told.",
  publish: "The opportunity has been published.",
  save: "Your changes have been saved.",
  cancel: "The opportunity has been cancelled. Everyone watching it and everyone who submitted a proposal is being told.",
  addAddendum: "The addendum has been added.",
};

function Manage({ account, initial }: { account: Account; initial: CwuOpportunity }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const [opportunity, setOpportunity] = useState(initial);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dialog, setDialog] = useState<"publish" | "delete" | "cancel" | null>(null);
  const [busy, setBusy] = useState(false);
  // Bumped when the form is saved, so it starts again from what was saved; attaching a file at
  // once changes the opportunity without throwing away what is being typed.
  const [formVersion, setFormVersion] = useState(0);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notice && notice.kind !== "done") noticeRef.current?.focus();
  }, [notice]);

  const standing = { status: opportunity.status, createdBy: opportunity.createdBy?.id ?? null };
  const draft = opportunity.status === "DRAFT";
  const offered = tabsFor(opportunity.status);
  const tab: Tab = offered.includes(search.tab as Tab) ? (search.tab as Tab) : "summary";
  const base = `/opportunities/code-with-us/${opportunity.id}/edit`;
  const mayEdit = mayEditOpportunity(account, standing);
  const administrator = account.type === "ADMIN";
  const today = todayInPacific();

  const offers = {
    edit: mayEdit,
    // A draft's author is offered Submit for review; an administrator publishes instead.
    submit: draft && !administrator && maySubmitForReview(account, standing),
    publish: isUnpublished(opportunity.status) && mayPublishOpportunity(account),
    delete: mayDeleteOpportunity(account, standing),
    // Published, an evaluation stage or processing, by an administrator (R-1.20, R-1.28).
    cancel: mayCancelOpportunity(account) && isPermittedTransition("code-with-us", opportunity.status, "CANCELED"),
  };
  const editing = tab === "opportunity" && mayEdit;

  /**
   * Cancelling or an addendum. A refusal is said in the tab's section, except for the addendum,
   * whose form says it beside what was typed.
   */
  async function run(action: RunningAction): Promise<Sent> {
    setBusy(true);
    const answer = await runCwuOpportunity(opportunity.id, action);
    setBusy(false);
    if (answer.kind === "saved") {
      setOpportunity(answer.opportunity);
      setNotice({ kind: "done", text: DONE[action.tag] });
      return null;
    }
    const why = answer.kind === "refused" ? answer.reasons.join(" ") : "The service could not do that. Try again.";
    if (action.tag === "cancel") setNotice({ kind: "refused", text: why });
    return why;
  }

  async function cancelOpportunity(note: string) {
    if (busy) return;
    await run({ tag: "cancel", note });
    setDialog(null);
  }

  function goToTab(next: Tab) {
    void navigate({ to: "/opportunities/code-with-us/$opportunityId/edit", params: { opportunityId: opportunity.id }, search: { tab: next } as never });
  }

  async function act(action: "submit" | "publish") {
    if (busy) return;
    setBusy(true);
    const answer = await changeCwuOpportunity(opportunity.id, action === "submit" ? "submitForReview" : "publish");
    setBusy(false);
    setDialog(null);
    if (answer.kind === "saved") {
      setOpportunity(answer.opportunity);
      setNotice({ kind: "done", text: DONE[action] });
      return;
    }
    setNotice(refusalNotice(answer, action));
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    const answer = await deleteCwuOpportunity(opportunity.id);
    setBusy(false);
    setDialog(null);
    if (answer.kind === "saved") {
      void navigate({ to: "/dashboard" });
      return;
    }
    setNotice({
      kind: "refused",
      text: answer.kind === "refused" ? answer.reasons.join(" ") : "The opportunity could not be deleted. Try again.",
    });
  }

  return (
    <OpportunityPage>
      <OpportunityHead
        eyebrow="Manage a Code With Us opportunity"
        program="code-with-us"
        status={statusLabel(opportunity.status, "code-with-us")}
        title={opportunity.title || "Untitled opportunity"}
      />
      <Details items={[{ term: "Opportunity ID", value: opportunity.id, testId: "opportunity-identifier" }]} />
      {/* The actions stay on every tab, the Opportunity tab's form included, so a draft can be put
          forward from wherever its author is; only Edit is left off where the form is already
          open (decision record 0032). The bar is always present, and empty when nothing is offered. */}
      <ActionBar>
        {(offers.edit && !editing) || offers.submit || offers.publish || offers.delete || offers.cancel ? (
          <>
            {offers.edit && !editing ? (
              <Button variant="secondary" onPress={() => goToTab("opportunity")} data-testid="opportunity-edit-button">
                Edit
              </Button>
            ) : null}
            {offers.submit ? (
              <Button variant="primary" isDisabled={busy} onPress={() => void act("submit")} data-testid="opportunity-submit-for-review">
                Submit for review
              </Button>
            ) : null}
            {offers.publish ? (
              <Button variant="primary" isDisabled={busy} onPress={() => setDialog("publish")} data-testid="opportunity-publish">
                Publish
              </Button>
            ) : null}
            {offers.delete ? (
              <Button variant="secondary" danger isDisabled={busy} onPress={() => setDialog("delete")} data-testid="opportunity-delete-button">
                Delete
              </Button>
            ) : null}
            {offers.cancel ? (
              <Button variant="secondary" danger isDisabled={busy} onPress={() => setDialog("cancel")} data-testid="opportunity-cancel-button">
                Cancel opportunity
              </Button>
            ) : null}
          </>
        ) : null}
      </ActionBar>
      <ManageTabs base={base} current={tab} tabs={offered.map((key) => ({ key, label: TAB_NAMES[key] }))} />
      <Region id="tab-heading" title={TAB_NAMES[tab]} testId={tab === "history" ? "opportunity-history-section" : undefined}>
        {/* What an action came to is said in the section being read, directly under its heading,
            whichever tab it is (decision record 0032). */}
        <NoticeArea notice={notice} noticeRef={noticeRef} />
        {tab === "summary" ? <SummaryTab opportunity={opportunity} /> : null}
        {tab === "opportunity" ? (
          <CwuOpportunityForm
            key={formVersion}
            purpose="edit"
            account={account}
            initial={valuesFrom(opportunity)}
            initialAttachments={opportunity.attachments}
            isDraft={draft}
            today={today}
            earliestDeadline={earliestDeadlineFor(opportunity, today)}
            headingLevel={3}
            readOnly={!mayEdit}
            consequence={
              <p className="op-text">
                {draft
                  ? "Saving records a new version of the draft. Nothing is checked until it is submitted for review or published."
                  : "Saving records a new version. Everyone watching this opportunity, everyone who has submitted a proposal, and its author will be emailed."}
              </p>
            }
            onSend={(_action, submission) => changeCwuOpportunity(opportunity.id, "edit", submission)}
            onSaved={(saved) => {
              setOpportunity(saved);
              setFormVersion((version) => version + 1);
              setNotice({ kind: "done", text: DONE.save });
            }}
            attachNow={async (fileIds) => {
              const answer = await attachToCwuOpportunity(opportunity.id, fileIds);
              if (answer.kind === "saved") {
                setOpportunity(answer.opportunity);
                return null;
              }
              return answer.kind === "refused" && answer.reasons.length > 0
                ? answer.reasons.join(" ")
                : "The file could not be attached. Try again.";
            }}
            onCancel={() => goToTab("summary")}
          />
        ) : null}
        {tab === "addenda" ? (
          <AddendaTab
            addenda={opportunity.addenda}
            mayAdd={mayAddAddendum(account, standing)}
            announced={changeIsAnnounced(opportunity.status)}
            onAdd={(addendum) => run({ tag: "addAddendum", addendum })}
          />
        ) : null}
        {/* No screen adds a private note (R-1.33); the history shows the ones there are. */}
        {tab === "history" ? <HistoryTable history={opportunity.history ?? []} /> : null}
        {/* Withheld until the opportunity closes, and never a draft (R-1.31, R-2.25). */}
        {tab === "proposals" ? <ProposalsTab opportunity={opportunity} /> : null}
      </Region>
      <CancelDialog
        key={dialog === "cancel" ? "open" : "closed"}
        isOpen={dialog === "cancel"}
        isSending={busy}
        onKeep={() => setDialog(null)}
        onConfirm={(note) => void cancelOpportunity(note)}
      />
      <PublishDialog
        isOpen={dialog === "publish"}
        isSending={busy}
        onCancel={() => setDialog(null)}
        onConfirm={() => void act("publish")}
      />
      <DeleteDialog isOpen={dialog === "delete"} isSending={busy} onCancel={() => setDialog(null)} onConfirm={() => void remove()} />
    </OpportunityPage>
  );
}

/** Asks before an opportunity is deleted (design/DESIGN.md, "Confirmation dialogs"). */
export function DeleteDialog({
  isOpen,
  isSending,
  onCancel,
  onConfirm,
}: {
  readonly isOpen: boolean;
  readonly isSending: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} isDismissable onOpenChange={(open) => (!open && !isSending ? onCancel() : undefined)}>
      <AlertDialog
        variant="destructive"
        title="Delete this opportunity?"
        data-testid="opportunity-delete-dialog"
        buttons={
          <>
            <Button variant="secondary" isDisabled={isSending} onPress={onCancel} data-testid="opportunity-dialog-cancel">
              Cancel
            </Button>
            <Button variant="primary" danger isDisabled={isSending} onPress={onConfirm} data-testid="opportunity-delete-confirm">
              Delete opportunity
            </Button>
          </>
        }
      >
        <p className="op-text">The opportunity and everything entered in it will be removed. This cannot be undone.</p>
      </AlertDialog>
    </Modal>
  );
}

const TAB_NAMES: Readonly<Record<Tab, string>> = {
  summary: "Summary",
  opportunity: "Opportunity",
  addenda: "Addenda",
  history: "History",
  proposals: "Proposals",
};

/**
 * The tabs follow the stage: an addendum needs an opportunity that is no longer a draft (R-1.32),
 * and only one that has been put forward can have proposals; the Proposals tab itself says when
 * they are withheld (R-1.31).
 */
export function tabsFor(status: CwuStatus): readonly Tab[] {
  return status === "DRAFT" ? ["summary", "opportunity", "history"] : ["summary", "opportunity", "addenda", "history", "proposals"];
}

export function refusalNotice(
  answer: { readonly kind: "refused"; readonly reasons: readonly string[] } | { readonly kind: "failed" },
  action: "submit" | "publish",
): Notice {
  if (answer.kind === "refused" && answer.reasons.includes(OPPORTUNITY_INCOMPLETE)) return { kind: "incomplete", action };
  if (answer.kind === "refused") return { kind: "refused", text: answer.reasons.join(" ") };
  return { kind: "refused", text: "The service could not do that. Try again." };
}

export function NoticeArea({ notice, noticeRef }: { notice: Notice | null; noticeRef: RefObject<HTMLDivElement> }) {
  let shown: ReactNode = null;
  if (notice?.kind === "incomplete") {
    shown = (
      <div tabIndex={-1} ref={noticeRef} data-testid="opportunity-incomplete-message">
        <TitledAlert variant="danger" role="alert" title="This opportunity is incomplete">
          <Text elementType="p">
            {`It could not be ${notice.action === "submit" ? "submitted for review" : "published"}. Edit the opportunity, complete and save the form, and then ${
              notice.action === "submit" ? "submit it" : "publish it"
            } again.`}
          </Text>
        </TitledAlert>
      </div>
    );
  } else if (notice?.kind === "refused") {
    shown = (
      <div tabIndex={-1} ref={noticeRef}>
        <TitledAlert variant="danger" role="alert" title="That could not be done">
          <Text elementType="p">{notice.text}</Text>
        </TitledAlert>
      </div>
    );
  }
  return (
    <>
      {shown}
      <div role="status">{notice?.kind === "done" ? <p className="op-text">{notice.text}</p> : null}</div>
    </>
  );
}

function SummaryTab({ opportunity }: { opportunity: CwuOpportunity }) {
  return (
    <>
      <Details items={summaryDetails(opportunity)} />
      <ReportingSection reporting={opportunity.reporting} unpublished={isUnpublished(opportunity.status)} />
    </>
  );
}

/** The Summary tab's facts, in the head's order, then who made and last changed it (R-1.23, R-1.29). */
export function summaryDetails(opportunity: CwuOpportunity): Detail[] {
  return [
    { term: "Proposal deadline", value: deadlineLabel(opportunity.proposalDeadline) },
    { term: "Reward", value: rewardLabel(opportunity.reward) },
    { term: "Published", value: publishedLabel(opportunity.publishedAt) },
    ...(opportunity.createdBy ? [{ term: "Created by", value: opportunity.createdBy.name, testId: "opportunity-created-by" }] : []),
    ...(opportunity.updatedBy
      ? [{ term: "Last changed by", value: opportunity.updatedBy.name, testId: "opportunity-last-changed-by" }]
      : []),
  ];
}
