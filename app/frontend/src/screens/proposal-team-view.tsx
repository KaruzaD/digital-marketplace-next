import { useEffect, useState } from "react";
import { Button, ButtonGroup, InlineAlert, Link, Text } from "@bcgov/design-system-react-components";
import { useSearch } from "@tanstack/react-router";
import type { TeamProgram } from "@rules/team-proposals";
import { Scoresheet, offeredTeamEvaluationActions } from "@rules/proposal-evaluation";
import { proposalStatusLabel } from "@rules/proposals";
import { STAGE_SCORES, StageOffers, StageScoreTag, WRONG_STAGE, hasReachedStage, offeredStageActions } from "@rules/team-evaluation";
import { statusLabel, type OpportunityStatus } from "@rules/opportunities";
import type { Account } from "../api/accounts";
import { OtherProgramOpportunity, fetchOtherProgramOpportunity } from "../api/other-programs";
import { TeamProposal, TeamProposalSaveAnswer, changeTeamProposal, fetchTeamProposal } from "../api/team-proposals";
import { NotFound } from "../app/not-found";
import { Actions, DataTable, Details, PageTitle, Region, Waiting, type Detail } from "../app/opportunity-kit";
import { AlertTitle, Focused, ProposalHead, ProposalPage, ProposalTabs, type ProposalTab } from "../app/proposal-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { momentLabel } from "./opportunity-parts";
import { ProposalHistory } from "./proposal-cwu-edit";
import { EvaluationActions, EvaluationAnswer, ScoreDialog } from "./proposal-evaluation-actions";
import { TeamProposalDetails } from "./proposal-team-edit";

/**
 * A Sprint With Us or Team With Us proposal, read-only, at
 * `/opportunities/<program>/:opportunityId/proposals/:proposalId` (proposal-swu-view,
 * proposal-twu-view), drawn as its stories draw it: the head with the proponent as the H1 and the
 * status label, the details, the Scores region, the printable-copy link, the action bar, the tabs
 * (`?tab=…`) — the proposal, its answers to the questions, each stage after the questions (the code
 * challenge and team scenario, or the challenge), and its history — then the tab's region.
 *
 * Whoever may read the proposal sees it, and the service decides who that is: the vendor who wrote
 * it and a vendor who owns or administers its organization (R-2.9, R-2.24); the opportunity's author
 * and administrators once the opportunity has closed, and never a draft (R-2.25). Anybody else, and
 * a proposal reached through another opportunity's address, is shown the missing page. The
 * opportunity's author and administrators enter each stage's score on that stage's tab, only once the
 * opportunity stands at the stage and the proposal is in it (R-2.28), screen a Sprint With Us proponent
 * in to or out of the team scenario, award a fully evaluated proposal and disqualify one (R-1.26,
 * R-2.34).
 */

type Tab = "proposal" | "teamQuestions" | "codeChallenge" | "teamScenario" | "resourceQuestions" | "challenge" | "history";
const TABS: Readonly<Record<TeamProgram, readonly Tab[]>> = {
  "sprint-with-us": ["proposal", "teamQuestions", "codeChallenge", "teamScenario", "history"],
  "team-with-us": ["proposal", "resourceQuestions", "challenge", "history"],
};
const TAB_NAMES: Readonly<Record<Tab, string>> = {
  proposal: "Proposal",
  teamQuestions: "Team questions",
  codeChallenge: "Code challenge",
  teamScenario: "Team scenario",
  resourceQuestions: "Resource questions",
  challenge: "Challenge",
  history: "History",
};
/** Each tab's test ID suffix (`proposal-tab-<key>`); the address keeps the service's tab name. */
const TAB_KEYS: Readonly<Record<Tab, string>> = {
  proposal: "proposal",
  teamQuestions: "team-questions",
  codeChallenge: "code-challenge",
  teamScenario: "team-scenario",
  resourceQuestions: "resource-questions",
  challenge: "challenge",
  history: "history",
};
const tabLinks = (program: TeamProgram): ProposalTab[] =>
  TABS[program].map((tab) => ({ key: TAB_KEYS[tab], label: TAB_NAMES[tab], ...(TAB_KEYS[tab] === tab ? {} : { query: tab }) }));

const TITLES: Readonly<Record<TeamProgram, string>> = {
  "sprint-with-us": "Sprint With Us proposal",
  "team-with-us": "Team With Us proposal",
};

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | { readonly kind: "found"; readonly proposal: TeamProposal; readonly opportunity: OtherProgramOpportunity };

