import type { ReactNode } from "react";
import {
  AlertDialog,
  Button,
  Checkbox,
  Form,
  InlineAlert,
  Link,
  Modal,
  NumberField,
  Select,
  Text,
  TextArea,
} from "@bcgov/design-system-react-components";
import { Label } from "./marketplace";
import {
  ADMIN,
  Actions,
  DataTable,
  Details,
  Panel,
  PageTitle,
  Region,
  STAFF,
  SectionTitle,
  StatusLabel,
} from "./opportunity-kit";
import {
  ErrorSummary,
  EVALUATOR,
  EVALUATOR_TWO,
  EvaluationPage,
  EvaluationStatus,
  Focused,
  GroupError,
  ManageFrame,
  ME,
  Notice,
  Ordered,
  PanelScores,
  QuestionBox,
  QuestionText,
  QuestionWorth,
  Reference,
  Refusal,
  Response,
  Rows,
  SaveRow,
  ScoringHead,
  TABS,
  consensusStatus,
  individualStatus,
  manageBase,
  proposalBase,
  type EvaluationProgram,
  type Problem,
  type Row,
} from "./evaluation-kit";

// The evaluation domain's screens in the chosen direction, one component per page, drawn for both programs from the
// program's words and record text in evaluation-kit.tsx. Each story renders one of these with its state. What a state
// shows, and why, is in each story's comment and in design/DESIGN.md, "Evaluation screens in the chosen direction".

// ---------------------------------------------------------------------------------------------------------------------
// Dashboard

// The opportunities domain's own row, as its opportunity-dashboard stories draw it.
const MY_ROWS = [
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000101", program: "code-with-us", title: "Build an accessible permit tracker", programName: "Code With Us", status: "Published", updated: "September 10, 2026" },
];
// Illustrative. The draft shows that a panel member sees an opportunity before it is public (R-5.19).
const PANEL_ROWS = [
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000201", program: "sprint-with-us", title: "Modernize the licence renewal service", programName: "Sprint With Us", role: "Evaluator and chair", status: "Team questions: individual evaluation" },
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000301", program: "team-with-us", title: "Data platform team", programName: "Team With Us", role: "Evaluator", status: "Resource questions: consensus" },
  { id: "7c1e2d40-5b1a-4c2e-9d3f-000000000203", program: "sprint-with-us", title: "Digital identity pilot", programName: "Sprint With Us", role: "Evaluator", status: "Draft" },
];

