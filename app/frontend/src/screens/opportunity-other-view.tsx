import { useEffect, useRef, useState } from "react";
import { InlineAlert, Link } from "@bcgov/design-system-react-components";
import { mayManageOpportunity } from "@rules/opportunities";
import { deadlineHasPassed, isAcceptingProposals } from "@rules/proposals";
import { listStatusWords, mayWatch } from "@rules/opportunity-list";
import { OtherProgram, SERVICE_AREAS, SWU_PHASE_NAMES } from "@rules/other-program-drafts";
import { Page, fetchPage } from "../api/content";
import { OtherProgramOpportunity, fetchOtherProgramOpportunity } from "../api/other-programs";
import { listTeamProposals } from "../api/team-proposals";
import { countView } from "../api/watching";
import { AttachmentList } from "../app/attachments";
import { NotFound } from "../app/not-found";
import { Actions, Details, OpportunityHead, OpportunityPage, PageTitle, Region, Waiting, type Detail } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { useSession } from "../auth/session";
import { FormattedText } from "../lib/formatted-text/formatted-text";
import { WatchControl } from "./opportunity-cwu-view";
import { SuccessfulProponentSection, dayLabel, deadlineLabel, publishedLabel } from "./opportunity-parts";
import { AddendaList } from "./opportunity-running";

/**
 * A Sprint With Us or Team With Us opportunity, at `/opportunities/sprint-with-us/:opportunityId`
 * and `/opportunities/team-with-us/:opportunityId` (opportunity-swu-view, opportunity-twu-view),
 * drawn as the catalogue's `OpportunityViewPage` draws it: the page's own messages (Sprint With
 * Us), the head with its facts in the fixed order, the details, the one thing the viewer can do,
 * the successful proponent once awarded, then the sections.
 *
 * Anyone reads a published opportunity; a draft or one under review is the missing page to anybody
 * but its author and administrators (R-1.2). Opening it counts a view (R-1.6). Who created and last
 * changed it is shown only as the service names them (R-1.29). It shows only its own program's
 * content (R-1.8): Sprint With Us its phases and skills, Team With Us its resources and contract
 * dates.
 *
 * Each embeds a page of the service's own prose — Sprint With Us the scope of its opportunities,
 * Team With Us the program's terms — rendered by the one formatted-text renderer the page's own
 * address uses, so it reads identically in both places and markup in it is never run (R-7.17). A
 * page that cannot be read leaves its section empty, says nothing about why, and the rest of the
 * opportunity is shown in full (R-7.29).
 */

interface Embedded {
  /** The address of the page the screen embeds. */
  readonly slug: string;
  readonly heading: string;
  readonly testId: string;
}

const EMBEDDED: Readonly<Record<OtherProgram, Embedded>> = {
  "sprint-with-us": { slug: "sprint-with-us-opportunity-scope", heading: "Scope", testId: "opportunity-scope" },
  "team-with-us": { slug: "team-with-us-terms-and-conditions", heading: "Terms and Conditions", testId: "opportunity-terms" },
};

const TITLES: Readonly<Record<OtherProgram, string>> = {
  "sprint-with-us": "Sprint With Us opportunity",
  "team-with-us": "Team With Us opportunity",
};

type Loaded = { readonly kind: "loading" } | { readonly kind: "missing" } | { readonly kind: "found"; readonly opportunity: OtherProgramOpportunity };

const dollars = (amount: number) => (amount > 0 ? `$${amount.toLocaleString("en-CA")}` : "Not entered");
const areaName = (key: string) => SERVICE_AREAS.find((area) => area.key === key)?.name ?? key;

/**
 * The notices a Sprint With Us opportunity raises above itself, in the catalogue's words (DESIGN.md
 * gap 30): to a visitor while it accepts proposals, and once it is awarded. The surface's two other
 * cases — a vendor who has already proposed, a vendor whose organizations do not qualify — have no
 * wording anywhere, so they raise nothing.
 */
export function sprintNotices(opportunity: Pick<OtherProgramOpportunity, "status" | "proposalDeadline">, signedIn: boolean, now: Date): string[] {
  if (opportunity.status === "AWARDED") return ["This opportunity has been awarded."];
  if (!signedIn && isAcceptingProposals(opportunity, now)) return ["Sign in as a vendor to submit a proposal to this opportunity."];
  return [];
}

