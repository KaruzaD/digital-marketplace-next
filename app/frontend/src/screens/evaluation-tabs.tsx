import { useEffect, useState } from "react";
import { Button, Link, Text } from "@bcgov/design-system-react-components";
import {
  INCOMPLETE_EVALUATION,
  QUESTIONS_SEGMENT,
  QUESTION_NOUN,
  evaluationStatusLabel,
  hasClosedForEvaluation,
  hasReachedConsensus,
  isCompleteEvaluation,
} from "@rules/individual-evaluation";
import type { OtherProgram } from "@rules/other-program-drafts";
import type { Account } from "../api/accounts";
import { Page, fetchPage } from "../api/content";
import { Evaluation, fetchOwnEvaluations, submitEvaluations } from "../api/evaluations";
import { OtherProgramOpportunity } from "../api/other-programs";
import { EvaluationStatus, EvaluationStyles, Refusal, Rows, type Row } from "../app/evaluation-kit";
import { Actions, Waiting } from "../app/opportunity-kit";
import { TitledAlert } from "../app/titled-alert";
import { FormattedText } from "../lib/formatted-text/formatted-text";

/**
 * The evaluator's two tabs on the manage page (R-5.34): the program's evaluation instructions,
 * which are a page of the service's own prose (evaluation-instructions-swu, -twu), and their own
 * list of proponents with the one submit action (evaluation-individual-list-swu, -twu; R-5.25,
 * R-5.35). The Consensus tab is `evaluation-consensus-tab.tsx`. Both are drawn inside the manage
 * page's frame, as the evaluation kit's `InstructionsTab` and `IndividualListTab` stories draw them.
 */

/** The evaluation instructions page of each program, which an administrator maintains. */
export const INSTRUCTIONS_PAGE: Readonly<Record<OtherProgram, string>> = {
  "sprint-with-us": "sprint-with-us-evaluation-instructions",
  "team-with-us": "team-with-us-evaluation-instructions",
};

/** The instructions, read from their own address; while they are read, or if they cannot be, the body is empty (R-7.29). */
export function InstructionsTab({ program }: { program: OtherProgram }) {
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => {
    let current = true;
    void fetchPage(INSTRUCTIONS_PAGE[program]).then((answer) => {
      if (current && answer.kind === "found") setPage(answer.page);
    });
    return () => {
      current = false;
    };
  }, [program]);
  return (
    <>
      <EvaluationStyles />
      <div className="ev-body" data-testid="evaluation-instructions-body">
        {page ? <FormattedText markup={page.body} /> : null}
      </div>
    </>
  );
}

/** Where one proponent's evaluation is: the person's own, or a new one. */
export function evaluationAddress(
  program: OtherProgram,
  opportunityId: string,
  proposalId: string,
  evaluatorId: string | null,
): string {
  const base = `/opportunities/${program}/${opportunityId}/proposals/${proposalId}/${QUESTIONS_SEGMENT[program]}/evaluations`;
  return evaluatorId ? `${base}/${evaluatorId}/edit` : `${base}/create`;
}

type Loaded = { readonly kind: "loading" } | { readonly kind: "loaded"; readonly evaluations: readonly Evaluation[] } | { readonly kind: "failed" };

/**
 * The evaluator's own list: one row per proponent by anonymous name, in that order, with the state
 * of their evaluation and a way to it (R-5.35); and, while the questions are evaluated
 * individually, the one action that submits the whole set, disabled until every proponent has a
 * complete evaluation (R-5.25, R-5.26). Submitting asks no confirmation; the sentence before the
 * button says it cannot be undone (R-5.24).
 */