export function ProposalTeamViewScreen({ program, opportunityId, proposalId }: { program: TeamProgram; opportunityId: string; proposalId: string }) {
  useScreenTitle(TITLES[program]);
  return (
    <RequireSignIn title={TITLES[program]} loadingLabel="Loading proposal…">
      {(account) => <ViewLoader program={program} account={account} opportunityId={opportunityId} proposalId={proposalId} />}
    </RequireSignIn>
  );
}

function ViewLoader({ program, account, opportunityId, proposalId }: { program: TeamProgram; account: Account; opportunityId: string; proposalId: string }) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  useEffect(() => {
    let current = true;
    void Promise.all([fetchTeamProposal(program, proposalId), fetchOtherProgramOpportunity(program, opportunityId)]).then(([answer, opportunity]) => {
      if (!current) return;
      setLoaded(
        answer.kind === "found" && opportunity.kind === "found"
          ? { kind: "found", proposal: answer.proposal, opportunity: opportunity.opportunity }
          : { kind: "missing" },
      );
    });
    return () => {
      current = false;
    };
  }, [program, proposalId, opportunityId]);

  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "loading") {
    return (
      <ProposalPage>
        <PageTitle>{TITLES[program]}</PageTitle>
        <Waiting label="Loading proposal" />
      </ProposalPage>
    );
  }
  // A draft is never shown to staff, whatever the service sends (R-2.25).
  if (loaded.proposal.opportunity.id !== opportunityId.toLowerCase() || (account.type !== "VENDOR" && loaded.proposal.status === "DRAFT")) return <NotFound />;
  return <View program={program} account={account} proposal={loaded.proposal} opportunity={loaded.opportunity} />;
}

/** The name the proposal is put forward under: its organization's. */
export function teamProponentName(proposal: TeamProposal): string {
  return proposal.organization?.legalName.trim() || "Proponent not named yet";
}

const scoreLabel = (value: number | null, missing: string) => (value === null ? missing : `${value}%`);

/** A place in words, as the proposal page shows its rank: "1st", "2nd", "3rd", "4th" (R-2.31). */
export function ordinal(place: number): string {
  const tens = place % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[place % 10] ?? "th";
  return `${place}${suffix}`;
}

/**
 * The proposal's scoresheet as it is read on this page (R-2.30, R-2.31, R-2.32): each stage's score,
 * the price score, the weighted total and the rank. The rank is always there, holding a place once
 * the proposal is fully evaluated and empty beside "Not yet ranked" until then.
 */
export function teamScoreDetails(program: TeamProgram, scoresheet: Scoresheet): Detail[] {
  const sprint = program === "sprint-with-us";
  return [
    { term: sprint ? "Team questions" : "Resource questions", value: scoreLabel(scoresheet.questions, "Not yet scored"), testId: "proposal-questions-score" },
    { term: sprint ? "Code challenge" : "Challenge", value: scoreLabel(scoresheet.challenge, "Not yet scored"), testId: "proposal-challenge-score" },
    ...(sprint ? [{ term: "Team scenario", value: scoreLabel(scoresheet.scenario, "Not yet scored"), testId: "proposal-scenario-score" }] : []),
    { term: "Price", value: scoreLabel(scoresheet.price, "Not yet calculated"), testId: "proposal-price-score" },
    { term: "Total", value: scoreLabel(scoresheet.total, "Not yet calculated"), testId: "proposal-total-score" },
    {
      term: "Rank",
      value: scoresheet.rank ? (
        <span data-testid="proposal-rank">{ordinal(scoresheet.rank.rank)}</span>
      ) : (
        <>
          <span data-testid="proposal-rank" />
          Not yet ranked
        </>
      ),
    },
  ];
}

function TeamScores({ program, scoresheet }: { program: TeamProgram; scoresheet: Scoresheet }) {
  return (
    <Region id="scores-heading" title="Scores">
      <Details items={teamScoreDetails(program, scoresheet)} />
      {scoresheet.total !== null || scoresheet.rank ? (
        <p className="op-note">
          {`The total combines each stage's score in the proportions the opportunity states. The price score is this proposal's share of the lowest bid still in contention.${
            scoresheet.rank ? ` The rank is among the ${scoresheet.rank.of} fully evaluated ${scoresheet.rank.of === 1 ? "proposal" : "proposals"}.` : ""
          }`}
        </p>
      ) : null}
    </Region>
  );
}

