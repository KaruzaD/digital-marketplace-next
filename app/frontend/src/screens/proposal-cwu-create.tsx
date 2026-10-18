import { useEffect, useState } from "react";
import { Link } from "@bcgov/design-system-react-components";
import { useNavigate } from "@tanstack/react-router";
import { isUnpublished } from "@rules/opportunities";
import { isAcceptingProposals, mayStartProposal } from "@rules/proposals";
import { Account, changeOwnAccount } from "../api/accounts";
import { CwuOpportunity, fetchCwuOpportunity } from "../api/opportunities";
import { ActingFor, createCwuProposal, fetchOrganizationsActingFor, listCwuProposals } from "../api/proposals";
import { useGoTo } from "../app/go-to";
import { NotFound } from "../app/not-found";
import { PageTitle, Waiting } from "../app/opportunity-kit";
import { CreateHead, ProposalPage, type SummaryFacts } from "../app/proposal-kit";
import { useScreenTitle } from "../app/screen-title";
import { useSession } from "../auth/session";
import { deadlineLabel, rewardLabel } from "./opportunity-parts";
import { CwuProposalForm, blankValues } from "./proposal-cwu-form";

/**
 * Start a Code With Us proposal, at `/opportunities/code-with-us/:opportunityId/proposals/create`
 * (proposal-cwu-create), drawn as the catalogue's Code With Us proposal form: one long form in
 * three parts beside a summary of the opportunity that holds the actions.
 *
 * Only a vendor who has accepted the service's terms at some point may start one; anyone else —
 * staff, an administrator, a visitor — is shown the missing page (R-2.1). A vendor who already
 * holds a proposal on the opportunity is taken to it instead of a new one (R-2.2). A draft is saved
 * whatever it holds (R-2.12), and the vendor lands on its manage page, which says it was saved;
 * Submit checks the form first and then asks for both sets of terms, recording the acceptance as it
 * submits (R-2.3, R-2.13, R-2.14). An opportunity that has closed is still shown here, unlike in the
 * other two programs: submitting is sent unchecked and the service's refusal, "This opportunity is
 * no longer accepting proposals.", is what the vendor reads (R-2.15).
 */
export function ProposalCwuCreateScreen({ opportunityId }: { opportunityId: string }) {
  useScreenTitle("Create a Code With Us proposal");
  const session = useSession();
  if (session.status === "starting") return <CreateWaiting />;
  if (session.status !== "signed-in" || !mayStartProposal(session.account)) return <NotFound />;
  return <CreateLoader account={session.account} opportunityId={opportunityId} />;
}

function CreateWaiting() {
  return (
    <ProposalPage>
      <PageTitle>Create a Code With Us Proposal</PageTitle>
      <Waiting label="Loading opportunity" />
    </ProposalPage>
  );
}

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | { readonly kind: "found"; readonly opportunity: CwuOpportunity; readonly organizations: readonly ActingFor[] };

const proposalAddress = (opportunityId: string, proposalId: string) =>
  `/opportunities/code-with-us/${opportunityId}/proposals/${proposalId}/edit`;

function CreateLoader({ account, opportunityId }: { account: Account; opportunityId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const goTo = useGoTo();

  useEffect(() => {
    let current = true;
    void Promise.all([fetchCwuOpportunity(opportunityId), listCwuProposals(opportunityId), fetchOrganizationsActingFor()]).then(
      ([opportunity, held, organizations]) => {
        if (!current) return;
        const existing = held.kind === "listed" ? held.proposals.find((proposal) => proposal.createdBy?.id === account.id) : undefined;
        if (existing) {
          // One proposal per vendor: the one they hold is where they go (R-2.2).
          goTo(proposalAddress(opportunityId, existing.id));
          return;
        }
        // A Code With Us opportunity that has closed stays reachable here: its creation guard is the
        // service's refusal, which the form shows when the proposal is put forward (R-2.15).
        if (opportunity.kind !== "found" || isUnpublished(opportunity.opportunity.status)) {
          setLoaded({ kind: "missing" });
          return;
        }
        setLoaded({ kind: "found", opportunity: opportunity.opportunity, organizations });
      },
    );
    return () => {
      current = false;
    };
  }, [account.id, opportunityId, goTo]);

  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") return <CreateWaiting />;
  return <Create account={account} opportunity={loaded.opportunity} organizations={loaded.organizations} />;
}

/** The opportunity as the form's summary gives it: program, title, closing date, then value, location and Remote OK. */
export function createSummary(opportunity: Pick<CwuOpportunity, "title" | "proposalDeadline" | "reward" | "location" | "remoteOk">): SummaryFacts {
  return {
    program: "code-with-us",
    title: opportunity.title || "Untitled opportunity",
    closes: deadlineLabel(opportunity.proposalDeadline),
    facts: [rewardLabel(opportunity.reward), opportunity.location, opportunity.remoteOk ? "Remote OK" : ""].filter((fact) => fact.trim() !== ""),
  };
}

function Create({
  account,
  opportunity,
  organizations,
}: {
  account: Account;
  opportunity: CwuOpportunity;
  organizations: readonly ActingFor[];
}) {
  const navigate = useNavigate();
  return (
    <CwuProposalForm
      purpose="create"
      opportunityId={opportunity.id}
      head={<CreateHead title="Create a Code With Us Proposal" opportunity={opportunity.title || "Untitled opportunity"} />}
      intro={
        <>
          <p className="pf-text">
            Use the form provided to create your proposal for this Code With Us opportunity. You can either save a draft of your
            proposal to complete the form at a later time, or you can complete the form now to submit your proposal immediately.
          </p>
          <p className="pf-text">
            Need help? <Link href="/content/code-with-us-proposal-guide">Read the guide</Link> to learn how to create and manage a
            Code With Us proposal.
          </p>
        </>
      }
      summary={createSummary(opportunity)}
      initial={blankValues()}
      organizations={organizations}
      accepting={isAcceptingProposals(opportunity, new Date())}
      refusalTitle="Your proposal was not created"
      onSend={async (action, submission) => {
        if (action === "submit") {
          // Submitting records the acceptance of the service's terms (R-2.3).
          const accepted = await changeOwnAccount(account.id, "acceptTerms");
          if (accepted.kind !== "saved") return { kind: "failed" };
        }
        return createCwuProposal(opportunity.id, submission, action === "submit" ? "SUBMITTED" : "DRAFT");
      }}
      onSaved={(proposal, action) => {
        void navigate({
          to: "/opportunities/code-with-us/$opportunityId/proposals/$proposalId/edit",
          params: { opportunityId: opportunity.id, proposalId: proposal.id },
          // The manage page says the draft was saved, as the create page's draft-saved story does.
          state: { proposalSaved: action === "submit" ? "submitted" : "draft" } as never,
        });
      }}
      onCancel={() => {
        void navigate({ to: "/opportunities/code-with-us/$opportunityId", params: { opportunityId: opportunity.id } });
      }}
    />
  );
}
