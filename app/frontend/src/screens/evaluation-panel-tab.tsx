import { useState } from "react";
import { Button, ButtonGroup, Checkbox, Form, Select } from "@bcgov/design-system-react-components";
import { PANEL_NO_CHAIR, PANEL_TOO_SMALL, otherProblemFromLine, panelMayChange, panelRoleLabel } from "@rules/other-program-content";
import type { OtherProgram } from "@rules/other-program-drafts";
import type { OpportunityStatus } from "@rules/opportunities";
import { OtherProgramSaveAnswer, PanelCandidate, PanelEntry, PanelMember, candidateChoiceLabel } from "../api/other-programs";
import { ErrorSummary, EvaluationStyles, GroupError, Notice, Rows } from "../app/evaluation-kit";
import { Actions } from "../app/opportunity-kit";

/**
 * The Evaluation panel tab of a Sprint With Us or Team With Us opportunity's manage page
 * (evaluation-panel-swu, evaluation-panel-twu), offered to its author and administrators only
 * (R-5.18), drawn as the catalogue's `PanelTab` draws it.
 *
 * It opens read-only: the panel as it stands, one row per member with their role, and — while the
 * panel may still change (R-1.43, R-5.16) — Edit evaluation panel. Editing shows one row per
 * evaluator, named with their email address, each with a Chair tick and Remove; a person is chosen
 * in "Public sector employee to add" and added with Add an evaluator, as an evaluator and not the
 * chair. The Chair field may name someone who chairs without evaluating — one fact shown in two
 * places, so the panel never holds two chairs. Saving checks, in this order, that the panel has at
 * least two members, names nobody twice and has a chair (R-5.1, R-5.9); the service checks again,
 * including that everyone named is a public sector employee, and a panel it refuses is not saved
 * (R-5.37). A saved panel returns the tab to read-only. From the consensus stage the panel is fixed
 * and listed, with a notice and nothing to change it with.
 */

const PROGRAM_STEPS: Readonly<Record<OtherProgram, string>> = {
  "sprint-with-us": "team questions",
  "team-with-us": "resource questions",
};

/** One problem with the panel: what the summary says, where it links, and the test id it carries. */
interface PanelProblem {
  readonly text: string;
  readonly target: string;
  readonly testId?: string;
  /** The evaluator row it belongs to, from 1, or "chair", or "group". */
  readonly at: number | "chair" | "group";
  readonly fieldMessage: string;
}

/** The panel as it is sent: each evaluator, and a chair who does not evaluate after them. */
export function panelEntriesOf(evaluators: readonly string[], chair: string): PanelEntry[] {
  const entries = evaluators.map((user) => ({ user, evaluator: true, chair: user !== "" && user === chair }));
  if (chair !== "" && !evaluators.includes(chair)) entries.push({ user: chair, evaluator: false, chair: true });
  return entries;
}

/** What the form checks before sending: at least two members, nobody twice, a chair (design order). */
export function panelFormProblems(evaluators: readonly string[], chair: string, nameOf: (id: string) => string): PanelProblem[] {
  const problems: PanelProblem[] = [];
  const members = panelEntriesOf(evaluators, chair);
  if (members.length < 2) {
    problems.push({
      text: "Evaluation panel: name at least two members",
      target: "panel-minimum-error",
      testId: "evaluation-panel-minimum-error",
      at: "group",
      fieldMessage: "The panel needs at least two members. Add another evaluator.",
    });
  }
  const seen = new Set<string>();
  evaluators.forEach((user, index) => {
    const number = index + 1;
    if (user === "") {
      problems.push({
        text: `Evaluator ${number}: choose a public sector employee`,
        target: `panel-member-${number}`,
        at: number,
        fieldMessage: "Choose a public sector employee.",
      });
      return;
    }
    if (seen.has(user)) {
      problems.push({
        text: `Evaluator ${number}: ${nameOf(user)} is already on the panel`,
        target: `panel-member-${number}`,
        testId: "evaluation-panel-duplicate-error",
        at: number,
        fieldMessage: `${nameOf(user)} is already on the panel. Choose a different person.`,
      });
    }
    seen.add(user);
  });
  if (chair === "") {
    problems.push({
      text: "Chair: choose a chair for the panel",
      target: "panel-chair",
      testId: "evaluation-panel-missing-chair-error",
      at: "chair",
      fieldMessage: PANEL_NO_CHAIR,
    });
  }
  return problems;
}

