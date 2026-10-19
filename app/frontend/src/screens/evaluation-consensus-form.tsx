import { FormEvent, useEffect, useRef, useState } from "react";
import { Button, Form, InlineAlert, NumberField, Text, TextArea } from "@bcgov/design-system-react-components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { consensusProblems, consensusStatusLabel, mayReadConsensus, mayRecordConsensus } from "@rules/consensus";
import { EnteredScore, hasReachedConsensus, isChairOf, isOnPanel } from "@rules/individual-evaluation";
import type { OtherProgram } from "@rules/other-program-drafts";
import type { Account } from "../api/accounts";
import {
  Consensus,
  Evaluation,
  EvaluationSaveAnswer,
  fetchConsensus,
  fetchConsensuses,
  fetchProposalEvaluations,
  saveConsensus,
  startConsensus,
} from "../api/evaluations";
import { OtherProgramOpportunity, Proponent, StoredQuestion, fetchOtherProgramOpportunity } from "../api/other-programs";
import {
  ErrorSummary,
  EvaluationStyles,
  Notice,
  PanelScores,
  QuestionBox,
  Refusal,
  Response,
  SaveRow,
  ScoringHead,
  type PanelScore,
} from "../app/evaluation-kit";
import { NotFound } from "../app/not-found";
import { Details, OpportunityPage, PageTitle, Panel, Waiting } from "../app/opportunity-kit";
import { RequireSignIn } from "../app/require-sign-in";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { consensusAddress } from "./evaluation-consensus-tab";
import { BackLink, Entry, PROGRAM_WORDS, entriesFrom, placeFacts, placeOf, summaryLine, typedScore } from "./evaluation-individual-form";
import { evaluatedFrom } from "./opportunity-other-manage";

/**
 * One proponent's consensus (evaluation-consensus-create-swu, -twu and evaluation-consensus-edit-swu,
 * -twu; decision record 0063): the chair records one agreed score and comment per question, with
 * every evaluator's own score and comment beside their name under each question (R-5.28, R-5.29).
 * A save keeps what is on the screen and lists what would stop the set being submitted; a submitted
 * consensus stays open to change until it is finalized (R-5.30). A panel member who is not the chair
 * reads the evaluators' scores and is told only the chair records the consensus. Anybody else, and
 * anybody at all before the consensus stage, is shown the missing page.
 *
 * Each is drawn as the evaluation kit's `ConsensusCreate` and `ConsensusEdit` stories draw it: the
 * scoring head, the way back, the alerts, then one question box per question with the evaluators'
 * scores as rows, or, where nothing can be changed, one panel per question.
 */

const createTitle = (program: OtherProgram) => `Agree a ${PROGRAM_WORDS[program]} consensus`;
const editTitle = (program: OtherProgram) => `${PROGRAM_WORDS[program]} consensus`;

export function ConsensusScreen({
  program,
  opportunityId,
  proposalId,
  chairId,
}: {
  program: OtherProgram;
  opportunityId: string;
  proposalId: string;
  /** The chair whose consensus this is; null on the page that starts one. */
  chairId: string | null;
}) {
  const title = chairId ? editTitle(program) : createTitle(program);
  useScreenTitle(title);
  return (
    <RequireSignIn title={title} loadingLabel="Loading the evaluators' scores…">
      {(account) => (
        <ConsensusLoader
          key={`${proposalId}/${chairId ?? "new"}`}
          program={program}
          account={account}
          opportunityId={opportunityId}
          proposalId={proposalId}
          chairId={chairId}
        />
      )}
    </RequireSignIn>
  );
}

type Loaded =
  | { readonly kind: "loading" }
  | { readonly kind: "missing" }
  | { readonly kind: "failed" }
  | {
      readonly kind: "found";
      readonly opportunity: OtherProgramOpportunity;
      readonly proponent: Proponent;
      readonly consensus: Consensus | null;
      readonly evaluations: readonly Evaluation[];
      /** Every consensus on the opportunity, so moving on opens the next one's own. */
      readonly consensuses: readonly Consensus[];
    };