/** Which stage each stage tab is about. */
const STAGE_OF_TAB: Readonly<Partial<Record<Tab, StageScoreTag>>> = {
  codeChallenge: "scoreCodeChallenge",
  teamScenario: "scoreTeamScenario",
  challenge: "scoreChallenge",
};

/** The test ID of each stage's score button (proposal-swu-view, proposal-twu-view). */
const SCORE_TEST_IDS: Readonly<Record<StageScoreTag, string>> = {
  scoreCodeChallenge: "proposal-score-code-challenge",
  scoreTeamScenario: "proposal-score-team-scenario",
  scoreChallenge: "proposal-score-challenge",
};

const capitalized = (words: string) => `${words.charAt(0).toUpperCase()}${words.slice(1)}`;

/**
 * What a stage tab says, as the proposal and the opportunity stand (R-2.28): which stage the
 * opportunity is at, and — when the score is not offered — when this proposal can be scored.
 */
export function stageTabSentence(
  program: TeamProgram,
  stage: StageScoreTag,
  proposalStatus: string,
  opportunityStatus: string,
  offered: boolean,
): string {
  const rule = STAGE_SCORES[stage];
  const at = `This opportunity is at the ${statusLabel(opportunityStatus as OpportunityStatus, program).toLowerCase()} stage.`;
  if (offered) {
    if (stage === "scoreCodeChallenge") return "This opportunity is at the code challenge stage.";
    return `This opportunity is at the ${rule.name} stage. When the last ${rule.name} score is entered, each proposal's price score is calculated.`;
  }
  if (!hasReachedStage(opportunityStatus, rule.opportunity)) {
    return `${at} This proposal can be scored once the opportunity has reached the ${rule.name}.`;
  }
  if (opportunityStatus !== rule.opportunity) return `The ${rule.name} is over.`;
  if (rule.proposalIn.includes(proposalStatus)) return at;
  return `${at} This proposal was not carried into the ${rule.name}.`;
}

/**
 * A stage's tab: the sentence, the stage's score, and the score button in its wrapper
 * (`proposal-score-actions`), which is always there and empty when no score is offered. Screening in
 * and out of the team scenario are not score actions and sit in a group of their own.
 */
function StageTabContent({
  program,
  stage,
  proposal,
  offers,
  busy,
  onScore,
  onScreen,
}: {
  program: TeamProgram;
  stage: StageScoreTag;
  proposal: TeamProposal;
  offers: StageOffers | null;
  busy: boolean;
  onScore: (stage: StageScoreTag) => void;
  onScreen: (tag: "screenInToTeamScenario" | "screenOutFromTeamScenario") => void;
}) {
  const rule = STAGE_SCORES[stage];
  const offered = offers ? offers[stage] : false;
  const score = proposal.scoresheet ? (rule.score === "scenario" ? proposal.scoresheet.scenario : proposal.scoresheet.challenge) : null;
  const codeChallenge = stage === "scoreCodeChallenge";
  const screenedIn = ["UNDER_REVIEW_TEAM_SCENARIO", "EVALUATED_TEAM_SCENARIO"].includes(proposal.status);
  const screening = codeChallenge && offers ? { in: offers.screenIn, out: offers.screenOut } : { in: false, out: false };
  return (
    <>
      <p className="op-text">{stageTabSentence(program, stage, proposal.status, proposal.opportunity.status, offered || screening.in || screening.out)}</p>
      <Details
        items={[
          { term: `${capitalized(rule.name)} score`, value: proposal.scoresheet ? scoreLabel(score, "Not yet scored") : "Not shown" },
          ...(codeChallenge ? [{ term: "Screened in to the team scenario", value: screenedIn ? "Yes" : "No" }] : []),
        ]}
      />
      <div data-testid="proposal-score-actions">
        {offered ? (
          <Button variant="primary" isDisabled={busy} onPress={() => onScore(stage)} data-testid={SCORE_TEST_IDS[stage]}>
            {`Enter ${rule.name} score`}
          </Button>
        ) : null}
      </div>
      {screening.in || screening.out ? (
        <ButtonGroup ariaLabel={`${capitalized(rule.name)} actions`}>
          {screening.in ? (
            <Button variant="secondary" isDisabled={busy} onPress={() => onScreen("screenInToTeamScenario")} data-testid="proposal-screen-in">
              Screen in to team scenario
            </Button>
          ) : null}
          {screening.out ? (
            <Button variant="secondary" isDisabled={busy} onPress={() => onScreen("screenOutFromTeamScenario")} data-testid="proposal-screen-out">
              Screen out from team scenario
            </Button>
          ) : null}
        </ButtonGroup>
      ) : null}
    </>
  );
}