export function EvaluationListTab({
  program,
  account,
  opportunity,
  onSubmitted,
}: {
  program: OtherProgram;
  account: Account;
  opportunity: OtherProgramOpportunity;
  onSubmitted: (opportunity: OtherProgramOpportunity) => void;
}) {
  const [loaded, setLoaded] = useState<Loaded>({ kind: "loading" });
  const [refusal, setRefusal] = useState<readonly string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [round, setRound] = useState(0);
  const closed = hasClosedForEvaluation(opportunity.status);

  useEffect(() => {
    if (!closed) return;
    let current = true;
    void fetchOwnEvaluations(program, opportunity.id).then((evaluations) => {
      if (current) setLoaded(evaluations ? { kind: "loaded", evaluations } : { kind: "failed" });
    });
    return () => {
      current = false;
    };
  }, [program, opportunity.id, closed, round]);

  if (!closed) {
    return (
      <p className="op-text">
        Evaluation begins once the opportunity's proposal deadline has passed. The proponents are listed here then, by their anonymous names.
      </p>
    );
  }
  if (loaded.kind === "loading") return <Waiting label="Loading your evaluations" />;
  if (loaded.kind === "failed") {
    return (
      <TitledAlert variant="danger" role="alert" title="Your evaluations could not be loaded">
        <Text elementType="p">Reload the page to try again.</Text>
      </TitledAlert>
    );
  }

  const questions = opportunity.questions;
  const proponents = opportunity.proponents ?? [];
  const individual = opportunity.status === "EVAL_QUESTIONS_INDIVIDUAL";
  const own = (proposalId: string) => loaded.evaluations.find((evaluation) => evaluation.proposal.id === proposalId) ?? null;
  const awaited = proponents.filter((proponent) => proponent.status === "UNDER_REVIEW_QUESTIONS");
  const submitted = awaited.length > 0 && awaited.every((proponent) => own(proponent.id)?.status === "SUBMITTED");
  const ready = awaited.length > 0 && awaited.every((proponent) => {
    const evaluation = own(proponent.id);
    return evaluation !== null && isCompleteEvaluation(questions, evaluation.scores);
  });

  async function submit() {
    if (busy || !ready) return;
    setBusy(true);
    const answer = await submitEvaluations(program, opportunity.id);
    setBusy(false);
    if (answer.kind === "saved") {
      setRefusal(null);
      onSubmitted(answer.opportunity);
      setRound((value) => value + 1);
      return;
    }
    setRefusal(answer.kind === "refused" ? answer.reasons : ["Your scores could not be submitted. Try again."]);
    setRound((value) => value + 1);
  }

  const rows = proponents.map((proponent): Row => {
    const evaluation = own(proponent.id);
    const editable = individual && evaluation?.status === "DRAFT";
    const action = !evaluation ? (individual ? "Start evaluation" : null) : editable ? "Continue evaluation" : "View evaluation";
    return {
      key: proponent.id,
      testId: "evaluation-proponent-row",
      cells: [
        { content: proponent.anonymousProponentName, testId: "proposal-proponent-name" },
        { content: <EvaluationStatus testId="evaluation-status">{evaluationStatusLabel(evaluation, questions)}</EvaluationStatus> },
        {
          content: action ? (
            <Link
              href={evaluationAddress(program, opportunity.id, proponent.id, evaluation ? account.id : null)}
              aria-label={`${action}: ${proponent.anonymousProponentName}`}
              data-testid="evaluation-open-proponent"
            >
              {action}
            </Link>
          ) : null,
        },
      ],
    };
  });

  return (
    <>
      <EvaluationStyles />
      {refusal ? (
        <Refusal
          key={round}
          testId={refusal.includes(INCOMPLETE_EVALUATION) ? "evaluation-incomplete-error" : undefined}
          title="Your scores were not submitted"
          description={refusal.join(" ")}
        />
      ) : null}
      <p className="op-text">
        {submitted || !individual
          ? hasReachedConsensus(opportunity.status)
            ? "Every evaluator on the panel has submitted their scores, and the consensus stage has begun. Your evaluations can be read but not changed."
            : "You have submitted your scores. The consensus stage begins when every evaluator on the panel has submitted theirs."
          : `Score every proponent's ${QUESTION_NOUN[program]}s on your own. Proponents are listed by their anonymous names. Nobody else on the panel sees your scores until the consensus stage.`}
      </p>
      <Rows
        captionId="evaluations-caption"
        caption="Your evaluations, by anonymous proponent name"
        columns={["Proponent", "Your evaluation", "Action"]}
        layout="ev-cols-3"
        unlabelled={["Action"]}
        testId="evaluation-individual-table"
        rows={rows}
      />
      {individual && !submitted ? (
        <>
          <p className="op-text" id="submit-hint">
            {ready
              ? `Every evaluation is complete. Your scores for all ${awaited.length} proponents are submitted together, and cannot be changed afterwards.`
              : "You can submit once every proponent has a complete evaluation: a score and a comment for every question. Submitted scores cannot be changed."}
          </p>
          <Actions>
            <Button
              variant="primary"
              isDisabled={!ready || busy}
              aria-describedby="submit-hint"
              onPress={() => void submit()}
              data-testid="evaluation-submit-for-consensus"
            >
              Submit scores for consensus
            </Button>
          </Actions>
        </>
      ) : null}
    </>
  );
}