function ConsensusLoader({
  program,
  account,
  opportunityId,
  proposalId,
  chairId,
}: {
  program: OtherProgram;
  account: Account;
  opportunityId: string;
  proposalId: string;
  chairId: string | null;
}) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });

  useEffect(() => {
    let current = true;
    void (async (): Promise<Loaded> => {
      const found = await fetchOtherProgramOpportunity(program, opportunityId);
      if (found.kind !== "found") return { kind: "missing" };
      const opportunity = found.opportunity;
      const proponent = opportunity.proponents?.find((entry) => entry.id === proposalId.toLowerCase());
      if (!proponent) return { kind: "missing" };
      const evaluated = evaluatedFrom(opportunity);
      const onPanel = isOnPanel(account, evaluated) && hasReachedConsensus(opportunity.status);
      if (!chairId) {
        // Starting one: the chair at the consensus stage records; the rest of the panel reads (R-5.28, R-5.29).
        const records = mayRecordConsensus(account, evaluated) && proponent.status === "UNDER_REVIEW_QUESTIONS";
        if (!records && !onPanel) return { kind: "missing" };
      } else if (!mayReadConsensus(account, evaluated)) {
        return { kind: "missing" };
      }
      const [answer, evaluations, list] = await Promise.all([
        chairId ? fetchConsensus(program, proponent.id, chairId.toLowerCase()) : Promise.resolve(null),
        onPanel ? fetchProposalEvaluations(program, proponent.id) : Promise.resolve([] as Evaluation[]),
        fetchConsensuses(program, opportunity.id),
      ]);
      if (answer?.kind === "missing") return { kind: "missing" };
      if (answer?.kind === "failed" || evaluations === null) return { kind: "failed" };
      return {
        kind: "found",
        opportunity,
        proponent,
        consensus: answer?.kind === "found" ? answer.evaluation : null,
        evaluations,
        consensuses: list.kind === "found" ? list.consensuses : [],
      };
    })().then((next) => {
      if (current) setLoaded(next);
    });
    return () => {
      current = false;
    };
  }, [program, account, opportunityId, proposalId, chairId]);

  if (loaded.kind === "loading") {
    return (
      <OpportunityPage>
        <PageTitle>{chairId ? editTitle(program) : createTitle(program)}</PageTitle>
        <Waiting label="Loading the evaluators' scores" />
      </OpportunityPage>
    );
  }
  if (loaded.kind === "missing") return <NotFound />;
  if (loaded.kind === "failed") {
    return (
      <OpportunityPage>
        <PageTitle>{chairId ? editTitle(program) : createTitle(program)}</PageTitle>
        <TitledAlert variant="danger" role="alert" title="This consensus could not be loaded">
          <Text elementType="p">Reload the page to try again.</Text>
        </TitledAlert>
      </OpportunityPage>
    );
  }
  const { opportunity, consensus } = loaded;
  const records = mayRecordConsensus(account, evaluatedFrom(opportunity));
  const editable = records && (consensus === null ? chairId === null : consensus.evaluator.id === account.id);
  return editable ? <ConsensusForm program={program} account={account} {...loaded} /> : <ConsensusShown program={program} account={account} {...loaded} />;
}

const listAddress = (program: OtherProgram, opportunityId: string) => `/opportunities/${program}/${opportunityId}/edit?tab=consensus`;

/** Every evaluator's score and comment for one question, as the kit's panel scores take them (R-5.28). */
export function panelScoresFor(order: number, question: StoredQuestion, evaluations: readonly Evaluation[]): PanelScore[] {
  return evaluations.map((evaluation) => {
    const entry = evaluation.scores.find((score) => score.order === order);
    return {
      key: evaluation.evaluator.id,
      who: evaluation.evaluator.name,
      score: typeof entry?.score === "number" ? `${entry.score} out of ${question.score}` : "Not entered",
      notes: entry?.notes ? entry.notes : "Not entered",
    };
  });
}

function Worth({ question }: { question: StoredQuestion }) {
  return (
    <p className="op-note">
      Worth up to {question.score} points.
      {question.minimumScore !== null ? ` The minimum score to move on is ${question.minimumScore}.` : ""}
    </p>
  );
}

interface ShownProps {
  readonly program: OtherProgram;
  readonly account: Account;
  readonly opportunity: OtherProgramOpportunity;
  readonly proponent: Proponent;
  readonly consensus: Consensus | null;
  readonly evaluations: readonly Evaluation[];
  readonly consensuses: readonly Consensus[];
}