export function OpportunityOtherViewScreen({ program, opportunityId }: { program: OtherProgram; opportunityId: string }) {
  useScreenTitle(TITLES[program]);
  const session = useSession();
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const ready = session.status !== "starting";
  const viewerId = session.status === "signed-in" ? session.account.id : null;

  // Asked again whoever is signed in, since what the service names depends on who asks.
  useEffect(() => {
    if (!ready) return;
    let current = true;
    setLoaded({ kind: "loading" });
    void fetchOtherProgramOpportunity(program, opportunityId).then((answer) => {
      if (current) setLoaded(answer.kind === "found" ? answer : { kind: "missing" });
    });
    return () => {
      current = false;
    };
  }, [program, opportunityId, ready, viewerId]);

  // Opening the page is one view, however often it is read again while open (R-1.6).
  const counted = useRef(false);
  useEffect(() => {
    if (loaded.kind !== "found" || counted.current) return;
    counted.current = true;
    void countView(program, loaded.opportunity.id);
  }, [loaded, program]);

  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <OpportunityPage>
        <PageTitle>{TITLES[program]}</PageTitle>
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
  const sprint = program === "sprint-with-us";
  return (
    <OpportunityPage>
      {sprint ? (
        // Always present, so the page's own messages are read from one place, and empty when there are none.
        <div data-testid="opportunity-page-messages">
          {sprintNotices(opportunity, viewer !== null, now).map((notice) => (
            <InlineAlert key={notice} variant="info" title={notice} />
          ))}
        </div>
      ) : null}
      <OpportunityHead
        program={program}
        status={listStatusWords({ ...opportunity, program }, now, asStaff)}
        title={opportunity.title || "Untitled opportunity"}
        closes={{
          text: deadlineLabel(opportunity.proposalDeadline),
          testId: "opportunity-proposal-deadline",
          closed: opportunity.proposalDeadline !== "" && deadlineHasPassed(opportunity.proposalDeadline, now),
        }}
        value={{
          label: opportunity.value.term,
          text: dollars(opportunity.value.amount),
          testId: sprint ? "opportunity-total-max-budget" : "opportunity-max-budget",
        }}
        location={opportunity.location}
        remoteOk={opportunity.remoteOk === true}
        summary={opportunity.teaser || undefined}
      />
      <Details items={viewDetails(opportunity)} />
      {/* The one thing the viewer can do: a vendor watches and starts a proposal, the author and
          administrators manage it, a visitor nothing. Once it is awarded, who won comes first. */}
      {opportunity.successfulProponent ? <SuccessfulProponentSection proponent={opportunity.successfulProponent} /> : null}
      {watches ? (
        <WatchControl key={opportunity.id} opportunity={opportunity} program={program}>
          {proposes ? (
            <StartTeamProposal key={`${opportunity.id}-${viewer.id}`} program={program} opportunityId={opportunity.id} vendorId={viewer.id} />
          ) : null}
        </WatchControl>
      ) : null}
      {manages ? (
        <Actions>
          <Link href={`/opportunities/${program}/${opportunity.id}/edit`} isButton buttonVariant="secondary">
            Manage this opportunity
          </Link>
        </Actions>
      ) : null}
      <Region id="view-description" title="Description">
        <FormattedText markup={opportunity.description} />
        <AttachmentList attachments={opportunity.attachments} />
      </Region>
      {sprint ? (
        <>
          <Region id="view-phases" title="Phases" testId="opportunity-phases">
            <ul className="op-list">
              {opportunity.phases.map((phase) => (
                <li key={phase.phase}>{`${SWU_PHASE_NAMES[phase.phase]} phase: ${dayLabel(phase.startDate)} to ${dayLabel(phase.completionDate)}`}</li>
              ))}
            </ul>
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
          <EmbeddedPage embedded={EMBEDDED[program]} />
        </>
      ) : (
        <Region id="view-resources" title="Resources" testId="opportunity-resources">
          {opportunity.resources.length > 0 ? (
            <ul className="op-list">
              {opportunity.resources.map((resource, index) => (
                <li key={index}>{`${areaName(resource.serviceArea)}: ${resource.targetAllocation}% of full time`}</li>
              ))}
            </ul>
          ) : (
            <p className="op-text">No resources have been named.</p>
          )}
        </Region>
      )}
      {/* Sprint With Us shows the assignment date only; its other dates are its phases'. */}
      <Region id="view-dates" title="Key dates">
        <Details items={keyDates(opportunity, program)} />
      </Region>
      <Region id="view-addenda" title="Addenda" testId="opportunity-addenda">
        <AddendaList addenda={opportunity.addenda} showAuthor={false} />
      </Region>
      {sprint ? null : <EmbeddedPage embedded={EMBEDDED[program]} />}
    </OpportunityPage>
  );
}

