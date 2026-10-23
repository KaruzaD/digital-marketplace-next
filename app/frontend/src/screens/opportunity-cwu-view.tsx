import { ReactNode, useEffect, useRef, useState } from "react";
import { Checkbox, Link } from "@bcgov/design-system-react-components";
import { Program, mayManageOpportunity } from "@rules/opportunities";
import { listStatusWords, mayWatch } from "@rules/opportunity-list";
import { deadlineHasPassed, isAcceptingProposals } from "@rules/proposals";
import { CwuOpportunity, fetchCwuOpportunity } from "../api/opportunities";
import { listCwuProposals } from "../api/proposals";
import { countView, setWatching } from "../api/watching";
import { AttachmentList } from "../app/attachments";
import { NotFound } from "../app/not-found";
import { Actions, Details, OpportunityHead, OpportunityPage, PageTitle, Region, Waiting, type Detail } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { useSession } from "../auth/session";
import { FormattedText } from "../lib/formatted-text/formatted-text";
import { SuccessfulProponentSection, dayLabel, deadlineLabel, publishedLabel, rewardLabel } from "./opportunity-parts";
import { AddendaList } from "./opportunity-running";

/**
 * A Code With Us opportunity, at `/opportunities/code-with-us/:opportunityId` (opportunity-cwu-view).
 *
 * Anyone reads a published opportunity; a draft or one under review is the missing page to anybody
 * but its author and administrators (R-1.2). The published date is the first publication (R-1.23).
 * Who created and last changed it is shown only to an administrator and to those people, because
 * the service names them to nobody else (R-1.29). Its author and administrators are offered the way
 * to manage it.
 */
type Loaded = { readonly kind: "loading" } | { readonly kind: "missing" } | { readonly kind: "found"; readonly opportunity: CwuOpportunity };

export function OpportunityCwuViewScreen({ opportunityId }: { opportunityId: string }) {
  useScreenTitle("Code With Us opportunity");
  const session = useSession();
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const ready = session.status !== "starting";
  const viewerId = session.status === "signed-in" ? session.account.id : null;

  // Asked again whoever is signed in, since what the service names depends on who asks.
  useEffect(() => {
    if (!ready) return;
    let current = true;
    setLoaded({ kind: "loading" });
    void fetchCwuOpportunity(opportunityId).then((answer) => {
      if (!current) return;
      setLoaded(answer.kind === "found" ? { kind: "found", opportunity: answer.opportunity } : { kind: "missing" });
    });
    return () => {
      current = false;
    };
  }, [opportunityId, ready, viewerId]);

  // Opening the page is one view, however often it is read again while open (R-1.6).
  const counted = useRef(false);
  useEffect(() => {
    if (loaded.kind !== "found" || counted.current) return;
    counted.current = true;
    void countView("code-with-us", loaded.opportunity.id);
  }, [loaded]);

  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <OpportunityPage>
        <PageTitle>Code With Us opportunity</PageTitle>
        <Waiting label="Loading opportunity" />
      </OpportunityPage>
    );
  }
  const { opportunity } = loaded;
  const viewer = session.status === "signed-in" ? session.account : null;
  const now = new Date();
  const manages = mayManageOpportunity(viewer, { status: opportunity.status, createdBy: opportunity.createdBy?.id ?? null });
  const watches = mayWatch(viewer, { createdBy: opportunity.createdBy?.id ?? null });
  const proposes = viewer?.type === "VENDOR" && isAcceptingProposals(opportunity, now);
  // Staff see the stage; anyone else whether it is open, as the opportunity list says it.
  const asStaff = viewer?.type === "GOV" || viewer?.type === "ADMIN";
  return (
    <OpportunityPage>
      <OpportunityHead
        program="code-with-us"
        status={listStatusWords({ ...opportunity, program: "code-with-us" }, now, asStaff)}
        title={opportunity.title || "Untitled opportunity"}
        closes={{
          text: deadlineLabel(opportunity.proposalDeadline),
          testId: "opportunity-proposal-deadline",
          closed: opportunity.proposalDeadline !== "" && deadlineHasPassed(opportunity.proposalDeadline, now),
        }}
        value={{ label: "Reward", text: rewardLabel(opportunity.reward), testId: "opportunity-reward" }}
        location={opportunity.location}
        remoteOk={opportunity.remoteOk === true}
        summary={opportunity.teaser || undefined}
      />
      <Details items={viewDetails(opportunity)} />
      {/* The one thing the viewer can do: a vendor watches and starts a proposal, the author and
          administrators manage it, a visitor nothing. Once it is awarded, who won comes first. */}
      {opportunity.successfulProponent ? <SuccessfulProponentSection proponent={opportunity.successfulProponent} /> : null}
      {watches ? (
        <WatchControl key={opportunity.id} opportunity={opportunity}>
          {proposes ? <StartProposal key={`${opportunity.id}-${viewer.id}`} opportunityId={opportunity.id} vendorId={viewer.id} /> : null}
        </WatchControl>
      ) : null}
      {manages ? (
        <Actions>
          <Link href={`/opportunities/code-with-us/${opportunity.id}/edit`} isButton buttonVariant="secondary">
            Manage this opportunity
          </Link>
        </Actions>
      ) : null}
      <Region id="view-description" title="Description">
        <FormattedText markup={opportunity.description} />
        <AttachmentList attachments={opportunity.attachments} />
      </Region>
      <Region id="view-skills" title="Skills">
        {opportunity.skills.length > 0 ? (
          <ul className="op-list">
            {opportunity.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="op-text">No skills have been named.</p>
        )}
      </Region>
      {/* The contract records that this page shows no completion date; it is read on the manage
          page (DESIGN.md, opportunities in the chosen direction, gap 32). */}
      <Region id="view-dates" title="Key dates">
        <Details
          items={[
            { term: "Assignment date", value: dayLabel(opportunity.assignmentDate), testId: "opportunity-assignment-date" },
            { term: "Start date", value: dayLabel(opportunity.startDate), testId: "opportunity-start-date" },
          ]}
        />
      </Region>
      <Region id="view-addenda" title="Addenda" testId="opportunity-addenda">
        <AddendaList addenda={opportunity.addenda} showAuthor={false} />
      </Region>
    </OpportunityPage>
  );
}