/** The service's refusal of a panel, placed where the form shows each problem. */
export function panelRefusalProblems(reasons: readonly string[], evaluatorCount: number): { problems: PanelProblem[]; rest: string[] } {
  const problems: PanelProblem[] = [];
  const rest: string[] = [];
  for (const reason of reasons) {
    const problem = otherProblemFromLine(reason);
    if (!problem || problem.field !== "evaluationPanel") {
      rest.push(reason);
      continue;
    }
    const message = problem.message;
    const member = /^Panel member (\d+): (.*)$/s.exec(message);
    if (member) {
      const place = Number(member[1]);
      const said = member[2] as string;
      const row = place <= evaluatorCount ? place : null;
      const testId = said.includes("is not a public sector employee")
        ? "evaluation-panel-not-public-sector-error"
        : said.includes("is already on the panel")
          ? "evaluation-panel-duplicate-error"
          : undefined;
      problems.push({
        text: row ? `Evaluator ${row}: ${said.replace(/\.$/, "")}` : `Chair: ${said.replace(/\.$/, "")}`,
        target: row ? `panel-member-${row}` : "panel-chair",
        testId,
        at: row ?? "chair",
        fieldMessage: said,
      });
    } else if (message === PANEL_TOO_SMALL) {
      problems.push({
        text: "Evaluation panel: name at least two members",
        target: "panel-minimum-error",
        testId: "evaluation-panel-minimum-error",
        at: "group",
        fieldMessage: "The panel needs at least two members. Add another evaluator.",
      });
    } else if (message === PANEL_NO_CHAIR) {
      problems.push({
        text: "Chair: choose a chair for the panel",
        target: "panel-chair",
        testId: "evaluation-panel-missing-chair-error",
        at: "chair",
        fieldMessage: PANEL_NO_CHAIR,
      });
    } else {
      problems.push({ text: `Evaluation panel: ${message.replace(/\.$/, "")}`, target: "panel-chair", at: "group", fieldMessage: message });
    }
  }
  return { problems, rest };
}