function ConsensusForm({ program, opportunity, proponent, consensus, evaluations, consensuses }: ShownProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const questions = opportunity.questions;
  const [entries, setEntries] = useState<Entry[]>(() => entriesFrom(questions, consensus));
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const arrivedSaved = search.saved === "draft" || search.saved === "changes";
  const [checked, setChecked] = useState(arrivedSaved);
  const [notice, setNotice] = useState<"saved" | null>(arrivedSaved ? "saved" : null);
  const [refusal, setRefusal] = useState<EvaluationSaveAnswer | null>(null);
  const [busy, setBusy] = useState(false);
  // Counts the answered saves, so an alert still showing after another save is drawn afresh and takes focus again.
  const [answered, setAnswered] = useState(0);
  const scoreRefs = useRef<(HTMLDivElement | null)[]>([]);
  const editing = consensus !== null;
  // Moving on goes through the proponents still to be agreed, in anonymous order.
  const place = placeOf({ ...opportunity, proponents: (opportunity.proponents ?? []).filter((entry) => entry.status === "UNDER_REVIEW_QUESTIONS") }, proponent);

  const current = (): EnteredScore[] =>
    entries.map((entry, order) => ({ order, score: typedScore(scoreRefs.current[order] ?? null, entry.score), notes: entry.notes }));
  const problems = consensusProblems(questions, current());
  const shownProblems = problems.filter((problem) => checked || touched.has(`${problem.field}-${problem.order}`));

  function setEntry(order: number, change: Partial<Entry>) {
    setEntries((all) => all.map((entry, index) => (index === order ? { ...entry, ...change } : entry)));
    setNotice(null);
  }

  /** Moves to an address given whole; the router is told its path and its query apart. */
  function go(address: string, replace = false) {
    const url = new URL(address, "http://this.app");
    void navigate({ to: url.pathname as never, search: Object.fromEntries(url.searchParams.entries()) as never, replace });
  }

  async function save(then: "stay" | "next") {
    if (busy) return;
    setBusy(true);
    setRefusal(null);
    const scores = current();
    const answer = editing ? await saveConsensus(program, proponent.id, consensus.evaluator.id, scores) : await startConsensus(program, proponent.id, scores);
    setBusy(false);
    if (answer.kind !== "saved") {
      setRefusal(answer);
      setAnswered((count) => count + 1);
      return;
    }
    if (then === "stay") {
      if (!editing) {
        go(`${consensusAddress(program, opportunity.id, proponent.id, answer.evaluation.evaluator.id)}?saved=draft`, true);
        return;
      }
      setAnswered((count) => count + 1);
      setChecked(true);
      setNotice("saved");
      return;
    }
    const next = place.next;
    const held = next ? consensuses.find((entry) => entry.proposal.id === next.id) : undefined;
    go(next ? consensusAddress(program, opportunity.id, next.id, held ? held.evaluator.id : null) : listAddress(program, opportunity.id));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save("next");
  }

  const held = consensuses.find((entry) => entry.proposal.id === proponent.id);

  return (
    <OpportunityPage>
      <EvaluationStyles />
      <ScoringHead
        eyebrow={editing ? editTitle(program) : createTitle(program)}
        program={program}
        status={editing ? consensusStatusLabel({ status: consensus.status, scores: current() }, questions) : undefined}
        statusTestId="evaluation-consensus-status"
        name={proponent.anonymousProponentName}
        facts={placeFacts(opportunity, proponent)}
      />
      <BackLink href={listAddress(program, opportunity.id)}>Back to the consensus</BackLink>
      {consensus?.status === "SUBMITTED" ? (
        <Notice
          testId="evaluation-editable-notice"
          title="This consensus has been submitted"
          description="You can still change it until the consensus scores are finalized. If you change it, submit the final consensus scores again."
        />
      ) : null}
      {editing ? null : (
        <p className="op-text">
          Record the score and comment the panel agreed for each question. Each evaluator's own score and comment is shown with the question. A
          consensus is checked when you submit the final consensus scores.
        </p>
      )}
      {refusal?.kind === "duplicate" ? (
        <>
          <Refusal key={answered} testId="evaluation-duplicate-consensus-error" title="This consensus was not started" description={refusal.reason} />
          {held ? (
            <BackLink href={consensusAddress(program, opportunity.id, proponent.id, held.evaluator.id)}>
              Go to the consensus for {proponent.anonymousProponentName}
            </BackLink>
          ) : null}
        </>
      ) : refusal ? (
        <Refusal
          key={answered}
          title="This consensus was not saved"
          description={refusal.kind === "refused" ? refusal.reasons.join(" ") : "The service could not save it. Try again."}
        />
      ) : checked && problems.length > 0 ? (
        <ErrorSummary
          key={answered}
          title={`This consensus has ${problems.length} ${problems.length === 1 ? "problem" : "problems"}`}
          lead={
            <p>
              {editing ? "Your changes were saved as you entered them." : "Your draft was saved as you entered it."} The consensus scores cannot be
              submitted until these are fixed.
            </p>
          }
          problems={problems.map((problem) => ({
            href: `#question-${problem.order + 1}-${problem.field}`,
            testId: problem.field === "score" ? "evaluation-score-error" : "evaluation-notes-error",
            text: summaryLine(problem),
          }))}
        />
      ) : notice === "saved" ? (
        <div role="status" className="ev-alert">
          <InlineAlert variant="success" title="Saved" description="The consensus has been saved." />
        </div>
      ) : null}
      <Form validationBehavior="aria" className="op-region" onSubmit={onSubmit}>
        {questions.map((question, order) => {
          const n = order + 1;
          const scoreProblem = shownProblems.find((problem) => problem.order === order && problem.field === "score");
          const notesProblem = shownProblems.find((problem) => problem.order === order && problem.field === "notes");
          return (
            <QuestionBox key={order} n={n}>
              <p className="op-text">{question.question}</p>
              <Worth question={question} />
              {editing ? null : (
                <Response name={proponent.anonymousProponentName}>{proponent.responses.find((entry) => entry.order === order)?.response ?? ""}</Response>
              )}
              <PanelScores n={n} scores={panelScoresFor(order, question, evaluations)} />
              <div
                ref={(element) => {
                  scoreRefs.current[order] = element;
                }}
              >
                <NumberField
                  id={`question-${n}-score`}
                  label={`Agreed score for question ${n}`}
                  isRequired
                  description={`Between 0 and ${question.score}, with up to two decimal places.`}
                  value={entries[order]?.score ?? Number.NaN}
                  formatOptions={{ maximumFractionDigits: 20, useGrouping: false }}
                  onChange={(value) => setEntry(order, { score: value })}
                  onBlur={() => setTouched((all) => new Set(all).add(`score-${order}`))}
                  isInvalid={scoreProblem !== undefined}
                  errorMessage={scoreProblem?.message}
                  data-testid="evaluation-question-score-field"
                />
              </div>
              <TextArea
                id={`question-${n}-notes`}
                label={`Agreed comment for question ${n}`}
                isRequired
                description="At least one word, explaining the score."
                value={entries[order]?.notes ?? ""}
                onChange={(value) => setEntry(order, { notes: value })}
                onBlur={() => setTouched((all) => new Set(all).add(`notes-${order}`))}
                isInvalid={notesProblem !== undefined}
                errorMessage={notesProblem?.message}
                data-testid="evaluation-question-notes-field"
              />
            </QuestionBox>
          );
        })}
        <SaveRow label="Consensus actions">
          <Button
            variant="secondary"
            isDisabled={busy}
            onPress={() => void save("stay")}
            data-testid={editing ? "evaluation-save-changes" : "evaluation-save-draft"}
          >
            {editing ? "Save changes" : "Save draft"}
          </Button>
          <Button type="submit" variant="primary" isDisabled={busy} data-testid="evaluation-save-next">
            Save and go to next proponent
          </Button>
        </SaveRow>
      </Form>
    </OpportunityPage>
  );
}

