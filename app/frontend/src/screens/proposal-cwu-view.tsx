import { useEffect, useState } from "react";
import { Link } from "@bcgov/design-system-react-components";
import { useSearch } from "@tanstack/react-router";
import type { Account } from "../api/accounts";
import { offeredEvaluationActions, rankLabel } from "@rules/proposal-evaluation";
import { proposalStatusLabel } from "@rules/proposals";
import { CwuProposal, changeCwuProposal, fetchCwuProposal } from "../api/proposals";
import { NotFound } from "../app/not-found";
import { Actions, Details, PageTitle, Region, Waiting, type Detail } from "../app/opportunity-kit";
import { ProposalHead, ProposalPage, ProposalTabs } from "../app/proposal-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { momentLabel } from "./opportunity-parts";
import { ProposalDetails, ProposalHistory } from "./proposal-cwu-edit";
import { EvaluationActions } from "./proposal-evaluation-actions";

/**
 * A Code With Us proposal, read-only, at
 * `/opportunities/code-with-us/:opportunityId/proposals/:proposalId` (proposal-cwu-view), drawn as
 * its stories draw it: the head with the proponent as the H1 and the status label, the details,
 * the score, the printable-copy link, the action bar, the tabs (`?tab=…`), then the tab's region.
 *
 * Whoever may read the proposal sees it, and the service decides who that is: the vendor who wrote
 * it and a vendor who owns or administers its organization, never another vendor (R-2.24); the
 * opportunity's author and administrators once the opportunity has closed, and never a draft
 * (R-2.25). Anybody else, and a proposal on another opportunity's address, is shown the missing
 * page. The opportunity's author and administrators enter its score, disqualify it and award it here
 * (R-2.26, R-2.33, R-2.34); its rank among the scored proposals is shown beside the score (R-2.32).
 */

type Tab = "proposal" | "history";
const TABS: readonly Tab[] = ["proposal", "history"];
const TAB_NAMES: Readonly<Record<Tab, string>> = { proposal: "Proposal", history: "History" };
const TAB_LIST = TABS.map((key) => ({ key, label: TAB_NAMES[key] }));

type Loaded = { readonly kind: "loading" } | { readonly kind: "missing" } | { readonly kind: "found"; readonly proposal: CwuProposal };

export function ProposalCwuViewScreen({ opportunityId, proposalId }: { opportunityId: string; proposalId: string }) {
  useScreenTitle("Code With Us proposal");
  return (
    <RequireSignIn title="Code With Us proposal" loadingLabel="Loading proposal…">
      {(account) => <ViewLoader account={account} opportunityId={opportunityId} proposalId={proposalId} />}
    </RequireSignIn>
  );
}

function ViewLoader({ account, opportunityId, proposalId }: { account: Account; opportunityId: string; proposalId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  useEffect(() => {
    let current = true;
    void fetchCwuProposal(proposalId).then((answer) => {
      if (current) setLoaded(answer.kind === "found" ? { kind: "found", proposal: answer.proposal } : { kind: "missing" });
    });
    return () => {
      current = false;
    };
  }, [proposalId]);

  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <ProposalPage>
        <PageTitle>Code With Us proposal</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    );
  }
  if (loaded.proposal.opportunity.id !== opportunityId.toLowerCase()) return <NotFound />;
  return <View account={account} proposal={loaded.proposal} />;
}

/** The name the proposal is put forward under: the organization's, or the individual's own. */
export function proponentName(proposal: CwuProposal): string {
  const name = proposal.proponent.value.legalName;
  return name.trim() === "" ? "Proponent not named yet" : name;
}

function View({ account, proposal: initial }: { account: Account; proposal: CwuProposal }) {
  const [proposal, setProposal] = useState(initial);
  const [done, setDone] = useState<string | null>(null);
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const tab: Tab = TABS.includes(search.tab as Tab) ? (search.tab as Tab) : "proposal";
  const opportunityId = proposal.opportunity.id;
  const base = `/opportunities/code-with-us/${opportunityId}/proposals/${proposal.id}`;
  const vendor = account.type === "VENDOR";
  // Staff manage the opportunity; a vendor reads it, and manages their proposal on its own page.
  const opportunityAddress = vendor ? `/opportunities/code-with-us/${opportunityId}` : `/opportunities/code-with-us/${opportunityId}/edit`;

  const details: Detail[] = [
    { term: "Opportunity", value: <Link href={opportunityAddress}>{proposal.opportunity.title || "Untitled opportunity"}</Link> },
    ...(proposal.submittedAt && proposal.status !== "DRAFT"
      ? [{ term: "Submitted", value: momentLabel(proposal.submittedAt), testId: "proposal-submitted-at" }]
      : []),
    { term: "Proposal ID", value: proposal.id, testId: "proposal-identifier" },
  ];

  return (
    <ProposalPage>
      <ProposalHead
        eyebrow="Code With Us proposal"
        program="code-with-us"
        status={proposalStatusLabel(proposal.status)}
        title={<span data-testid="proposal-proponent-name">{proponentName(proposal)}</span>}
      />
      <Details items={details} />
      {/* The score is shown to whoever the service gives it to: staff, and the vendor once decided (R-2.32). */}
      {"score" in proposal ? (
        <Region id="scores-heading" title="Score">
          <Details
            items={[
              { term: "Score", value: typeof proposal.score === "number" ? `${proposal.score}%` : "Not yet scored", testId: "proposal-score" },
              ...(proposal.rank ? [{ term: "Rank", value: rankLabel(proposal.rank), testId: "proposal-rank" }] : []),
            ]}
          />
        </Region>
      ) : null}
      <Actions>
        {vendor ? <Link href={`${base}/edit`}>Manage this proposal</Link> : null}
        <Link href={`${base}/export`} data-testid="proposal-export-link">
          Printable copy
        </Link>
      </Actions>
      {/* Staff read a proposal only as the opportunity's author or an administrator, once it has closed. */}
      {!vendor ? (
        <EvaluationActions
          offers={offeredEvaluationActions(proposal.status, proposal.opportunity.status)}
          change={(tag, value) => changeCwuProposal(proposal.id, tag, value)}
          onChanged={(changed, text) => {
            setProposal(changed);
            setDone(text);
          }}
        />
      ) : null}
      <div role="status">{done ? <p className="op-text">{done}</p> : null}</div>
      <ProposalTabs base={base} current={tab} tabs={TAB_LIST} />
      <Region id="tab-heading" title={TAB_NAMES[tab]}>
        {tab === "proposal" ? <ProposalDetails proposal={proposal} showResult={false} /> : null}
        {tab === "history" ? <ProposalHistory proposal={proposal} /> : null}
      </Region>
    </ProposalPage>
  );
}
