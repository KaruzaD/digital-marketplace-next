import { useEffect, useState } from "react";
import { exportedInOrder, mayReadOpportunityReport, type ExportProgram } from "@rules/exports";
import { historyEntryLabel, statusLabel } from "@rules/opportunities";
import { SERVICE_AREAS, SWU_PHASE_NAMES } from "@rules/other-program-drafts";
import { proposalStatusLabel } from "@rules/proposals";
import { Addendum, CwuOpportunity, HistoryEntry, Person, fetchCwuOpportunity } from "../api/opportunities";
import { OtherProgramOpportunity, fetchOtherProgramOpportunity } from "../api/other-programs";
import { CwuProposal, listCwuProposals } from "../api/proposals";
import { TeamProposal, listTeamProposals } from "../api/team-proposals";
import { useLoadingShown } from "../app/loading";
import { Label } from "../app/marketplace";
import { NotFound } from "../app/not-found";
import { Details, OpportunityHead, OpportunityPage, PageTitle, Panel, Region, Waiting, statusColour, type Detail } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { useSession } from "../auth/session";
import { readDate } from "../lib/dates";
import { FormattedText } from "../lib/formatted-text/formatted-text";
import { dayLabel, deadlineLabel, publishedLabel } from "./opportunity-parts";
import { proponentName } from "./proposal-cwu-view";
import { CwuExportContent, TeamExportContent } from "./proposal-export";
import { teamProponentName } from "./proposal-team-view";

/**
 * The full report of an opportunity, at `/opportunities/<program>/:opportunityId/complete`
 * (opportunity-cwu-complete, opportunity-swu-complete, opportunity-twu-complete): the
 * opportunity, its addenda, its history and every proposal put forward to it, as one continuous
 * document (R-1.40), drawn as the catalogue's stories draw it (decision record 0089).
 *
 * An administrator reads it and nobody else does, the opportunity's own author included: anybody
 * else is shown the missing page and nothing is asked of the service. It is drawn from the
 * opportunity and its proposals as the service already gives them to an administrator (decision
 * record 0066), so the proposals are listed once the opportunity has closed and the report says so
 * before then.
 */

const TITLES: Readonly<Record<ExportProgram, string>> = {
  "code-with-us": "Code With Us opportunity report",
  "sprint-with-us": "Sprint With Us opportunity report",
  "team-with-us": "Team With Us opportunity report",
};

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | { readonly kind: "cwu"; readonly opportunity: CwuOpportunity; readonly proposals: readonly CwuProposal[] | null }
  | { readonly kind: "team"; readonly opportunity: OtherProgramOpportunity; readonly proposals: readonly TeamProposal[] | null };

const dollars = (amount: number) => `$${Math.round(amount).toLocaleString("en-CA")}`;
const dayOf = (iso: string) => readDate(iso)?.label ?? "";
const areaName = (key: string) => {
  const name = SERVICE_AREAS.find((area) => area.key === key)?.name ?? key;
  return name.charAt(0) + name.slice(1).toLowerCase();
};

/** A score as the report says it, to two places: "91.50%", or "not scored". */
export function reportScore(value: number | null | undefined): string {
  return typeof value === "number" ? `${value.toFixed(2)}%` : "not scored";
}

export function OpportunityReportScreen({ program, opportunityId }: { program: ExportProgram; opportunityId: string }) {
  const title = TITLES[program];
  useScreenTitle(title);
  const session = useSession();
  const loadingShown = useLoadingShown(session.status === "starting");
  if (session.status === "starting") return loadingShown ? <LoadingReport title={title} /> : null;
  if (session.status !== "signed-in" || !mayReadOpportunityReport(session.account)) return <NotFound />;
  return <ReportLoader program={program} opportunityId={opportunityId} title={title} />;
}

function LoadingReport({ title }: { title: string }) {
  return (
    <OpportunityPage>
      <PageTitle>{title}</PageTitle>
      <Waiting label="Loading report" />
    </OpportunityPage>
  );
}

