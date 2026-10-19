import { useEffect, useState } from "react";
import { Link, Text } from "@bcgov/design-system-react-components";
import type { OtherProgram } from "@rules/other-program-drafts";
import { proposalStatusLabel } from "@rules/proposals";
import { hasReachedStage } from "@rules/team-evaluation";
import { TeamProposal, listTeamProposals } from "../api/team-proposals";
import { DataTable, Waiting } from "../app/opportunity-kit";
import { ProposalStatus } from "../app/proposal-kit";
import { TitledAlert } from "../app/titled-alert";
import { teamProponentName } from "./proposal-team-view";

/**
 * The Code challenge and Team scenario tabs of a Sprint With Us opportunity's manage page, and the
 * Challenge tab of a Team With Us one (`?tab=codeChallenge`, `?tab=teamScenario`, `?tab=challenge`):
 * the proponents carried into the stage, each with its score there, each opening on its read-only
 * page where the score is entered (R-2.28). Before the opportunity reaches the stage the tab says so.
 */

export type StageTabName = "codeChallenge" | "teamScenario" | "challenge";

interface StageOfTab {
  readonly opportunity: string;
  readonly name: string;
  readonly statuses: readonly string[];
  readonly score: (proposal: TeamProposal) => number | null;
}

const STAGES: Readonly<Record<StageTabName, StageOfTab>> = {
  codeChallenge: {
    opportunity: "EVAL_CC",
    name: "code challenge",
    statuses: ["UNDER_REVIEW_CODE_CHALLENGE", "EVALUATED_CODE_CHALLENGE", "UNDER_REVIEW_TEAM_SCENARIO", "EVALUATED_TEAM_SCENARIO"],
    score: (proposal) => proposal.scoresheet?.challenge ?? null,
  },
  teamScenario: {
    opportunity: "EVAL_SCENARIO",
    name: "team scenario",
    statuses: ["UNDER_REVIEW_TEAM_SCENARIO", "EVALUATED_TEAM_SCENARIO"],
    score: (proposal) => proposal.scoresheet?.scenario ?? null,
  },
  challenge: {
    opportunity: "EVAL_C",
    name: "challenge",
    statuses: ["UNDER_REVIEW_CHALLENGE", "EVALUATED_CHALLENGE"],
    score: (proposal) => proposal.scoresheet?.challenge ?? null,
  },
};

/** What the tab says about the stage, as the opportunity stands (R-1.42). */
export function stageTabWords(tab: StageTabName, opportunityStatus: string): string {
  const stage = STAGES[tab];
  if (!hasReachedStage(opportunityStatus, stage.opportunity)) {
    return `This opportunity has not reached the ${stage.name} yet. Proponents can be scored on it once it does.`;
  }
  if (opportunityStatus !== stage.opportunity) return `The ${stage.name} is over. Its scores are kept below.`;
  if (tab === "codeChallenge") {
    return "This opportunity is at the code challenge stage. Enter each proponent's score on its proposal, and screen in to the team scenario those who go on. The team scenario can start once every proponent in the code challenge has been scored or disqualified and at least one remains screened in.";
  }
  return `This opportunity is at the ${stage.name} stage. Enter each proponent's score on its proposal. When the last ${stage.name} score is entered, each proposal's price score is calculated and the opportunity moves to processing.`;
}

/** Who has reached the stage: carried into it, or holding its score. */
export function inStage(tab: StageTabName, proposals: readonly TeamProposal[]): TeamProposal[] {
  const stage = STAGES[tab];
  return proposals.filter((proposal) => stage.statuses.includes(proposal.status) || stage.score(proposal) !== null);
}

type Listed = { readonly kind: "loading" } | { readonly kind: "listed"; readonly proposals: readonly TeamProposal[] } | { readonly kind: "failed" };

export function StageTab({
  program,
  tab,
  opportunity,
}: {
  program: OtherProgram;
  tab: StageTabName;
  opportunity: { readonly id: string; readonly status: string };
}) {
  const [listed, setListed] = useState<Listed>({ kind: "loading" });
  const reached = hasReachedStage(opportunity.status, STAGES[tab].opportunity);
  useEffect(() => {
    if (!reached) return;
    let current = true;
    void listTeamProposals(program, opportunity.id).then((answer) => {
      if (current) setListed(answer.kind === "listed" ? { kind: "listed", proposals: answer.proposals } : { kind: "failed" });
    });
    return () => {
      current = false;
    };
  }, [program, opportunity.id, opportunity.status, reached]);

  const words = <p className="op-text">{stageTabWords(tab, opportunity.status)}</p>;
  if (!reached) return words;
  if (listed.kind === "loading") return <Waiting label="Loading proponents" />;
  if (listed.kind === "failed") {
    return (
      <TitledAlert variant="danger" role="alert" title="The proponents could not be loaded">
        <Text elementType="p">Reload the page to try again.</Text>
      </TitledAlert>
    );
  }
  const shown = inStage(tab, listed.proposals);
  const stage = STAGES[tab];
  return (
    <>
      {words}
      {shown.length === 0 ? (
        <p className="op-text">{`No proponent was carried into the ${stage.name}.`}</p>
      ) : (
        <DataTable
          captionId="stage-caption"
          caption={`Proponents in the ${stage.name}, with their scores`}
          columns={["Proponent", "Status", "Score"]}
          testId="opportunity-stage-table"
        >
          {shown.map((proposal) => {
            const score = stage.score(proposal);
            return (
              <tr key={proposal.id} data-testid="opportunity-stage-row">
                <td>
                  <Link href={`/opportunities/${program}/${opportunity.id}/proposals/${proposal.id}?tab=${tab}`}>{teamProponentName(proposal)}</Link>
                </td>
                <td>
                  <ProposalStatus bare>{proposalStatusLabel(proposal.status)}</ProposalStatus>
                </td>
                <td>{score === null ? "Not yet scored" : `${score}%`}</td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </>
  );
}