/**
 * The evaluators' scores, and the consensus if there is one, shown and not offered for change: to a
 * panel member who is not the chair (R-5.28, R-5.29), and to anyone who may read the consensus once
 * the chair may no longer change it.
 */
function ConsensusShown({ program, account, opportunity, proponent, consensus, evaluations }: ShownProps) {
  const questions = opportunity.questions;
  const evaluated = evaluatedFrom(opportunity);
  const atConsensus = opportunity.status === "EVAL_QUESTIONS_CONSENSUS";
  const chairOnly = atConsensus && isOnPanel(account, evaluated) && !isChairOf(account, evaluated);
  const evaluator = evaluations.some((evaluation) => evaluation.evaluator.id === account.id);
  const backToEvaluations = evaluator && !consensus;
  return (
    <OpportunityPage>
      <EvaluationStyles />
      <ScoringHead
        eyebrow={consensus ? editTitle(program) : createTitle(program)}
        program={program}
        status={consensus ? consensusStatusLabel(consensus, questions) : undefined}
        statusTestId="evaluation-consensus-status"
        name={proponent.anonymousProponentName}
        facts={placeFacts(opportunity, proponent)}
      />
      <BackLink href={`/opportunities/${program}/${opportunity.id}/edit?tab=${backToEvaluations ? "evaluation" : "consensus"}`}>
        {backToEvaluations ? "Back to your evaluations" : "Back to the consensus"}
      </BackLink>
      {chairOnly ? (
        <Notice
          testId="evaluation-chair-only-message"
          title="Only the chair records the consensus"
          description="You can read each evaluator's scores and comments for this proponent. The panel's chair records the agreed score."
        />
      ) : !atConsensus ? (
        <Notice title="The consensus scores have been finalized" description="The agreed scores can be read but no longer changed." />
      ) : null}
      {questions.map((question, order) => {
        const agreed = consensus?.scores.find((entry) => entry.order === order);
        return (
          <Panel key={order} id={`question-${order + 1}-heading`} title={`Question ${order + 1}`}>
            <p className="op-text">{question.question}</p>
            <PanelScores n={order + 1} scores={panelScoresFor(order, question, evaluations)} />
            {consensus ? (
              <Details
                items={[
                  { term: "Agreed score", value: typeof agreed?.score === "number" ? `${agreed.score} out of ${question.score}` : "Not entered" },
                  { term: "Agreed comment", value: agreed?.notes ? agreed.notes : "Not entered" },
                ]}
              />
            ) : null}
          </Panel>
        );
      })}
    </OpportunityPage>
  );
}