/**
 * The facts beyond the head's: remote work, the first publication (R-1.23), who created and last
 * changed it where the service names them (R-1.29), and its identifier.
 */
export function viewDetails(opportunity: OtherProgramOpportunity): Detail[] {
  return [
    { term: "Remote work", value: opportunity.remoteOk ? `Accepted. ${opportunity.remoteDesc}`.trim() : "Not accepted." },
    { term: "Published", value: publishedLabel(opportunity.publishedAt), testId: "opportunity-published-date" },
    ...(opportunity.createdBy ? [{ term: "Created by", value: opportunity.createdBy.name, testId: "opportunity-created-by" }] : []),
    ...(opportunity.updatedBy
      ? [{ term: "Last changed by", value: opportunity.updatedBy.name, testId: "opportunity-last-changed-by" }]
      : []),
    { term: "Opportunity ID", value: opportunity.id, testId: "opportunity-identifier" },
  ];
}

/** The dates the program's view shows, each with the test ID it is read by; a missing completion date is left out. */
export function keyDates(opportunity: OtherProgramOpportunity, program: OtherProgram): Detail[] {
  const assignment = { term: "Assignment date", value: dayLabel(opportunity.assignmentDate), testId: "opportunity-assignment-date" };
  if (program === "sprint-with-us") return [assignment];
  return [
    assignment,
    { term: "Start date", value: dayLabel(opportunity.startDate), testId: "opportunity-start-date" },
    ...(opportunity.completionDate
      ? [{ term: "Completion date", value: dayLabel(opportunity.completionDate), testId: "opportunity-completion-date" }]
      : []),
  ];
}

/**
 * Start a proposal (`opportunity-start-proposal`), for a vendor while the opportunity accepts
 * proposals. A vendor who already holds one is taken to it instead of a new one (R-2.2).
 */
function StartTeamProposal({ program, opportunityId, vendorId }: { program: OtherProgram; opportunityId: string; vendorId: string }) {
  const [held, setHeld] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    void listTeamProposals(program, opportunityId).then((answer) => {
      const mine = answer.kind === "listed" ? answer.proposals.find((proposal) => proposal.createdBy?.id === vendorId) : undefined;
      if (current && mine) setHeld(mine.id);
    });
    return () => {
      current = false;
    };
  }, [program, opportunityId, vendorId]);
  const base = `/opportunities/${program}/${opportunityId}/proposals`;
  return (
    <Actions>
      <Link href={held ? `${base}/${held}/edit` : `${base}/create`} isButton buttonVariant="primary" data-testid="opportunity-start-proposal">
        {held ? "View your proposal" : "Start a proposal"}
      </Link>
    </Actions>
  );
}

/**
 * Another page's body, read from its own address and rendered as it is there (R-7.17). The
 * wrapper carrying the test ID is always present; while the page is being read, and if it cannot be
 * read at all, it holds nothing and says nothing (R-7.29).
 */
export function EmbeddedPage({ embedded }: { embedded: Embedded }) {
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => {
    let current = true;
    void fetchPage(embedded.slug).then((answer) => {
      if (current && answer.kind === "found") setPage(answer.page);
    });
    return () => {
      current = false;
    };
  }, [embedded.slug]);
  return (
    <div data-testid={embedded.testId}>
      {page ? (
        <Region id={`${embedded.testId}-heading`} title={embedded.heading}>
          <FormattedText markup={page.body} testId={`${embedded.testId}-body`} />
        </Region>
      ) : null}
    </div>
  );
}