function ReportLoader({ program, opportunityId, title }: { program: ExportProgram; opportunityId: string; title: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  useEffect(() => {
    let current = true;
    const settle = (next: Loaded) => {
      if (current) setLoaded(next);
    };
    if (program === "code-with-us") {
      void Promise.all([fetchCwuOpportunity(opportunityId), listCwuProposals(opportunityId)]).then(([opportunity, listed]) =>
        settle(opportunity.kind === "found" ? { kind: "cwu", opportunity: opportunity.opportunity, proposals: listed.kind === "listed" ? listed.proposals : null } : { kind: "missing" }),
      );
    } else {
      void Promise.all([fetchOtherProgramOpportunity(program, opportunityId), listTeamProposals(program, opportunityId)]).then(([opportunity, listed]) =>
        settle(opportunity.kind === "found" ? { kind: "team", opportunity: opportunity.opportunity, proposals: listed.kind === "listed" ? listed.proposals : null } : { kind: "missing" }),
      );
    }
    return () => {
      current = false;
    };
  }, [program, opportunityId]);

  const loadingShown = useLoadingShown(loaded.kind === "loading");
  if (loaded.kind === "loading") return loadingShown ? <LoadingReport title={title} /> : null;
  if (loaded.kind === "missing") return <NotFound />;
  return <Report program={program} loaded={loaded} title={title} />;
}

function Report({ program, loaded, title }: { program: ExportProgram; loaded: Extract<Loaded, { kind: "cwu" | "team" }>; title: string }) {
  const { opportunity } = loaded;
  const createdBy: Person | null | undefined = opportunity.createdBy;
  const status = statusLabel(opportunity.status, program);
  const facts: Detail[] = [
    { term: "Status", value: <Label colour={statusColour(status)}>{status}</Label> },
    loaded.kind === "cwu"
      ? { term: "Reward", value: dollars(loaded.opportunity.reward) }
      : { term: loaded.opportunity.value.term, value: dollars(loaded.opportunity.value.amount) },
    { term: "Proposal deadline", value: deadlineLabel(opportunity.proposalDeadline) },
    { term: "Published", value: publishedLabel(opportunity.publishedAt) },
    ...(createdBy ? [{ term: "Created by", value: createdBy.name }] : []),
  ];
  return (
    <OpportunityPage>
      <OpportunityHead eyebrow={title} program={program} status={status} title={opportunity.title || "Untitled opportunity"} titleId="report-title" />
      <article className="op-region" aria-labelledby="report-title" data-testid="opportunity-full-report">
        <Region id="report-opportunity" title="Opportunity">
          <Details items={facts} />
          {loaded.kind === "team" ? <TeamTerms opportunity={loaded.opportunity} /> : null}
          <FormattedText markup={opportunity.description} />
        </Region>
        <AddendaSection addenda={opportunity.addenda} />
        <HistorySection history={opportunity.history ?? []} />
        <Region id="report-proposals" title="Proposals">
          {loaded.kind === "cwu" ? <CwuProposals proposals={loaded.proposals} /> : <TeamProposals opportunity={loaded.opportunity} proposals={loaded.proposals} />}
        </Region>
      </article>
    </OpportunityPage>
  );
}

/** A Sprint With Us opportunity's phases, or a Team With Us one's resources and dates, and the scoring weights. */
function TeamTerms({ opportunity }: { opportunity: OtherProgramOpportunity }) {
  const sprint = opportunity.program === "sprint-with-us";
  const weight = (key: string) => `${opportunity.weights[key] ?? 0}%`;
  return (
    <>
      {sprint ? (
        <p className="op-text">
          {`Phases: ${
            opportunity.phases.length === 0
              ? "none entered"
              : opportunity.phases.map((phase) => `${SWU_PHASE_NAMES[phase.phase].toLowerCase()}, ${dayLabel(phase.startDate)} to ${dayLabel(phase.completionDate)}`).join("; ")
          }.`}
        </p>
      ) : (
        <>
          <p className="op-text">
            {`Resources: ${
              opportunity.resources.length === 0
                ? "none entered"
                : opportunity.resources.map((resource) => `${areaName(resource.serviceArea)}, ${resource.targetAllocation}% of full time`).join("; ")
            }.`}
          </p>
          <p className="op-text">{`Contract from ${dayLabel(opportunity.startDate)} to ${dayLabel(opportunity.completionDate)}.`}</p>
        </>
      )}
      <p className="op-text">
        {sprint
          ? `Scoring weights: team questions ${weight("questions")}, code challenge ${weight("codeChallenge")}, team scenario ${weight("scenario")}, price ${weight("price")}.`
          : `Scoring weights: resource questions ${weight("questions")}, challenge ${weight("challenge")}, price ${weight("price")}.`}
      </p>
    </>
  );
}

function AddendaSection({ addenda }: { addenda: readonly Addendum[] }) {
  return (
    <Region id="report-addenda" title="Addenda">
      {addenda.length === 0 ? (
        <p className="op-text">No addenda were added.</p>
      ) : (
        addenda.map((addendum) => (
          <p className="op-text" key={addendum.id}>
            {`${dayOf(addendum.createdAt)}: ${addendum.description}`}
          </p>
        ))
      )}
    </Region>
  );
}

/** "December 4, 2026: Awarded, by Test Administrator", with any note after it. */
export function reportHistoryLine(entry: HistoryEntry): string {
  const by = entry.createdBy ? `, by ${entry.createdBy.name}` : "";
  const note = entry.note && entry.note.trim() !== "" ? ` ${entry.note.trim()}` : "";
  return `${dayOf(entry.createdAt)}: ${historyEntryLabel(entry)}${by}.${note}`;
}

function HistorySection({ history }: { history: readonly HistoryEntry[] }) {
  return (
    <Region id="report-history" title="History">
      {history.length === 0 ? (
        <p className="op-text">Nothing has been recorded.</p>
      ) : (
        <ul className="op-list">
          {history.map((entry, index) => (
            <li key={`${entry.createdAt}-${index}`}>{reportHistoryLine(entry)}</li>
          ))}
        </ul>
      )}
    </Region>
  );
}

const NOT_YET_LISTED = "The proposals are listed here once the opportunity has closed.";

function CwuProposals({ proposals }: { proposals: readonly CwuProposal[] | null }) {
  if (proposals === null) return <p className="op-text">{NOT_YET_LISTED}</p>;
  const shown = exportedInOrder(proposals);
  if (shown.length === 0) return <p className="op-text">No proposals were submitted.</p>;
  return (
    <>
      {shown.map((proposal, index) => {
        const id = `report-p${index + 1}`;
        return (
          <Panel as="article" level={3} key={proposal.id} id={id} testId="report-proposal" title={proponentName(proposal)}>
            <p className="op-text">{`Status: ${proposalStatusLabel(proposal.status)}. Score: ${reportScore(proposal.score)}.`}</p>
            <CwuExportContent proposal={proposal} level={4} anonymous={false} idPrefix={id} listed />
          </Panel>
        );
      })}
    </>
  );
}

function TeamProposals({ opportunity, proposals }: { opportunity: OtherProgramOpportunity; proposals: readonly TeamProposal[] | null }) {
  if (proposals === null) return <p className="op-text">{NOT_YET_LISTED}</p>;
  const shown = exportedInOrder(proposals);
  if (shown.length === 0) return <p className="op-text">No proposals were submitted.</p>;
  return (
    <>
      {shown.map((proposal, index) => {
        const id = `report-p${index + 1}`;
        const sheet = proposal.scoresheet;
        const sprint = proposal.program === "sprint-with-us";
        const stages = sheet
          ? [
              `${sprint ? "team questions" : "resource questions"} ${reportScore(sheet.questions)}`,
              `${sprint ? "code challenge" : "challenge"} ${reportScore(sheet.challenge)}`,
              ...(sprint ? [`team scenario ${reportScore(sheet.scenario)}`] : []),
              `price ${reportScore(sheet.price)}`,
            ].join(", ")
          : null;
        return (
          <Panel as="article" level={3} key={proposal.id} id={id} testId="report-proposal" title={teamProponentName(proposal)}>
            <p className="op-text">
              {`Status: ${proposalStatusLabel(proposal.status)}. Total score: ${reportScore(sheet?.total)}.${
                proposal.anonymousProponentName ? ` Evaluated as ${proposal.anonymousProponentName}.` : ""
              }`}
            </p>
            {stages ? <p className="op-text">{`Scores: ${stages}.`}</p> : null}
            <TeamExportContent proposal={proposal} questions={opportunity.questions} level={4} idPrefix={id} />
          </Panel>
        );
      })}
    </>
  );
}