export function EvaluationPanelTab({
  program,
  status,
  panel,
  candidates,
  onSave,
}: {
  readonly program: OtherProgram;
  readonly status: OpportunityStatus;
  readonly panel: readonly PanelMember[];
  readonly candidates: readonly PanelCandidate[];
  readonly onSave: (panel: readonly PanelEntry[]) => Promise<OtherProgramSaveAnswer>;
}) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const changeable = panelMayChange(status);
  const people = peopleOf(candidates, panel);

  if (!changeable) {
    return (
      <>
        <EvaluationStyles />
        <Notice
          testId="evaluation-panel-locked-message"
          title="The evaluation panel can no longer be changed"
          description="The consensus stage has begun, so the panel is fixed."
        />
        <PanelMembers panel={panel} />
      </>
    );
  }
  return (
    <>
      <EvaluationStyles />
      <p className="op-text">
        {`Once the opportunity closes, each evaluator scores every proponent's ${PROGRAM_STEPS[program]} on their own. The chair then records one agreed score for each proponent.`}
      </p>
      <p className="op-text">
        The panel needs at least two members, each a public sector employee named once, and one chair. The chair can be one of the
        evaluators, or someone who chairs without evaluating. The panel can be changed until the consensus stage begins. People you add
        are told when you save, unless the opportunity is still a draft.
      </p>
      <div role="status">{saved ? <p className="op-text">{PANEL_SAVED}</p> : null}</div>
      {editing ? (
        <PanelForm
          panel={panel}
          people={people}
          onSave={async (entries) => {
            const answer = await onSave(entries);
            if (answer.kind === "saved") {
              setEditing(false);
              setSaved(true);
            }
            return answer;
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <PanelMembers panel={panel} />
          <Actions>
            <Button
              variant="secondary"
              onPress={() => {
                setSaved(false);
                setEditing(true);
              }}
              data-testid="evaluation-panel-edit"
            >
              Edit evaluation panel
            </Button>
          </Actions>
        </>
      )}
    </>
  );
}

/**
 * What the tab says once a panel is saved. Saving publishes a new version of the opportunity, which
 * the original screen confirmed in these words (evaluation-panel-swu's note; DESIGN.md gap 67).
 */
export const PANEL_SAVED = "Opportunity Changes Published. The evaluation panel has been saved.";

/** Someone the tab can name: the person's name and, where known, their email address. */
interface Named {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

/**
 * Everyone the tab may name, in the list's order: each candidate, then anybody on the panel the
 * list no longer names, by the name the panel holds, so nobody already seated is lost.
 */
export function peopleOf(candidates: readonly PanelCandidate[], panel: readonly PanelMember[]): Named[] {
  const listed = candidates.map((candidate) => ({ id: candidate.id, name: candidate.label, email: candidate.email }));
  const missing = panel
    .filter((member) => !candidates.some((candidate) => candidate.id === member.user.id))
    .map((member) => ({ id: member.user.id, name: member.user.name, email: "" }));
  return [...listed, ...missing];
}

/** The panel as it stands, read-only: one row per member with their role. */
function PanelMembers({ panel }: { panel: readonly PanelMember[] }) {
  return (
    <Rows
      captionId="panel-caption"
      caption="Members of the evaluation panel"
      columns={["Name", "Role"]}
      layout="ev-cols-2"
      rows={panel.map((member) => ({
        key: member.user.id,
        testId: "evaluation-panel-member-row",
        cells: [{ content: member.user.name }, { content: panelRoleLabel(member) }],
      }))}
    />
  );
}

function PanelForm({
  panel,
  people,
  onSave,
  onCancel,
}: {
  readonly panel: readonly PanelMember[];
  readonly people: readonly Named[];
  readonly onSave: (panel: readonly PanelEntry[]) => Promise<OtherProgramSaveAnswer>;
  readonly onCancel: () => void;
}) {
  const [evaluators, setEvaluators] = useState<readonly string[]>(() =>
    panel.filter((member) => member.evaluator).map((member) => member.user.id),
  );
  const [chair, setChair] = useState(() => panel.find((member) => member.chair)?.user.id ?? "");
  const [choice, setChoice] = useState("");
  const [problems, setProblems] = useState<readonly PanelProblem[]>([]);
  const [refusal, setRefusal] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  // Counts the attempts to save, so the summary is drawn afresh, and takes focus, after each one.
  const [attempt, setAttempt] = useState(0);

  // Everyone is offered by name and email address; a duplicate is refused on save (DESIGN.md gap 68).
  const items = people.map((person) => ({ id: person.id, label: candidateChoiceLabel({ label: person.name, email: person.email }) }));
  const personOf = (id: string) => people.find((person) => person.id === id);
  const nameOf = (id: string) => personOf(id)?.name ?? "This person";
  const problemAt = (at: PanelProblem["at"]) =>
    problems
      .filter((problem) => problem.at === at)
      .map((problem) => problem.fieldMessage)
      .join(" ");

  async function save() {
    if (sending) return;
    setAttempt((count) => count + 1);
    setRefusal(null);
    const found = panelFormProblems(evaluators, chair, nameOf);
    setProblems(found);
    if (found.length > 0) return;
    setSending(true);
    const answer = await onSave(panelEntriesOf(evaluators, chair));
    setSending(false);
    if (answer.kind === "saved") return;
    if (answer.kind === "refused") {
      const placed = panelRefusalProblems(answer.reasons, evaluators.length);
      setProblems(placed.problems);
      if (placed.rest.length > 0) setRefusal(placed.rest.join(" "));
      return;
    }
    setRefusal("The service could not save the panel. Try again.");
  }

  /** Seats the person chosen to add, as an evaluator and not the chair. */
  function add() {
    if (choice === "") return;
    setEvaluators((current) => [...current, choice]);
    setChoice("");
  }

  const count = problems.length;
  return (
    <>
      {count > 0 || refusal ? (
        <ErrorSummary
          key={attempt}
          title={count > 0 ? `The evaluation panel has ${count} ${count === 1 ? "problem" : "problems"}` : "The evaluation panel was not saved"}
          lead={
            <>
              <p>The panel was not saved. It is still the panel it was before.</p>
              {refusal ? <p>{refusal}</p> : null}
            </>
          }
          problems={problems.map((problem) => ({ href: `#${problem.target}`, testId: problem.testId, text: problem.text }))}
        />
      ) : null}
      <Form
        validationBehavior="aria"
        className="op-region"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {evaluators.map((user, index) => {
          const number = index + 1;
          const problem = problemAt(number);
          const person = personOf(user);
          return (
            <fieldset key={index} className="ev-member" id={`panel-member-${number}`} data-testid="evaluation-panel-member-row">
              <legend>{`Evaluator ${number}`}</legend>
              <div className="ev-member-body">
                <p className="ev-member-name">
                  {person?.name ?? "This person"}
                  {person?.email ? <span className="ev-member-email">{` (${person.email})`}</span> : null}
                </p>
                <Checkbox
                  isSelected={user === chair}
                  onChange={(ticked) => setChair(ticked ? user : "")}
                  aria-label={`Chair: evaluator ${number}`}
                  data-testid="evaluation-panel-member-chair"
                >
                  Chair
                </Checkbox>
                <Button
                  variant="tertiary"
                  size="small"
                  aria-label={`Remove evaluator ${number}`}
                  onPress={() => {
                    if (user === chair && evaluators.filter((entry) => entry === user).length === 1) setChair("");
                    setEvaluators((current) => current.filter((_, at) => at !== index));
                  }}
                  data-testid="evaluation-panel-remove-member"
                >
                  Remove
                </Button>
              </div>
              {problem ? <GroupError>{problem}</GroupError> : null}
            </fieldset>
          );
        })}
        {problemAt("group") ? <GroupError id="panel-minimum-error">{problemAt("group")}</GroupError> : null}
        <div className="ev-cluster">
          <Select
            label="Public sector employee to add"
            items={items}
            value={choice === "" ? null : choice}
            onChange={(key) => setChoice(key === null ? "" : String(key))}
            data-testid="evaluation-panel-member-choice"
          />
          <Button variant="secondary" onPress={add} data-testid="evaluation-panel-add-member">
            Add an evaluator
          </Button>
        </div>
        <Select
          id="panel-chair"
          label="Chair"
          items={items}
          isRequired
          description="Choose one of the evaluators above, or a public sector employee who will chair without evaluating. Ticking Chair against an evaluator chooses them here too."
          value={chair === "" ? null : chair}
          onChange={(key) => setChair(key === null ? "" : String(key))}
          isInvalid={problemAt("chair") !== ""}
          errorMessage={problemAt("chair") || undefined}
          data-testid="evaluation-panel-chair-field"
        />
        <ButtonGroup ariaLabel="Evaluation panel actions">
          <Button type="submit" variant="primary" isDisabled={sending} data-testid="evaluation-panel-save">
            Save evaluation panel
          </Button>
          <Button variant="secondary" isDisabled={sending} onPress={onCancel} data-testid="evaluation-panel-cancel">
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
}