/** The proposal's answers to the opportunity's questions, each beside its question. */
function QuestionsTabContent({ program, proposal, opportunity }: { program: TeamProgram; proposal: TeamProposal; opportunity: OtherProgramOpportunity }) {
  const sprint = program === "sprint-with-us";
  const base = `/opportunities/${program}/${opportunity.id}/edit?tab=consensus`;
  return (
    <>
      <p className="op-text">
        Question scores are agreed by the evaluation panel on the opportunity's <Link href={base}>Consensus tab</Link>. Only proposals
        meeting every question's minimum score move on to the {sprint ? "code challenge" : "challenge"}.
      </p>
      <DataTable captionId="questions-caption" caption={`Responses to the ${sprint ? "team" : "resource"} questions`} columns={["Question", "Response"]}>
        {opportunity.questions.map((question, order) => (
          <tr key={order}>
            <td>{`${order + 1}. ${question.question}`}</td>
            <td>{proposal.responses.find((response) => response.order === order)?.response ?? "Not answered"}</td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}

const DONE_SCORE: Readonly<Record<StageScoreTag, string>> = {
  scoreCodeChallenge: "The code challenge score has been entered.",
  scoreTeamScenario: "The team scenario score has been entered.",
  scoreChallenge: "The challenge score has been entered.",
};

/** A stage action the service refused: at the wrong stage (R-2.28), or for another reason. Counted, so each is drawn afresh and takes focus. */
type StageRefusal = { readonly wrongStage: boolean; readonly reasons: readonly string[]; readonly attempt: number };

function View({
  program,
  account,
  proposal: initial,
  opportunity,
}: {
  program: TeamProgram;
  account: Account;
  proposal: TeamProposal;
  opportunity: OtherProgramOpportunity;
}) {
  const [proposal, setProposal] = useState(initial);
  const [done, setDone] = useState<string | null>(null);
  const [scoring, setScoring] = useState<StageScoreTag | null>(null);
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<StageRefusal | null>(null);
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const tabs = TABS[program];
  const tab: Tab = tabs.includes(search.tab as Tab) ? (search.tab as Tab) : "proposal";
  const opportunityId = proposal.opportunity.id;
  const base = `/opportunities/${program}/${opportunityId}/proposals/${proposal.id}`;
  const vendor = account.type === "VENDOR";
  // Staff manage the opportunity; a vendor reads it, and manages their proposal on its own page.
  const opportunityAddress = vendor ? `/opportunities/${program}/${opportunityId}` : `/opportunities/${program}/${opportunityId}/edit`;
  const stageOffers = vendor ? null : offeredStageActions(program, proposal.status, proposal.opportunity.status);

  /** What a stage action came back with: the proposal as it now stands, or why it was refused. */
  function settle(answer: TeamProposalSaveAnswer, text: string): void {
    if (answer.kind === "saved") {
      setProposal(answer.proposal);
      setDone(text);
      setRefusal(null);
      return;
    }
    setDone(null);
    const reasons = answer.kind === "refused" ? answer.reasons : ["The service could not do that. Try again."];
    setRefusal((previous) => ({ wrongStage: reasons.includes(WRONG_STAGE), reasons, attempt: (previous?.attempt ?? 0) + 1 }));
  }

  async function score(value: number): Promise<EvaluationAnswer<TeamProposal>> {
    if (!scoring) return { kind: "failed" };
    setBusy(true);
    const answer = await changeTeamProposal(program, proposal.id, scoring, value);
    setBusy(false);
    // A refusal about the score itself is said at the field; anything else closes the dialog.
    if (!(answer.kind === "refused" && answer.reasons.some((reason) => reason.startsWith("score: ")))) {
      settle(answer, DONE_SCORE[scoring]);
      setScoring(null);
    }
    return answer.kind === "saved" ? { kind: "saved", proposal: answer.proposal } : answer.kind === "refused" ? { kind: "refused", reasons: answer.reasons } : { kind: "failed" };
  }

  async function screen(tag: "screenInToTeamScenario" | "screenOutFromTeamScenario") {
    if (busy) return;
    setBusy(true);
    const answer = await changeTeamProposal(program, proposal.id, tag);
    setBusy(false);
    settle(
      answer,
      tag === "screenInToTeamScenario" ? "The proposal has been screened in to the team scenario." : "The proposal has been screened out of the team scenario.",
    );
  }

  const details: Detail[] = [
    { term: "Opportunity", value: <Link href={opportunityAddress}>{proposal.opportunity.title || "Untitled opportunity"}</Link> },
    ...(proposal.submittedAt && proposal.status !== "DRAFT"
      ? [{ term: "Submitted", value: momentLabel(proposal.submittedAt), testId: "proposal-submitted-at" }]
      : []),
    { term: "Proposal ID", value: proposal.id, testId: "proposal-identifier" },
  ];

  const stage = STAGE_OF_TAB[tab];
  return (
    <ProposalPage>
      <ProposalHead
        eyebrow={TITLES[program]}
        program={program}
        status={proposalStatusLabel(proposal.status)}
        title={<span data-testid="proposal-proponent-name">{teamProponentName(proposal)}</span>}
      />
      <Details items={details} />
      {/* The service sends the scoresheet to staff, and to the vendor once a decision has been made (R-2.32). */}
      {proposal.scoresheet && (!vendor || proposal.status === "AWARDED" || proposal.status === "NOT_AWARDED") ? (
        <TeamScores program={program} scoresheet={proposal.scoresheet} />
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
          offers={offeredTeamEvaluationActions(program, proposal.status, proposal.opportunity.status)}
          // Each stage's score is entered on its own tab, not here.
          change={async (tag, value) =>
            tag === "score" ? { kind: "failed" } : changeTeamProposal(program, proposal.id, tag, typeof value === "string" ? value : undefined)
          }
          onChanged={(changed, text) => {
            setProposal(changed);
            setDone(text);
          }}
        />
      ) : null}
      <div role="status">{done ? <p className="op-text">{done}</p> : null}</div>
      <ProposalTabs base={base} current={TAB_KEYS[tab]} tabs={tabLinks(program)} />
      {refusal?.wrongStage ? (
        <Focused key={refusal.attempt} testId="proposal-wrong-stage-error">
          <InlineAlert variant="danger" role="alert">
            <AlertTitle>That score was not entered</AlertTitle>
            <Text elementType="p">{WRONG_STAGE}</Text>
          </InlineAlert>
        </Focused>
      ) : null}
      {refusal && !refusal.wrongStage ? (
        <Focused key={refusal.attempt} testId="proposal-refused-message">
          <TitledAlert variant="danger" role="alert" title="That was not done">
            {refusal.reasons.map((reason) => (
              <Text elementType="p" key={reason}>
                {reason}
              </Text>
            ))}
          </TitledAlert>
        </Focused>
      ) : null}
      <Region id="tab-heading" title={TAB_NAMES[tab]}>
        {tab === "proposal" ? (
          <>
            <TeamProposalDetails program={program} proposal={proposal} opportunity={opportunity} questions={false} />
            <p className="op-note">{`The responses to the ${program === "sprint-with-us" ? "team" : "resource"} questions are on the ${TAB_NAMES[program === "sprint-with-us" ? "teamQuestions" : "resourceQuestions"]} tab.`}</p>
          </>
        ) : null}
        {tab === "teamQuestions" || tab === "resourceQuestions" ? <QuestionsTabContent program={program} proposal={proposal} opportunity={opportunity} /> : null}
        {stage ? (
          <StageTabContent
            program={program}
            stage={stage}
            proposal={proposal}
            offers={stageOffers}
            busy={busy}
            onScore={(next) => setScoring(next)}
            onScreen={(tag) => void screen(tag)}
          />
        ) : null}
        {tab === "history" ? <ProposalHistory proposal={proposal} /> : null}
      </Region>
      <ScoreDialog
        isOpen={scoring !== null}
        isSending={busy}
        onCancel={() => setScoring(null)}
        onConfirm={score}
        title={scoring ? `Enter ${STAGE_SCORES[scoring].name} score` : "Enter score"}
        label={scoring ? `${capitalized(STAGE_SCORES[scoring].name)} score (%)` : "Score (%)"}
        explanation="The score is recorded in the proposal's history."
      />
    </ProposalPage>
  );
}