// The dashboard is one page shared with the opportunities domain, so its two lists are the same DataTable the
// opportunity dashboard uses, not two different kinds of list on one screen.
export function Dashboard({ state }: { state: "default" | "empty" }) {
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      <PageTitle>Dashboard</PageTitle>
      <Actions>
        <Link href="/opportunities/create" isButton buttonVariant="primary" data-testid="dashboard-create-opportunity">
          Create an opportunity
        </Link>
      </Actions>
      <nav className="op-tabs" aria-label="Dashboard sections">
        <ul>
          <li>
            <Link href="#dashboard-mine-heading" data-testid="dashboard-show-my-opportunities">
              My opportunities
            </Link>
          </li>
          <li>
            <Link href="#dashboard-evaluations-heading" data-testid="dashboard-show-evaluations">
              Evaluations
            </Link>
          </li>
        </ul>
      </nav>
      <Region id="dashboard-mine-heading" title="My opportunities">
        {state === "default" ? (
          <DataTable
            captionId="dashboard-caption"
            caption="Opportunities you created"
            columns={["Title", "Program", "Status", "Last updated"]}
            testId="dashboard-opportunities-table"
          >
            {MY_ROWS.map((r) => (
              <tr key={r.id} data-testid="dashboard-opportunity-row">
                <td>
                  <Link href={`/opportunities/${r.program}/${r.id}/edit`} data-testid="dashboard-opportunity-link">
                    {r.title}
                  </Link>
                </td>
                <td>
                  <Label>{r.programName}</Label>
                </td>
                <td>
                  <StatusLabel>{r.status}</StatusLabel>
                </td>
                <td>{r.updated}</td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <p className="op-note">
            This section is the opportunities domain's, as in its opportunity-dashboard stories, and is trimmed here.
          </p>
        )}
      </Region>
      <Region id="dashboard-evaluations-heading" title="Evaluations">
        <p className="op-text">Opportunities whose evaluation panel you sit on, including drafts that are not yet public.</p>
        {state === "default" ? (
          <DataTable
            captionId="dashboard-panel-caption"
            caption="Opportunities you are evaluating"
            columns={["Title", "Program", "Your role", "Status"]}
            testId="dashboard-panel-opportunities-table"
          >
            {PANEL_ROWS.map((r) => (
              <tr key={r.id} data-testid="dashboard-panel-opportunity-row">
                <td>
                  <Link href={`/opportunities/${r.program}/${r.id}/edit`} data-testid="dashboard-opportunity-link">
                    {r.title}
                  </Link>
                </td>
                <td>
                  <Label>{r.programName}</Label>
                </td>
                <td>{r.role}</td>
                <td>
                  <StatusLabel>{r.status}</StatusLabel>
                </td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <p className="op-text" data-testid="dashboard-empty-panel-message">
            You are not on the evaluation panel of any opportunity. When an opportunity's owner adds you to its panel, it is
            listed here.
          </p>
        )}
      </Region>
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// Evaluation panel

// Illustrative. The list offers public sector employees only, each as their name and email address.
const PUBLIC_SERVANTS = [
  { id: "u-ps-2", label: "Test Evaluator One (evaluator.one@example.test)" },
  { id: "u-ps-3", label: "Test Evaluator Two (evaluator.two@example.test)" },
  { id: "u-ps-4", label: "Test Evaluator Three (evaluator.three@example.test)" },
  { id: "u-ps-5", label: "Test Chair (chair@example.test)" },
];

const ONE = { name: "Test Evaluator One", email: "evaluator.one@example.test" };
const TWO = { name: "Test Evaluator Two", email: "evaluator.two@example.test" };
// Illustrative. "Test Former Employee" was added while their account was a public sector employee's.
const FORMER = { name: "Test Former Employee", email: "former.employee@example.test" };

type Member = { n: number; name: string; email: string; chair: boolean; error?: string };

function PanelIntro({ p }: { p: EvaluationProgram }) {
  return (
    <>
      <p className="op-text">
        Once the opportunity closes, each evaluator scores every proponent's {p.questions} on their own. The chair then
        records one agreed score for each proponent.
      </p>
      <p className="op-text">
        The panel needs at least two members, each a public sector employee named once, and one chair. The chair can be one
        of the evaluators, or someone who chairs without evaluating. The panel can be changed until the consensus stage
        begins. People you add are told when you save, unless the opportunity is still a draft.
      </p>
    </>
  );
}

// The panel as it stands, read-only: one row per member with their role.
function PanelMembers() {
  const members = [
    { who: ONE.name, role: "Evaluator and chair" },
    { who: TWO.name, role: "Evaluator" },
  ];
  return (
    <Rows
      captionId="panel-caption"
      caption="Members of the evaluation panel"
      columns={["Name", "Role"]}
      layout="ev-cols-2"
      rows={members.map(
        (m): Row => ({ key: m.who, testId: "evaluation-panel-member-row", cells: [{ content: m.who }, { content: m.role }] }),
      )}
    />
  );
}

// The panel while it is being changed. One row per member, named with their email address: the Chair checkbox and
// Remove, each named for its row, and any problem the row has. A person is added by choosing them and pressing Add an
// evaluator; a newly added member is an evaluator and not the chair. The Chair field is the same fact as the rows'
// Chair checkboxes (design/DESIGN.md, "Domain: evaluation", "Forms and validation").
function PanelForm({
  members,
  chair,
  chairError,
  minimumError,
}: {
  members: Member[];
  chair?: string;
  chairError?: string;
  minimumError?: boolean;
}) {
  return (
    <Form validationBehavior="aria" className="op-region" onSubmit={(event) => event.preventDefault()}>
      {members.map((m) => (
        <fieldset key={m.n} className="ev-member" id={`panel-member-${m.n}`} data-testid="evaluation-panel-member-row">
          <legend>Evaluator {m.n}</legend>
          <div className="ev-member-body">
            <p className="ev-member-name">
              {m.name} <span className="ev-member-email">({m.email})</span>
            </p>
            <Checkbox defaultSelected={m.chair} aria-label={`Chair: evaluator ${m.n}`} data-testid="evaluation-panel-member-chair">
              Chair
            </Checkbox>
            <Button variant="tertiary" size="small" aria-label={`Remove evaluator ${m.n}`} data-testid="evaluation-panel-remove-member">
              Remove
            </Button>
          </div>
          {m.error ? <GroupError>{m.error}</GroupError> : null}
        </fieldset>
      ))}
      {minimumError ? (
        <GroupError id="panel-minimum-error">The panel needs at least two members. Add another evaluator.</GroupError>
      ) : null}
      <div className="ev-cluster">
        <Select label="Public sector employee to add" items={PUBLIC_SERVANTS} data-testid="evaluation-panel-member-choice" />
        <Button variant="secondary" data-testid="evaluation-panel-add-member">
          Add an evaluator
        </Button>
      </div>
      <Select
        id="panel-chair"
        label="Chair"
        items={PUBLIC_SERVANTS}
        isRequired
        description="Choose one of the evaluators above, or a public sector employee who will chair without evaluating. Ticking Chair against an evaluator chooses them here too."
        defaultValue={chair}
        isInvalid={chairError !== undefined}
        errorMessage={chairError}
        data-testid="evaluation-panel-chair-field"
      />
      <SaveRow label="Evaluation panel actions">
        <Button type="submit" variant="primary" data-testid="evaluation-panel-save">
          Save evaluation panel
        </Button>
        <Button variant="secondary" data-testid="evaluation-panel-cancel">
          Cancel
        </Button>
      </SaveRow>
    </Form>
  );
}

export type PanelState = "default" | "editing" | "invalid" | "too-few" | "refused" | "locked";

export function PanelTab({ p, state }: { p: EvaluationProgram; state: PanelState }) {
  const locked = state === "locked";
  return (
    <EvaluationPage viewer={STAFF} current="dashboard">
      <ManageFrame
        p={p}
        status={locked ? consensusStatus(p) : "Published"}
        tabs={locked ? p.stageTabs : TABS.published}
        current="evaluationPanel"
        title="Evaluation panel"
        actions={
          locked ? (
            <Button variant="primary" data-testid="finalize-consensus-button">
              Finalize consensus scores
            </Button>
          ) : (
            <>
              <Button variant="secondary" data-testid="opportunity-edit-button">
                Edit
              </Button>
              <Button variant="secondary" danger data-testid="opportunity-cancel-button">
                Cancel opportunity
              </Button>
            </>
          )
        }
      >
        {state === "default" ? (
          <>
            <PanelIntro p={p} />
            <PanelMembers />
            <Actions>
              <Button variant="secondary" data-testid="evaluation-panel-edit">
                Edit evaluation panel
              </Button>
            </Actions>
          </>
        ) : null}
        {locked ? (
          <>
            <Notice
              testId="evaluation-panel-locked-message"
              title="The evaluation panel can no longer be changed"
              description="The consensus stage has begun, so the panel is fixed."
            />
            <PanelMembers />
          </>
        ) : null}
        {state === "editing" ? (
          <>
            <PanelIntro p={p} />
            <PanelForm
              members={[
                { n: 1, ...ONE, chair: true },
                { n: 2, ...TWO, chair: false },
              ]}
              chair="u-ps-2"
            />
          </>
        ) : null}
        {state === "invalid" ? (
          <>
            <ErrorSummary
              title="The evaluation panel has 2 problems"
              lead="The panel was not saved. It is still the panel it was before."
              problems={[
                { href: "#panel-member-2", testId: "evaluation-panel-duplicate-error", text: "Evaluator 2: Test Evaluator One is already on the panel" },
                { href: "#panel-chair", testId: "evaluation-panel-missing-chair-error", text: "Chair: choose a chair for the panel" },
              ]}
            />
            <PanelIntro p={p} />
            <PanelForm
              members={[
                { n: 1, ...ONE, chair: false },
                { n: 2, ...ONE, chair: false, error: "Test Evaluator One is already on the panel. Choose a different person." },
              ]}
              chairError="Choose a chair. The panel needs one person to record the agreed scores."
            />
          </>
        ) : null}
        {state === "too-few" ? (
          <>
            <ErrorSummary
              title="The evaluation panel has 1 problem"
              lead="The panel was not saved. It is still the panel it was before."
              problems={[{ href: "#panel-minimum-error", testId: "evaluation-panel-minimum-error", text: "Evaluation panel: name at least two members" }]}
            />
            <PanelIntro p={p} />
            <PanelForm members={[{ n: 1, ...ONE, chair: true }]} chair="u-ps-2" minimumError />
          </>
        ) : null}
        {state === "refused" ? (
          <>
            <ErrorSummary
              title="The evaluation panel has 1 problem"
              lead="The panel was not saved. It is still the panel it was before."
              problems={[
                { href: "#panel-member-2", testId: "evaluation-panel-not-public-sector-error", text: "Evaluator 2: Test Former Employee is not a public sector employee" },
              ]}
            />
            <PanelIntro p={p} />
            <PanelForm
              members={[
                { n: 1, ...ONE, chair: true },
                {
                  n: 2,
                  ...FORMER,
                  chair: false,
                  error: "Test Former Employee is not a public sector employee. Only public sector employees can sit on a panel.",
                },
              ]}
              chair="u-ps-2"
            />
          </>
        ) : null}
      </ManageFrame>
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// Instructions

export function InstructionsTab({ p }: { p: EvaluationProgram }) {
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      <ManageFrame p={p} status={individualStatus(p)} tabs={TABS.evaluator} current="instructions" title="Instructions">
        <p className="op-note">
          Illustrative text. The instructions are the {p.name} evaluation instructions page of the site's content, which an
          administrator maintains. The spec does not carry their wording.
        </p>
        <div className="ev-body" data-testid="evaluation-instructions-body">
          <SectionTitle level={3}>Scoring on your own</SectionTitle>
          <p className="op-text">
            Score each proponent's response to each {p.question} on your own, without discussing it with the rest of the
            panel. Nobody else on the panel sees your scores until the consensus stage.
          </p>
          <SectionTitle level={3}>Scores and comments</SectionTitle>
          <p className="op-text">
            Give each question a score between 0 and its maximum, with up to two decimal places, and a comment that explains it.
          </p>
          <SectionTitle level={3}>Submitting</SectionTitle>
          <p className="op-text">
            When every proponent has a complete evaluation, submit your scores for consensus from the Evaluation tab. Submitted
            scores cannot be changed.
          </p>
        </div>
      </ManageFrame>
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// The evaluator's list

const NAMES = ["Proponent 1", "Proponent 2", "Proponent 3"] as const;

type ListEntry = { status: string; action: string; href: string };

function ProponentList({
  kind,
  entries,
}: {
  kind: "evaluation" | "consensus";
  entries: (ListEntry | { status: string })[];
}) {
  const evaluation = kind === "evaluation";
  const withActions = entries.some((entry) => "action" in entry);
  const columns = [
    "Proponent",
    evaluation ? "Your evaluation" : "Consensus",
    ...(withActions ? ["Action"] : []),
  ];
  return (
    <Rows
      captionId={evaluation ? "evaluations-caption" : "consensus-caption"}
      caption={evaluation ? "Your evaluations, by anonymous proponent name" : "Agreed scores, by anonymous proponent name"}
      columns={columns}
      layout={withActions ? "ev-cols-3" : "ev-cols-2"}
      unlabelled={["Action"]}
      testId={evaluation ? "evaluation-individual-table" : "evaluation-consensus-table"}
      rows={entries.map((entry, index): Row => {
        const name = NAMES[index];
        return {
          key: name,
          testId: "evaluation-proponent-row",
          cells: [
            { content: name, testId: "proposal-proponent-name" },
            {
              content: (
                <EvaluationStatus testId={evaluation ? "evaluation-status" : "evaluation-consensus-status"}>
                  {entry.status}
                </EvaluationStatus>
              ),
            },
            ...("action" in entry
              ? [
                  {
                    content: (
                      <Link
                        href={entry.href}
                        aria-label={`${entry.action}: ${name}`}
                        data-testid={evaluation ? "evaluation-open-proponent" : "evaluation-open-consensus"}
                      >
                        {entry.action}
                      </Link>
                    ),
                  },
                ]
              : []),
          ],
        };
      })}
    />
  );
}

// The sentence that says what enables a submit button, which describes it, and the button.
function SubmitBlock({ hint, label, testId, disabled }: { hint: string; label: string; testId: string; disabled: boolean }) {
  return (
    <>
      <p className="op-text" id="submit-hint">
        {hint}
      </p>
      <Actions>
        <Button variant="primary" isDisabled={disabled} aria-describedby="submit-hint" data-testid={testId}>
          {label}
        </Button>
      </Actions>
    </>
  );
}

const INDIVIDUAL_HINT =
  "You can submit once every proponent has a complete evaluation: a score and a comment for every question. Submitted scores cannot be changed.";

export type IndividualListState = "default" | "ready" | "submitted" | "refused";

export function IndividualListTab({ p, state }: { p: EvaluationProgram; state: IndividualListState }) {
  const edit = (index: 0 | 1 | 2) => `${proposalBase(p, index)}/evaluations/${ME}/edit`;
  const cont = (status: string, index: 0 | 1 | 2): ListEntry => ({ status, action: "Continue evaluation", href: edit(index) });
  const entries: Record<IndividualListState, ListEntry[]> = {
    default: [
      cont("Draft: complete", 0),
      cont("Draft: incomplete", 1),
      { status: "Not started", action: "Start evaluation", href: `${proposalBase(p, 2)}/evaluations/create` },
    ],
    ready: [cont("Draft: complete", 0), cont("Draft: complete", 1), cont("Draft: complete", 2)],
    submitted: ([0, 1, 2] as const).map((i) => ({ status: "Submitted", action: "View evaluation", href: edit(i) })),
    refused: [cont("Draft: complete", 0), cont("Draft: incomplete", 1), cont("Draft: complete", 2)],
  };
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      <ManageFrame
        p={p}
        status={individualStatus(p)}
        tabs={TABS.evaluator}
        current="evaluation"
        title="Evaluation"
        messages={
          state === "refused" ? (
            <Refusal
              testId="evaluation-incomplete-error"
              title="Your scores were not submitted"
              description="This evaluation could not be submitted for review because it is incomplete. Please edit, complete and save the appropriate form before trying to submit it again."
            />
          ) : null
        }
      >
        {state === "submitted" ? (
          <p className="op-text">
            You submitted your scores on September 16, 2026. The consensus stage begins when every evaluator on the panel has
            submitted theirs.
          </p>
        ) : (
          <p className="op-text">
            Score every proponent's {p.questions} on your own. Proponents are listed by their anonymous names. Nobody else on
            the panel sees your scores until the consensus stage.
          </p>
        )}
        <ProponentList kind="evaluation" entries={entries[state]} />
        {state === "submitted" ? null : (
          <SubmitBlock
            hint={
              state === "ready"
                ? "Every evaluation is complete. Your scores for all three proponents are submitted together, and cannot be changed afterwards."
                : INDIVIDUAL_HINT
            }
            label="Submit scores for consensus"
            testId="evaluation-submit-for-consensus"
            disabled={state !== "ready"}
          />
        )}
      </ManageFrame>
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// The consensus list

export type ConsensusListState =
  | "default"
  | "ready"
  | "submit-confirm"
  | "submitted"
  | "finalize-confirm"
  | "not-all-submitted"
  | "no-screenable"
  | "withheld";

const READY_HINT = "Every proponent has a complete consensus. When you submit, the opportunity's owner and every administrator are told.";

function FinalizeRefusal({ testId, description }: { testId: string; description: string }) {
  return (
    <Focused testId="advance-refused-message">
      <div data-testid={testId}>
        <InlineAlert variant="danger" role="alert" title="The consensus scores could not be finalized" description={description} />
      </div>
    </Focused>
  );
}

export function ConsensusListTab({ p, state }: { p: EvaluationProgram; state: ConsensusListState }) {
  const edit = (index: 0 | 1 | 2) => `${proposalBase(p, index)}/consensus/${ME}/edit`;
  const editEntry = (status: string, index: 0 | 1 | 2): ListEntry => ({ status, action: "Edit consensus", href: edit(index) });
  const asAdmin = state === "finalize-confirm" || state === "not-all-submitted" || state === "no-screenable";
  const asOwner = state === "withheld";
  const asChair = !asAdmin && !asOwner;

  const chairEntries: ListEntry[] =
    state === "default"
      ? [
          editEntry("Draft: complete", 0),
          editEntry("Draft: incomplete", 1),
          { status: "Not started", action: "Start consensus", href: `${proposalBase(p, 2)}/consensus/create` },
        ]
      : ([0, 1, 2] as const).map((i) => editEntry(state === "submitted" ? "Submitted" : "Draft: complete", i));
  const adminEntries =
    state === "not-all-submitted"
      ? [{ status: "Submitted" }, { status: "Draft: complete" }, { status: "Submitted" }]
      : [{ status: "Submitted" }, { status: "Submitted" }, { status: "Submitted" }];

  const adminActions = (
    <>
      <Button variant="secondary" data-testid="opportunity-edit-button">
        Edit
      </Button>
      <Button variant="primary" data-testid="finalize-consensus-button">
        Finalize consensus scores
      </Button>
      <Button variant="secondary" danger data-testid="opportunity-cancel-button">
        Cancel opportunity
      </Button>
    </>
  );

  let messages: ReactNode = null;
  if (state === "not-all-submitted") {
    messages = <FinalizeRefusal testId="evaluation-not-all-submitted-error" description="Not all consensuses have been submitted." />;
  } else if (state === "no-screenable") {
    messages = (
      <FinalizeRefusal
        testId="evaluation-no-screenable-error"
        description={`You must have at least one proponent that can be screened into the ${p.Next}.`}
      />
    );
  }

  return (
    <EvaluationPage viewer={asAdmin ? ADMIN : asOwner ? STAFF : EVALUATOR} current="dashboard">
      <ManageFrame
        p={p}
        status={consensusStatus(p)}
        tabs={asChair ? TABS.chair : p.stageTabs}
        current="consensus"
        title="Consensus"
        messages={messages}
        actions={
          asAdmin ? (
            adminActions
          ) : asOwner ? (
            <Button variant="primary" data-testid="finalize-consensus-button">
              Finalize consensus scores
            </Button>
          ) : undefined
        }
      >
        {asOwner ? (
          <Notice
            testId="evaluation-consensus-withheld-message"
            title="The agreed scores are not shown to you yet"
            description={`While the consensus is being agreed, only the evaluation panel can see it, and you are not on this opportunity's panel. The agreed scores appear here once the opportunity moves to the ${p.next}.`}
          />
        ) : null}
        {asAdmin ? (
          <>
            <p className="op-text">
              The chair records one agreed score for each proponent. Finalizing records the agreed scores against each
              proponent and moves up to {p.carried} proponents who met every minimum score into the {p.next}. It cannot be
              undone.
            </p>
            <ProponentList kind="consensus" entries={adminEntries} />
          </>
        ) : null}
        {asChair ? (
          <>
            {state === "submitted" ? (
              <p className="op-text">
                You submitted the consensus scores on September 18, 2026. You can change a consensus until the scores are
                finalized. If you do, submit the scores again.
              </p>
            ) : (
              <p className="op-text">
                As chair, record one agreed score and comment for each question of each proponent, drawing on the evaluators'
                scores. You can change a consensus until the consensus scores are finalized.
              </p>
            )}
            <ProponentList kind="consensus" entries={chairEntries} />
            <SubmitBlock
              hint={
                state === "default"
                  ? "You can submit once every proponent has a complete consensus: an agreed score and comment for every question."
                  : READY_HINT
              }
              label="Submit final consensus scores"
              testId="evaluation-submit-consensus"
              disabled={state === "default"}
            />
          </>
        ) : null}
      </ManageFrame>
      {state === "submit-confirm" ? (
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Submit the final consensus scores?"
            data-testid="evaluation-submit-consensus-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="evaluation-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" data-testid="evaluation-submit-consensus-confirm">
                  Submit consensus scores
                </Button>
              </>
            }
          >
            <Text elementType="p">
              The opportunity's owner and every administrator will be told that the consensus is ready to be finalized. You
              can still change a consensus until the scores are finalized.
            </Text>
          </AlertDialog>
        </Modal>
      ) : null}
      {state === "finalize-confirm" ? (
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Finalize the consensus scores?"
            data-testid="evaluation-finalize-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="evaluation-dialog-cancel">
                  Cancel
                </Button>
                <Button variant="primary" data-testid="evaluation-finalize-confirm">
                  Finalize consensus scores
                </Button>
              </>
            }
          >
            <Text elementType="p">
              The agreed scores are recorded against each proponent. Up to {p.carried} of the highest-scoring proponents who
              met every minimum score move into the {p.next}, and the opportunity moves with them. The chair and the
              opportunity's owner are told. This cannot be undone.
            </Text>
          </AlertDialog>
        </Modal>
      ) : null}
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// Scoring forms

type Entered = { score?: number; notes?: string; scoreError?: string; notesError?: string };

const SCORE_PROBLEMS: Problem[] = [
  { href: "#question-1-score", testId: "evaluation-score-error", text: "Question 1: enter a score between 0 and 5" },
  { href: "#question-2-score", testId: "evaluation-score-error", text: "Question 2: enter a score with no more than two decimal places" },
  { href: "#question-2-notes", testId: "evaluation-notes-error", text: "Question 2: enter a comment" },
];

// A score above the maximum, a score with three decimal places, and an empty comment, entered against question 1's
// own comment (design/DESIGN.md, "Domain: evaluation", "Forms and validation").
function invalidEntries(firstNotes: string): [Entered, Entered] {
  return [
    { score: 6, notes: firstNotes, scoreError: "Enter a score between 0 and 5 for question 1." },
    {
      score: 7.125,
      notes: "",
      scoreError: "Enter a score with no more than two decimal places for question 2.",
      notesError: "Enter a comment for question 2.",
    },
  ];
}

function ScoreFields({ n, max, agreed, entered }: { n: number; max: number; agreed: boolean; entered?: Entered }) {
  return (
    <>
      <NumberField
        id={`question-${n}-score`}
        label={`${agreed ? "Agreed score" : "Score"} for question ${n}`}
        isRequired
        description={`Between 0 and ${max}, with up to two decimal places.`}
        defaultValue={entered?.score}
        isInvalid={entered?.scoreError !== undefined}
        errorMessage={entered?.scoreError}
        data-testid="evaluation-question-score-field"
      />
      <TextArea
        id={`question-${n}-notes`}
        label={`${agreed ? "Agreed comment" : "Comment"} for question ${n}`}
        isRequired
        description="At least one word, explaining the score."
        defaultValue={entered?.notes}
        isInvalid={entered?.notesError !== undefined}
        errorMessage={entered?.notesError}
        data-testid="evaluation-question-notes-field"
      />
    </>
  );
}

function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="op-text">
      <Link href={href}>{children}</Link>
    </p>
  );
}

function ScoringForm({ children }: { children: ReactNode }) {
  return (
    <Form validationBehavior="aria" className="op-region" onSubmit={(event) => event.preventDefault()}>
      {children}
    </Form>
  );
}

const SCORING_SENTENCE =
  "Score each question between 0 and its maximum, with up to two decimal places, and explain each score in a comment. Your draft is saved as you move between proponents. Nothing is shared until you submit your scores for consensus.";

export type IndividualCreateState = "default" | "invalid" | "duplicate";

export function IndividualCreate({ p, state }: { p: EvaluationProgram; state: IndividualCreateState }) {
  const head = <ScoringHead eyebrow={`Evaluate a ${p.name} proponent`} p={p} name="Proponent 2" place="Proponent 2 of 3" />;
  if (state === "duplicate") {
    return (
      <EvaluationPage viewer={EVALUATOR} current="dashboard">
        {head}
        <Refusal
          testId="evaluation-duplicate-error"
          title="This evaluation was not started"
          description={`You already have a ${p.question} evaluation for this proposal.`}
        />
        <BackLink href={`${proposalBase(p, 1)}/evaluations/${ME}/edit`}>Go to your evaluation of Proponent 2</BackLink>
        <p className="op-note">The form below is as in the default story and is trimmed here.</p>
      </EvaluationPage>
    );
  }
  const entered = state === "invalid" ? invalidEntries(p.mine[0].notes) : undefined;
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      {head}
      <BackLink href={`${manageBase(p)}?tab=evaluation`}>Back to your evaluations</BackLink>
      <p className="op-text">{SCORING_SENTENCE}</p>
      {state === "invalid" ? (
        <ErrorSummary
          title="This evaluation has 3 problems"
          lead="Your draft was saved as you entered it. Your scores cannot be submitted until these are fixed."
          problems={SCORE_PROBLEMS}
        />
      ) : null}
      <ScoringForm>
        {p.items.map((q, i) => (
          <QuestionBox key={q.n} n={q.n}>
            <QuestionText q={q} />
            <QuestionWorth q={q} />
            <Response name="Proponent 2" q={q} />
            <ScoreFields n={q.n} max={q.max} agreed={false} entered={entered?.[i]} />
          </QuestionBox>
        ))}
        <SaveRow label="Evaluation actions">
          <Button variant="secondary" data-testid="evaluation-save-previous">
            Save and go to previous proponent
          </Button>
          <Button variant="secondary" data-testid="evaluation-save-draft">
            Save draft
          </Button>
          <Button type="submit" variant="primary" data-testid="evaluation-save-next">
            Save and go to next proponent
          </Button>
        </SaveRow>
      </ScoringForm>
    </EvaluationPage>
  );
}

export type IndividualEditState = "default" | "invalid" | "submitted";

export function IndividualEdit({ p, state }: { p: EvaluationProgram; state: IndividualEditState }) {
  const status = state === "submitted" ? "Submitted" : state === "invalid" ? "Draft: incomplete" : "Draft: complete";
  const head = (
    <ScoringHead
      eyebrow={`${p.name} evaluation`}
      p={p}
      status={status}
      statusTestId="evaluation-status"
      name="Proponent 2"
      place="Proponent 2 of 3"
    />
  );
  const back = <BackLink href={`${manageBase(p)}?tab=evaluation`}>Back to your evaluations</BackLink>;
  if (state === "submitted") {
    return (
      <EvaluationPage viewer={EVALUATOR} current="dashboard">
        {head}
        {back}
        <Notice
          testId="evaluation-read-only-notice"
          title="This evaluation has been submitted"
          description="Submitted scores and comments cannot be changed."
        />
        {p.items.map((q, i) => (
          <Panel key={q.n} id={`question-${q.n}-heading`} title={`Question ${q.n}`}>
            <QuestionText q={q} />
            <Details
              items={[
                { term: "Your score", value: `${p.mine[i].score} out of ${q.max}` },
                { term: "Your comment", value: p.mine[i].notes },
              ]}
            />
          </Panel>
        ))}
        <BackLink href={`${proposalBase(p, 2)}/evaluations/${ME}/edit`}>Next proponent: Proponent 3</BackLink>
      </EvaluationPage>
    );
  }
  const entered: [Entered, Entered] =
    state === "invalid"
      ? invalidEntries(p.mine[0].notes)
      : [
          { score: p.mine[0].score, notes: p.mine[0].notes },
          { score: p.mine[1].score, notes: p.mine[1].notes },
        ];
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      {head}
      {back}
      {state === "invalid" ? (
        <ErrorSummary
          title="This evaluation has 3 problems"
          lead="Your changes were saved as you entered them. Your scores cannot be submitted until these are fixed."
          problems={SCORE_PROBLEMS}
        />
      ) : null}
      <ScoringForm>
        {p.items.map((q, i) => (
          <QuestionBox key={q.n} n={q.n}>
            <QuestionText q={q} />
            <QuestionWorth q={q} />
            <Response name="Proponent 2" q={q} />
            <ScoreFields n={q.n} max={q.max} agreed={false} entered={entered[i]} />
          </QuestionBox>
        ))}
        <SaveRow label="Evaluation actions">
          <Button variant="secondary" data-testid="evaluation-save-previous">
            Save and go to previous proponent
          </Button>
          <Button variant="secondary" data-testid="evaluation-save-changes">
            Save changes
          </Button>
          <Button type="submit" variant="primary" data-testid="evaluation-save-next">
            Save and go to next proponent
          </Button>
        </SaveRow>
      </ScoringForm>
    </EvaluationPage>
  );
}

export type ConsensusCreateState = "default" | "invalid" | "duplicate" | "chair-only";

export function ConsensusCreate({ p, state }: { p: EvaluationProgram; state: ConsensusCreateState }) {
  const eyebrow = `Agree a ${p.name} consensus`;
  if (state === "duplicate") {
    return (
      <EvaluationPage viewer={EVALUATOR} current="dashboard">
        <ScoringHead eyebrow={eyebrow} p={p} name="Proponent 3" place="Proponent 3 of 3" />
        <Refusal
          testId="evaluation-duplicate-consensus-error"
          title="This consensus was not started"
          description={`You already have a ${p.question} consensus for this proposal.`}
        />
        <BackLink href={`${proposalBase(p, 2)}/consensus/${ME}/edit`}>Go to the consensus for Proponent 3</BackLink>
        <p className="op-note">The form below is as in the default story and is trimmed here.</p>
      </EvaluationPage>
    );
  }
  if (state === "chair-only") {
    return (
      <EvaluationPage viewer={EVALUATOR_TWO} current="dashboard">
        <ScoringHead eyebrow={eyebrow} p={p} name="Proponent 3" place="Proponent 3 of 3" />
        <BackLink href={`${manageBase(p)}?tab=evaluation`}>Back to your evaluations</BackLink>
        <Notice
          testId="evaluation-chair-only-message"
          title="Only the chair records the consensus"
          description="You can read each evaluator's scores and comments for this proponent. The panel's chair records the agreed score."
        />
        {p.items.map((q) => (
          <Panel key={q.n} id={`question-${q.n}-heading`} title={`Question ${q.n}`}>
            <QuestionText q={q} />
            <PanelScores p={p} q={q} />
          </Panel>
        ))}
      </EvaluationPage>
    );
  }
  const entered = state === "invalid" ? invalidEntries(p.agreed[0].notes) : undefined;
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      <ScoringHead eyebrow={eyebrow} p={p} name="Proponent 3" place="Proponent 3 of 3" />
      <BackLink href={`${manageBase(p)}?tab=consensus`}>Back to the consensus</BackLink>
      <p className="op-text">
        Record the score and comment the panel agreed for each question. Each evaluator's own score and comment is shown with
        the question. A consensus is checked when you submit the final consensus scores.
      </p>
      {state === "invalid" ? (
        <ErrorSummary
          title="This consensus has 3 problems"
          lead="Your draft was saved as you entered it. The consensus scores cannot be submitted until these are fixed."
          problems={SCORE_PROBLEMS}
        />
      ) : null}
      <ScoringForm>
        {p.items.map((q, i) => (
          <QuestionBox key={q.n} n={q.n}>
            <QuestionText q={q} />
            <QuestionWorth q={q} />
            <Response name="Proponent 3" q={q} />
            <PanelScores p={p} q={q} />
            <ScoreFields n={q.n} max={q.max} agreed entered={entered?.[i]} />
          </QuestionBox>
        ))}
        <SaveRow label="Consensus actions">
          <Button variant="secondary" data-testid="evaluation-save-draft">
            Save draft
          </Button>
          <Button type="submit" variant="primary" data-testid="evaluation-save-next">
            Save and go to next proponent
          </Button>
        </SaveRow>
      </ScoringForm>
    </EvaluationPage>
  );
}

export type ConsensusEditState = "default" | "submitted" | "invalid";

export function ConsensusEdit({ p, state }: { p: EvaluationProgram; state: ConsensusEditState }) {
  const status = state === "submitted" ? "Submitted" : state === "invalid" ? "Draft: incomplete" : "Draft: complete";
  const entered: [Entered, Entered] =
    state === "invalid"
      ? invalidEntries(p.agreed[0].notes)
      : [
          { score: p.agreed[0].score, notes: p.agreed[0].notes },
          { score: p.agreed[1].score, notes: p.agreed[1].notes },
        ];
  return (
    <EvaluationPage viewer={EVALUATOR} current="dashboard">
      <ScoringHead
        eyebrow={`${p.name} consensus`}
        p={p}
        status={status}
        statusTestId="evaluation-consensus-status"
        name="Proponent 1"
        place="Proponent 1 of 3"
      />
      <BackLink href={`${manageBase(p)}?tab=consensus`}>Back to the consensus</BackLink>
      {state === "submitted" ? (
        <Notice
          testId="evaluation-editable-notice"
          title="This consensus has been submitted"
          description="You can still change it until the consensus scores are finalized. If you change it, submit the final consensus scores again."
        />
      ) : null}
      {state === "invalid" ? (
        <ErrorSummary
          title="This consensus has 3 problems"
          lead="Your changes were saved as you entered them. The consensus scores cannot be submitted until these are fixed."
          problems={SCORE_PROBLEMS}
        />
      ) : null}
      <ScoringForm>
        {p.items.map((q, i) => (
          <QuestionBox key={q.n} n={q.n}>
            <QuestionText q={q} />
            <QuestionWorth q={q} />
            <PanelScores p={p} q={q} />
            <ScoreFields n={q.n} max={q.max} agreed entered={entered[i]} />
          </QuestionBox>
        ))}
        <SaveRow label="Consensus actions">
          <Button variant="secondary" data-testid="evaluation-save-changes">
            Save changes
          </Button>
          <Button type="submit" variant="primary" data-testid="evaluation-save-next">
            Save and go to next proponent
          </Button>
        </SaveRow>
      </ScoringForm>
    </EvaluationPage>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// Request addresses

const R525 =
  "This evaluation could not be submitted for review because it is incomplete. Please edit, complete and save the appropriate form before trying to submit it again.";

export function IndividualRequest({ p, state }: { p: EvaluationProgram; state: "default" | "refused" | "duplicate" }) {
  const address = `/api/proposal/${p.program}/<proposal>/${p.segment}/evaluations`;
  const title = `A ${p.name} individual evaluation, by request`;
  const asked = "An evaluator on the panel, while the opportunity is in individual question evaluation";
  const notes = <Ordered testId="evaluation-individual-request-stored-notes" items={p.requestNotes} />;
  if (state === "duplicate") {
    return (
      <Reference
        viewer={EVALUATOR}
        title={title}
        idBase="evaluation-individual-request"
        requestTitle="Request"
        request={[
          {
            term: "Start an evaluation",
            value: `POST ${address}, sending the proposal, the status DRAFT and a score and comment for each of the four questions`,
            testId: "evaluation-individual-request-create",
          },
          { term: "Asked by", value: "An evaluator who already holds a draft evaluation of this proponent" },
        ]}
        answer={[
          { term: "Evaluation started", value: "No", testId: "evaluation-individual-request-created" },
          {
            term: "Refusal",
            value: `You already have a ${p.question} evaluation for this proposal.`,
            testId: "evaluation-individual-request-creation-refusal-message",
          },
          {
            term: "The existing draft's scores, by question order",
            value: <Ordered testId="evaluation-individual-request-stored-scores" items={[3, 3, 3, 3]} />,
          },
          { term: "What changed", value: "Nothing. No second evaluation is created." },
        ]}
      />
    );
  }
  if (state === "refused") {
    return (
      <Reference
        viewer={EVALUATOR}
        title={title}
        idBase="evaluation-individual-request"
        requestTitle="Requests"
        request={[
          {
            term: "Submit this evaluation alone",
            value: `PUT ${address}/<evaluator>, tagged submit, for one complete draft`,
            testId: "evaluation-individual-request-submit-alone",
          },
          {
            term: "Save a draft as entered",
            value:
              "PUT to the same address, tagged edit, with question 1's score above its maximum and question 2's comment empty, followed by the evaluator submitting their scores for consensus",
            testId: "evaluation-individual-request-save-draft",
          },
          { term: "Asked by", value: asked },
        ]}
        answer={[
          {
            term: "Submitting one evaluation alone",
            value: "Refused: the request is not recognised (the criteria do not state the status)",
            testId: "evaluation-individual-request-refused-unrecognised",
          },
          {
            term: "Submitting the set with this draft in it",
            value: `Refused: “${R525}”`,
            testId: "evaluation-individual-request-refused-at-submission",
          },
          { term: "Status", value: "Draft", testId: "evaluation-individual-request-status" },
          {
            term: "Scores as stored, by question order",
            value: <Ordered testId="evaluation-individual-request-stored-scores" items={[6, 3, 4, 2.5]} />,
          },
          { term: "Comments as stored, by question order", value: notes },
          { term: "What changed", value: "Nothing. No evaluation is submitted." },
        ]}
      />
    );
  }
  return (
    <Reference
      viewer={EVALUATOR}
      title={title}
      idBase="evaluation-individual-request"
      requestTitle="Requests"
      request={[
        {
          term: "Start an evaluation",
          value: `POST ${address}, sending the proposal, the status DRAFT and a score and comment for each of the four questions. The evaluator is taken from the session.`,
          testId: "evaluation-individual-request-create",
        },
        {
          term: "Save a draft as entered",
          value: `PUT ${address}/<evaluator>, tagged edit, sending the four scores and comments exactly as given`,
          testId: "evaluation-individual-request-save-draft",
        },
        { term: "Asked by", value: asked },
      ]}
      answer={[
        { term: "Evaluation started", value: "Yes: the service answers with the new evaluation", testId: "evaluation-individual-request-created" },
        { term: "Status", value: "Draft", testId: "evaluation-individual-request-status" },
        {
          term: "Scores as stored, by question order",
          value: (
            <Ordered
              testId="evaluation-individual-request-stored-scores"
              items={["6 (question 1 is worth 5; a draft is stored as sent)", 3, 4, 2.5]}
            />
          ),
        },
        { term: "Comments as stored, by question order", value: notes },
      ]}
    />
  );
}

// The evaluator's submission naming the proponents it covers (R-5.25, R-5.27; the surface's note on this address).
// Illustrative: the stories name Proponent 1 and Proponent 2 of three.
export function SubmissionRequest({ state }: { state: "default" | "refused" }) {
  const refused = state === "refused";
  return (
    <Reference
      viewer={EVALUATOR}
      title="Submit individual scores for consensus, naming the proponents, by request"
      idBase="evaluation-submission-request"
      requestTitle="Request"
      request={[
        {
          term: "Submit scores, naming proponents",
          value: refused
            ? "PUT /api/opportunities/sprint-with-us/<opportunity>, tagged submitIndividualQuestionEvaluations, naming the proposals of Proponent 1 and Proponent 2, with Proponent 2's draft incomplete"
            : "PUT /api/opportunities/sprint-with-us/<opportunity>, tagged submitIndividualQuestionEvaluations, naming the proposals of Proponent 1 and Proponent 2 and no other, with an optional note",
          testId: "evaluation-submission-request-submit",
        },
        { term: "Asked by", value: "An evaluator on the panel, while the opportunity is in individual question evaluation" },
      ]}
      answer={[
        {
          term: "Accepted",
          value: refused ? "No" : "Yes: the service answers with the opportunity",
          testId: "evaluation-submission-request-accepted",
        },
        {
          term: "Refusal messages, in order",
          value: refused ? (
            <Ordered testId="evaluation-submission-request-refusal-messages" items={[R525]} />
          ) : (
            <>
              None
              <Ordered testId="evaluation-submission-request-refusal-messages" items={[]} />
            </>
          ),
        },
        {
          term: "Opportunity status, read afresh",
          value: refused
            ? "Team questions: individual evaluation (EVAL_QUESTIONS_INDIVIDUAL)"
            : "Team questions: consensus (EVAL_QUESTIONS_CONSENSUS), once every evaluator's scores for the two proponents named are submitted",
          testId: "evaluation-submission-request-status",
        },
        {
          term: "What changed",
          value: refused
            ? "Nothing. Neither evaluation is submitted."
            : "The evaluator's evaluations of Proponent 1 and Proponent 2 are submitted. Proponent 3's is not, and the move to consensus counts only the two named.",
        },
      ]}
    />
  );
}

export function ConsensusRequest({ p, state }: { p: EvaluationProgram; state: "default" | "refused" }) {
  const refused = state === "refused";
  const change = `PUT /api/proposal/${p.program}/<proposal>/${p.segment}/consensus/<chair>, tagged edit, sending an agreed score and comment for each of the four questions`;
  return (
    <Reference
      viewer={refused ? EVALUATOR_TWO : EVALUATOR}
      title={`A ${p.name} consensus, by request`}
      idBase="evaluation-consensus-request"
      requestTitle="Request"
      request={[
        {
          term: "Change the consensus",
          value: refused ? change : `${change}, by question order`,
          testId: "evaluation-consensus-request-change",
        },
        {
          term: "Asked by",
          value: refused
            ? "An evaluator who is not the chair, or anyone once the opportunity has moved past consensus; read back by an administrator"
            : "The panel's chair, while the opportunity is in consensus; read back by an administrator",
        },
      ]}
      answer={[
        refused
          ? { term: "Outcome", value: "Refused: not permitted", testId: "evaluation-consensus-request-refused" }
          : { term: "Outcome", value: "Accepted: the service answers with the consensus", testId: "evaluation-consensus-request-accepted" },
        { term: refused ? "Status, read back" : "Status", value: "Submitted", testId: "evaluation-consensus-request-status" },
        {
          term: refused ? "Agreed scores, read back, by question order" : "Agreed scores as stored, by question order",
          value: <Ordered testId="evaluation-consensus-request-stored-scores" items={[4, 7.5, 8, 3]} />,
        },
        {
          term: refused ? "Agreed comments, read back, by question order" : "Agreed comments as stored, by question order",
          value: <Ordered testId="evaluation-consensus-request-stored-notes" items={p.consensusNotes} />,
        },
        ...(refused ? [{ term: "What changed", value: "Nothing. The consensus keeps what it held." }] : []),
      ]}
    />
  );
}

const STORED_PANEL = ["Test Evaluator One: evaluator and chair", "Test Evaluator Two: evaluator"];

export function PanelRequest({ state }: { state: "default" | "refused" }) {
  if (state === "refused") {
    return (
      <Reference
        viewer={STAFF}
        title="An evaluation panel, by request"
        idBase="evaluation-panel-request"
        requestTitle="Requests"
        request={[
          {
            term: "A member with no role",
            value:
              "PUT /api/opportunities/sprint-with-us/<opportunity>, tagged editEvaluationPanel, naming Test Evaluator One as evaluator and chair and Test Evaluator Two as neither",
            testId: "evaluation-panel-request-member-no-role",
          },
          {
            term: "No chair",
            value:
              "PUT to the same address, tagged editEvaluationPanel, naming two public sector employees, both evaluators and neither the chair",
            testId: "evaluation-panel-request-no-chair",
          },
          { term: "Asked by", value: "The opportunity's owner, while the panel may still be changed" },
        ]}
        answer={[
          {
            term: "Member with no role, refused",
            value: "Panel member 2: Test Evaluator Two must be an evaluator, the chair, or both.",
            testId: "evaluation-panel-request-member-without-role-error",
          },
          {
            term: "No chair, refused",
            value: "Choose a chair. The panel needs one person to record the agreed scores.",
            testId: "evaluation-panel-request-missing-chair-error",
          },
          {
            term: "Panel as stored, unchanged",
            value: <Ordered testId="evaluation-panel-request-panel-as-stored" items={STORED_PANEL} />,
          },
        ]}
      />
    );
  }
  return (
    <Reference
      viewer={STAFF}
      title="An evaluation panel, by request"
      idBase="evaluation-panel-request"
      requestTitle="Request"
      request={[
        { term: "Read the opportunity", value: "GET /api/opportunities/sprint-with-us/<opportunity> (or team-with-us)" },
        { term: "Asked by", value: "The opportunity's owner or an administrator" },
      ]}
      answer={[
        {
          term: "Panel as stored",
          value: <Ordered testId="evaluation-panel-request-panel-as-stored" items={STORED_PANEL} />,
        },
      ]}
    />
  );
}