/**
 * The facts beyond the head's: remote work, the first publication (R-1.23), who created and last
 * changed it where the service names them, which is only to its author and administrators
 * (R-1.29), and its identifier.
 */
export function viewDetails(opportunity: CwuOpportunity): Detail[] {
  return [
    {
      term: "Remote work",
      value: opportunity.remoteOk ? `Accepted. ${opportunity.remoteDesc}`.trim() : "Not accepted.",
    },
    { term: "Published", value: publishedLabel(opportunity.publishedAt), testId: "opportunity-published-date" },
    ...(opportunity.createdBy ? [{ term: "Created by", value: opportunity.createdBy.name, testId: "opportunity-created-by" }] : []),
    ...(opportunity.updatedBy
      ? [{ term: "Last changed by", value: opportunity.updatedBy.name, testId: "opportunity-last-changed-by" }]
      : []),
    { term: "Opportunity ID", value: opportunity.id, testId: "opportunity-identifier" },
  ];
}

/**
 * Start a proposal (`opportunity-start-proposal`), for a vendor while the opportunity accepts
 * proposals. A vendor who already holds one is taken to it instead of a new one (R-2.2).
 */
function StartProposal({ opportunityId, vendorId }: { opportunityId: string; vendorId: string }) {
  const [held, setHeld] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    void listCwuProposals(opportunityId).then((answer) => {
      const mine = answer.kind === "listed" ? answer.proposals.find((proposal) => proposal.createdBy?.id === vendorId) : undefined;
      if (current && mine) setHeld(mine.id);
    });
    return () => {
      current = false;
    };
  }, [opportunityId, vendorId]);
  const base = `/opportunities/code-with-us/${opportunityId}/proposals`;
  return (
    <Actions>
      <Link
        href={held ? `${base}/${held}/edit` : `${base}/create`}
        isButton
        buttonVariant="primary"
        data-testid="opportunity-start-proposal"
      >
        {held ? "View your proposal" : "Start a proposal"}
      </Link>
    </Actions>
  );
}

/**
 * Watching the opportunity, for anyone signed in who did not create it (R-1.5). Ticking or
 * unticking saves at once, and the change is announced; a refusal puts the box back. Its region
 * also holds what else the viewer can do there, such as Start a proposal.
 */
export function WatchControl({
  opportunity,
  program = "code-with-us",
  children,
}: {
  opportunity: { readonly id: string; readonly subscribed: boolean };
  program?: Program;
  children?: ReactNode;
}) {
  const [watching, setWatched] = useState(opportunity.subscribed);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function change(value: boolean) {
    setWatched(value);
    setSaving(true);
    setStatus(null);
    const saved = await setWatching(program, opportunity.id, value);
    setSaving(false);
    if (!saved) {
      setWatched(!value);
      setStatus("Your choice could not be saved. Please try again.");
      return;
    }
    setStatus(
      value
        ? "You are watching this opportunity. You will be emailed whenever it changes."
        : "You are no longer watching this opportunity.",
    );
  }

  return (
    <div className="op-region">
      <p className="op-note">Watching sends you an email whenever this opportunity changes.</p>
      <Checkbox
        isSelected={watching}
        onChange={(value) => (saving ? undefined : void change(value))}
        data-testid="opportunity-watch-toggle"
      >
        Watch this opportunity
      </Checkbox>
      <div role="status">{status ? <p className="op-text">{status}</p> : null}</div>
      {children}
    </div>
  );
}
