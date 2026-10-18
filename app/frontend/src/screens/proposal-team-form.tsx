import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button, Link, NumberField, Radio, RadioGroup, Select, Text, TextArea, TextField } from "@bcgov/design-system-react-components";
import { SERVICE_AREAS, SWU_PHASES, SWU_PHASE_NAMES, SwuPhase } from "@rules/other-program-drafts";
import {
  MemberStanding,
  OrganizationForProposal,
  PHASE_KEYS,
  ReferenceInput,
  SwuOpportunityForProposal,
  SwuProposalInput,
  TEAM_PROGRAM_NAMES,
  TeamProblem,
  TeamProgram,
  TwuOpportunityForProposal,
  TwuProposalInput,
  capabilityGapMessage,
  phaseShortfall,
  swuBodyOf,
  swuCostProblems,
  swuProposalProblems,
  swuTotalCost,
  teamProblemFromLine,
  twuBodyOf,
  twuContractCost,
  twuProposalProblems,
  wordCount,
} from "@rules/team-proposals";
import type { Attachment } from "../api/opportunities";
import type { OtherProgramOpportunity } from "../api/other-programs";
import { TeamMember, fetchOrganization, fetchTeam } from "../api/organizations";
import type { ActingFor } from "../api/proposals";
import type { TeamProposal, TeamProposalSaveAnswer } from "../api/team-proposals";
import { AttachmentControl, useAttachments } from "../app/attachments";
import { Fieldset } from "../app/opportunity-kit";
import { Focused, FormPart, GroupError, ProposalFormPage, ProposalStatus, type SummaryFacts } from "../app/proposal-kit";
import { TitledAlert } from "../app/titled-alert";
import { dayLabel, deadlineLabel } from "./opportunity-parts";
import { TermsDialog } from "./proposal-cwu-form";

/**
 * The Sprint With Us and Team With Us proposal form (proposal-swu-create, proposal-twu-create, and
 * the Proposal tab of their manage pages while editing; decision records 0058 and 0078), drawn as
 * the catalogue draws it: one long form in numbered parts beside a summary of the opportunity that
 * holds the actions.
 *
 * The organization is chosen from those the vendor owns or administers, and its qualification is
 * said as soon as it is chosen (R-2.16, R-2.17). Sprint With Us asks for a team for each of the
 * opportunity's phases and no other, with one scrum master chosen among each phase's members, a
 * proposed cost, and what each phase still lacks — a member, a confirmed member, a capability — as
 * the team is named; the total cost and any cost over its budget are said as they are entered, and
 * Submit proposal stays unavailable while any of that holds (R-2.18, R-2.19). Team With Us asks for
 * people against the opportunity's resources at an hourly rate, never offering one person twice,
 * and says what the rates come to over the contract against the maximum budget (R-2.10, R-2.20).
 * Each question's answer is counted against its word limit (R-2.21). A draft keeps whatever it
 * holds (R-2.12); a submission is checked here by the same rules as the service before the terms
 * are asked for (R-2.3).
 */

export interface PhaseValues {
  readonly members: readonly { readonly member: string; readonly scrumMaster: boolean }[];
  /** NaN while nothing is entered. */
  readonly proposedCost: number;
}

export interface TeamFormValues {
  readonly organization: string;
  readonly phases: Readonly<Partial<Record<SwuPhase, PhaseValues>>>;
  readonly team: readonly { readonly member: string; readonly resource: string; readonly hourlyRate: number }[];
  /** Each answer by the order of the question it answers. */
  readonly responses: Readonly<Record<number, string>>;
  readonly references: readonly ReferenceInput[];
}

/** An empty form for an opportunity: a team section for each of its phases, and nothing in any. */
export function blankTeamValues(opportunity: OtherProgramOpportunity): TeamFormValues {
  const phases: Partial<Record<SwuPhase, PhaseValues>> = {};
  for (const phase of opportunity.phases) phases[phase.phase] = { members: [], proposedCost: Number.NaN };
  return { organization: "", phases, team: [], responses: {}, references: [] };
}

/** What the form starts from for a proposal already kept. */
export function teamValuesFrom(proposal: TeamProposal, opportunity: OtherProgramOpportunity): TeamFormValues {
  const phases: Partial<Record<SwuPhase, PhaseValues>> = {};
  for (const phase of opportunity.phases) {
    const kept = proposal.phases[phase.phase];
    phases[phase.phase] = kept
      ? { members: kept.members.map((member) => ({ member: member.member.id, scrumMaster: member.scrumMaster })), proposedCost: kept.proposedCost }
      : { members: [], proposedCost: Number.NaN };
  }
  return {
    organization: proposal.organization?.id ?? "",
    phases,
    team: proposal.team.map((member) => ({ member: member.member.id, resource: member.resource.id, hourlyRate: member.hourlyRate })),
    responses: Object.fromEntries(proposal.responses.map((response) => [response.order, response.response])),
    references: proposal.references,
  };
}

const orNull = (value: number): number | null => (Number.isNaN(value) ? null : value);

function swuInputOf(values: TeamFormValues, attachments: readonly string[]): SwuProposalInput {
  const phases: Partial<Record<SwuPhase, { members: PhaseValues["members"]; proposedCost: number | null }>> = {};
  for (const phase of SWU_PHASES) {
    const team = values.phases[phase];
    if (team) phases[phase] = { members: team.members, proposedCost: orNull(team.proposedCost) };
  }
  return {
    organization: values.organization,
    phases,
    responses: Object.entries(values.responses).map(([order, response]) => ({ order: Number(order), response })),
    references: values.references,
    attachments,
  };
}

function twuInputOf(values: TeamFormValues, attachments: readonly string[]): TwuProposalInput {
  return {
    organization: values.organization,
    team: values.team.map((member) => ({ ...member, hourlyRate: orNull(member.hourlyRate) })),
    responses: Object.entries(values.responses).map(([order, response]) => ({ order: Number(order), response })),
    attachments,
  };
}

/** The request body the form's values are sent as, in the program's own names. */
export function teamContentOf(program: TeamProgram, values: TeamFormValues, attachments: readonly string[]): Record<string, unknown> {
  return program === "sprint-with-us" ? swuBodyOf(swuInputOf(values, attachments)) : twuBodyOf(twuInputOf(values, attachments));
}

/** The opportunity as the rules judge a Sprint With Us proposal against it. */
export function swuOpportunityOf(opportunity: OtherProgramOpportunity): SwuOpportunityForProposal {
  return {
    totalMaxBudget: opportunity.value.amount,
    phases: opportunity.phases.map((phase) => ({ phase: phase.phase, maxBudget: phase.maxBudget, requiredCapabilities: phase.requiredCapabilities })),
    questions: opportunity.questions.map((question, order) => ({ order, question: question.question, wordLimit: question.wordLimit })),
  };
}

export function twuOpportunityOf(opportunity: OtherProgramOpportunity): TwuOpportunityForProposal {
  return {
    maxBudget: opportunity.value.amount,
    startDate: opportunity.startDate || null,
    completionDate: opportunity.completionDate,
    resources: opportunity.resources,
    questions: opportunity.questions.map((question, order) => ({ order, question: question.question, wordLimit: question.wordLimit })),
  };
}

/** Each team member's standing with the organization, as the rules read it. */
export function memberStandings(team: readonly TeamMember[]): Map<string, MemberStanding> {
  return new Map(
    team.map((member) => [member.userId, { id: member.userId, name: member.name, membershipStatus: member.membershipStatus, capabilities: member.capabilities }]),
  );
}

/**
 * The people a phase or a resource may add (proposal-swu-create and proposal-twu-create,
 * team_member_choices): for Sprint With Us everyone whose membership stands, pending invitees
 * marked "(membership pending)", leaving out anybody already in that phase; for Team With Us active
 * members only, leaving out anybody already named anywhere on the proposal.
 */
export function teamMemberChoices(
  program: TeamProgram,
  team: readonly TeamMember[],
  named: readonly string[],
): { readonly id: string; readonly label: string; readonly pending: boolean }[] {
  return team
    .filter((member) => (program === "sprint-with-us" ? member.membershipStatus !== "INACTIVE" : member.membershipStatus === "ACTIVE"))
    .filter((member) => !named.includes(member.userId))
    .map((member) => ({
      id: member.userId,
      label: member.membershipStatus === "PENDING" ? `${member.name} (membership pending)` : member.name,
      pending: member.membershipStatus === "PENDING",
    }));
}

/** "A, B and C". */
function listed(words: readonly string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/**
 * What a phase's requirements line says (proposal-swu-create, phase_requirements): that its team
 * meets them, with the capabilities it holds, or that it is incomplete and why — nobody named, a
 * member still pending, a required capability not yet held.
 */
export function phaseRequirementsSentence(shortfall: {
  readonly complete: boolean;
  readonly empty: boolean;
  readonly pending: boolean;
  readonly missing: readonly string[];
  readonly required: readonly string[];
}): string {
  if (shortfall.complete) {
    return shortfall.required.length > 0
      ? `This phase’s team meets its requirements. ${listed(shortfall.required)}: held.`
      : "This phase’s team meets its requirements.";
  }
  const reasons = [
    shortfall.empty ? "Name at least one team member." : "",
    shortfall.pending ? "Every member must be a confirmed member of the organization, not pending." : "",
    shortfall.missing.length > 0 ? `Not yet held: ${shortfall.missing.join(", ")}.` : "",
  ].filter((reason) => reason !== "");
  return ["This phase’s team is incomplete.", ...reasons].join(" ");
}

/** The opportunity as the form's summary gives it: program, the proposal's status, title, closing date, budget. */
export function teamSummary(program: TeamProgram, opportunity: OtherProgramOpportunity, status?: string): SummaryFacts {
  return {
    program,
    title: opportunity.title || "Untitled opportunity",
    closes: deadlineLabel(opportunity.proposalDeadline),
    facts: opportunity.value.amount > 0 ? [`Maximum budget ${dollars(opportunity.value.amount)}`] : [],
    ...(status ? { status } : {}),
  };
}

const dollars = (amount: number) => `$${Math.round(amount).toLocaleString("en-CA")}`;
export const areaName = (key: string | null) => {
  const name = SERVICE_AREAS.find((area) => area.key === key)?.name ?? key ?? "Unknown service area";
  return name.charAt(0) + name.slice(1).toLowerCase();
};
const phaseLower = (phase: SwuPhase) => SWU_PHASE_NAMES[phase].toLowerCase();
const RATE_FORMAT = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;
const COST_FORMAT = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 } as const;
const NOT_ACTIVE = "User is not an active member of the organization.";

/** The element each refusal links to, and the words its line in the summary starts with. */
function placeOf(program: TeamProgram, field: string): { readonly id: string; readonly label: string; readonly rank: number } {
  const [head = "", second] = field.split(".");
  if (head === "organization") return { id: "proposal-organization", label: "Organization", rank: 0 };
  const phase = SWU_PHASES.find((each) => PHASE_KEYS[each] === head);
  if (phase) {
    const lower = phaseLower(phase);
    return {
      id: second === "proposedCost" ? `proposal-${lower}-cost` : `proposal-${lower}-team`,
      label: `${SWU_PHASE_NAMES[phase]} phase`,
      rank: 10 + SWU_PHASES.indexOf(phase),
    };
  }
  if (head === "team" && second) return { id: `proposal-team-member-${second}`, label: `Team member ${second}`, rank: 20 + Number(second) };
  if (head === "team") return program === "sprint-with-us" ? { id: "proposal-capabilities-error", label: "Capabilities", rank: 15 } : { id: "form-team", label: "Team", rank: 20 };
  if (head === "totalProposedCost") return { id: "proposal-cost-error", label: "Cost", rank: 200 };
  if ((head === "teamQuestionResponses" || head === "resourceQuestionResponses") && second !== undefined) {
    return { id: `proposal-question-${Number(second) + 1}`, label: `Question ${Number(second) + 1}`, rank: 300 + Number(second) };
  }
  if (head === "references" && second) return { id: `proposal-reference-${second}`, label: `Reference ${second}`, rank: 500 + Number(second) };
  if (head === "attachments") return { id: "form-attachments", label: "Attachments", rank: 600 };
  return { id: "form-organization", label: "Proposal", rank: 700 };
}

/**
 * The error summary, focused when it appears (`proposal-error-summary`): every problem, each a link
 * to where it is (`field-error`) naming the place and its message.
 */
export function TeamProblemSummary({ program, problems, title }: { program: TeamProgram; problems: readonly TeamProblem[]; title: string }) {
  const ordered = [...problems].sort((a, b) => placeOf(program, a.field).rank - placeOf(program, b.field).rank);
  return (
    <Focused id="proposal-error-summary">
      <TitledAlert variant="danger" role="alert" title={`${title} ${ordered.length} ${ordered.length === 1 ? "problem" : "problems"}`}>
        <ul className="pp-errors">
          {ordered.map((problem, index) => {
            const place = placeOf(program, problem.field);
            return (
              <li key={`${problem.field}-${index}`} data-testid="field-error">
                <Link href={`#${place.id}`}>{`${place.label}: ${problem.message}`}</Link>
              </li>
            );
          })}
        </ul>
      </TitledAlert>
    </Focused>
  );
}

export type TeamFormAction = "save" | "submit";

/** The chosen organization as the form knows it: its qualification and its people. */
type Chosen =
  | { readonly kind: "none" }
  | { readonly kind: "loading"; readonly id: string }
  | { readonly kind: "loaded"; readonly id: string; readonly organization: OrganizationForProposal | null; readonly team: readonly TeamMember[] };

export function TeamProposalForm({
  program,
  purpose,
  opportunity,
  organizations,
  initial,
  initialAttachments = [],
  initialNames = {},
  organizationLocked = false,
  offerSubmit = true,
  head,
  intro,
  summary,
  refusalTitle,
  onSend,
  onSaved,
  onCancel,
}: {
  readonly program: TeamProgram;
  readonly purpose: "create" | "edit";
  readonly opportunity: OtherProgramOpportunity;
  /** The organizations the vendor owns or administers, and the one already named if it is not among them. */
  readonly organizations: readonly ActingFor[];
  readonly initial: TeamFormValues;
  readonly initialAttachments?: readonly Attachment[];
  /** The names of the people a kept proposal already names. */
  readonly initialNames?: Readonly<Record<string, string>>;
  /** Whether the proposal has been put forward, so its organization stays (R-2.22). */
  readonly organizationLocked?: boolean;
  /** On the manage page, whether Save changes and submit is offered: not on a proposal already submitted. */
  readonly offerSubmit?: boolean;
  /** The H1 and what sits with it. */
  readonly head: ReactNode;
  /** The sentences that introduce the form. */
  readonly intro?: ReactNode;
  /** The opportunity beside the form, which holds the actions on a wide screen. */
  readonly summary: SummaryFacts;
  readonly refusalTitle: string;
  readonly onSend: (action: TeamFormAction, content: Record<string, unknown>) => Promise<TeamProposalSaveAnswer>;
  readonly onSaved: (proposal: TeamProposal, action: TeamFormAction) => void;
  readonly onCancel: () => void;
}) {
  const sprint = program === "sprint-with-us";
  const [values, setValues] = useState<TeamFormValues>(initial);
  const [chosen, setChosen] = useState<Chosen>(initial.organization ? { kind: "loading", id: initial.organization } : { kind: "none" });
  const [problems, setProblems] = useState<readonly TeamProblem[]>([]);
  const [refusal, setRefusal] = useState<readonly string[] | null>(null);
  // Each new set of problems or refusal is a new message, focused as it appears.
  const [messageVersion, setMessageVersion] = useState(0);
  const [existingNamed, setExistingNamed] = useState<string | null>(null);
  const [existingHeld, setExistingHeld] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [adding, setAdding] = useState<Readonly<Record<string, string>>>({});
  const attachments = useAttachments(initialAttachments);

  // The chosen organization's qualification and people, read whenever another is chosen.
  const chosenId = values.organization;
  useEffect(() => {
    if (chosenId === "") {
      setChosen({ kind: "none" });
      return;
    }
    let current = true;
    setChosen({ kind: "loading", id: chosenId });
    void Promise.all([fetchOrganization(chosenId), fetchTeam(chosenId)]).then(([found, team]) => {
      if (!current) return;
      const organization: OrganizationForProposal | null =
        found.kind === "found"
          ? {
              id: found.organization.id,
              active: found.organization.active,
              swuQualified: found.organization.swuQualified,
              twuQualified: found.organization.twuQualified,
              serviceAreas: found.organization.serviceAreas,
            }
          : null;
      setChosen({ kind: "loaded", id: chosenId, organization, team: team.kind === "listed" ? team.members : [] });
    });
    return () => {
      current = false;
    };
  }, [chosenId]);

  const people = chosen.kind === "loaded" ? chosen.team : [];
  const standings = useMemo(() => memberStandings(people), [people]);
  const nameOf = (id: string) => standings.get(id)?.name ?? initialNames[id] ?? "Unknown person";
  const swu = useMemo(() => swuOpportunityOf(opportunity), [opportunity]);
  const twu = useMemo(() => twuOpportunityOf(opportunity), [opportunity]);
  const organizationName = organizations.find((organization) => organization.id === values.organization)?.legalName ?? "This organization";
  const qualified =
    chosen.kind !== "loaded" || !chosen.organization ? true : sprint ? chosen.organization.swuQualified : chosen.organization.twuQualified;
  const neededAreas = [...new Set(opportunity.resources.map((resource) => resource.serviceArea))];
  const missingAreas =
    !sprint && chosen.kind === "loaded" && chosen.organization ? neededAreas.filter((area) => !chosen.organization!.serviceAreas.includes(area)) : [];

  // What is wrong with the costs as they are entered (proposal-swu-create, cost_errors).
  const costProblems = sprint ? swuCostProblems(swuInputOf(values, []), swu) : [];
  const costFor = (field: string) => costProblems.find((problem) => problem.field === field)?.message;
  const shortfalls = opportunity.phases.map((phase) => ({
    phase,
    ...phaseShortfall(swuInputOf(values, []).phases[phase.phase] as SwuProposalInput["phases"][SwuPhase], swu.phases.find((each) => each.phase === phase.phase)!, standings),
  }));
  const requiredCapabilities = [...new Set(opportunity.phases.flatMap((phase) => phase.requiredCapabilities))];
  const heldCapabilities = new Set(
    SWU_PHASES.flatMap((phase) => values.phases[phase]?.members ?? [])
      .map((member) => standings.get(member.member))
      .filter((standing) => standing?.membershipStatus === "ACTIVE")
      .flatMap((standing) => standing?.capabilities ?? []),
  );
  const uncovered = requiredCapabilities.filter((capability) => !heldCapabilities.has(capability));
  const anyoneNamed = sprint ? SWU_PHASES.some((phase) => (values.phases[phase]?.members.length ?? 0) > 0) : values.team.length > 0;
  // Sprint With Us may not be submitted while a phase is incomplete or a cost is over its budget.
  const submitUnavailable = sprint && (shortfalls.some((shortfall) => !shortfall.complete) || costProblems.length > 0);
  const contractCost = sprint ? null : twuContractCost(twuInputOf(values, []).team, twu);
  const overContract = contractCost !== null && contractCost > twu.maxBudget;

  const problemFor = (field: string) => problems.find((problem) => problem.field === field)?.message;
  const problemsUnder = (prefix: string) => problems.filter((problem) => problem.field === prefix || problem.field.startsWith(`${prefix}.`));

  function setPhase(phase: SwuPhase, change: (team: PhaseValues) => PhaseValues) {
    setValues((current) => {
      const team = current.phases[phase] ?? { members: [], proposedCost: Number.NaN };
      return { ...current, phases: { ...current.phases, [phase]: change(team) } };
    });
  }

  /** Another organization empties the team, which is then named from its people (surface proposal-swu-edit). */
  function chooseOrganization(id: string) {
    setExistingNamed(null);
    setValues((current) => {
      if (current.organization === id) return current;
      const phases: Partial<Record<SwuPhase, PhaseValues>> = {};
      for (const phase of SWU_PHASES) {
        const team = current.phases[phase];
        if (team) phases[phase] = { ...team, members: [] };
      }
      return { ...current, organization: id, phases, team: [] };
    });
  }

  async function send(action: TeamFormAction) {
    if (sending) return;
    setRefusal(null);
    setExistingNamed(null);
    setExistingHeld(null);
    setSending(true);
    const stored = await attachments.store();
    if (!stored.ok) {
      setSending(false);
      setAsking(false);
      return;
    }
    const answer = await onSend(action, teamContentOf(program, values, stored.ids));
    setSending(false);
    setAsking(false);
    if (answer.kind === "saved") {
      setProblems([]);
      onSaved(answer.proposal, action);
      return;
    }
    setMessageVersion((version) => version + 1);
    if (answer.kind === "failed") {
      setRefusal(["The service could not save it. Nothing you entered has been lost. Try again."]);
      return;
    }
    const named = answer.reasons.map(teamProblemFromLine).filter((problem): problem is TeamProblem => problem !== null);
    setProblems(named);
    if (answer.existingOrganizationProposalId) setExistingNamed(answer.existingOrganizationProposalId);
    if (answer.existingProposalId) setExistingHeld(answer.existingProposalId);
    const rest = answer.reasons.filter((reason) => teamProblemFromLine(reason) === null);
    if (rest.length > 0 || named.length === 0) setRefusal(rest);
  }

  function attempt(action: TeamFormAction) {
    setAttempted(true);
    if (action === "save") {
      setProblems([]);
      void send("save");
      return;
    }
    // Everything a submission needs is checked here first, by the service's own rules; the terms are asked for only then.
    const organization = chosen.kind === "loaded" ? chosen.organization : null;
    const found = sprint
      ? swuProposalProblems(swuInputOf(values, []), swu, organization, standings)
      : twuProposalProblems(twuInputOf(values, []), twu, organization, standings, new Set(opportunity.resources.map((resource) => resource.id)));
    setProblems(found);
    setMessageVersion((version) => version + 1);
    setRefusal(null);
    if (found.length === 0) setAsking(true);
  }

  const submitting = purpose === "create" || offerSubmit;
  const organizationChoices = organizations.map((organization) => ({ id: organization.id, label: organization.legalName }));
  const organizationProblem = problemFor("organization");
  const submitDescription = problems.length > 0 ? "proposal-error-summary" : submitUnavailable ? "proposal-submit-unavailable" : undefined;

  const messages = (
    <>
      {problems.length > 0 ? (
        <TeamProblemSummary
          key={`problems-${messageVersion}`}
          program={program}
          problems={problems}
          title={purpose === "edit" ? "Your changes have" : "This proposal has"}
        />
      ) : null}
      {refusal ? (
        <Focused key={`refusal-${messageVersion}`} testId="proposal-refused-message">
          <TitledAlert variant="danger" role="alert" title={refusalTitle}>
            {(refusal.length > 0 ? refusal : ["The service refused it."]).map((reason) => (
              <Text elementType="p" key={reason}>
                {reason}
              </Text>
            ))}
            {existingHeld ? <Link href={`/opportunities/${program}/${opportunity.id}/proposals/${existingHeld}/edit`}>Open your proposal</Link> : null}
          </TitledAlert>
        </Focused>
      ) : null}
      {values.organization !== "" && chosen.kind === "loaded" && !qualified ? (
        <Focused key={`unqualified-${values.organization}`} testId="proposal-unqualified-organization-notice">
          <TitledAlert variant="warning" title={`${organizationName} is not qualified for ${TEAM_PROGRAM_NAMES[program]}`}>
            <Text elementType="p">
              {`You can save this proposal as a draft, but it cannot be submitted for this organization until it is a qualified supplier for ${TEAM_PROGRAM_NAMES[program]}. Qualification is checked again when you submit.`}
            </Text>
            <Link href={`/organizations/${values.organization}/${program}-terms-and-conditions`}>Review the organization's qualification</Link>
          </TitledAlert>
        </Focused>
      ) : null}
    </>
  );

  const actions =
    purpose === "create" ? (
      <>
        <Button
          variant="primary"
          size="medium"
          isDisabled={sending || submitUnavailable}
          aria-describedby={submitDescription}
          onPress={() => attempt("submit")}
          data-testid="proposal-submit"
        >
          Submit proposal
        </Button>
        <Button variant="secondary" size="medium" isDisabled={sending} onPress={() => attempt("save")} data-testid="proposal-save-draft">
          Save draft
        </Button>
        <Button variant="tertiary" size="medium" onPress={onCancel} data-testid="proposal-cancel">
          Cancel
        </Button>
      </>
    ) : (
      <>
        {offerSubmit ? (
          <Button
            variant="primary"
            size="medium"
            isDisabled={sending || submitUnavailable}
            aria-describedby={submitDescription}
            onPress={() => attempt("submit")}
            data-testid="proposal-save-and-submit"
          >
            Save changes and submit
          </Button>
        ) : null}
        <Button
          variant={offerSubmit ? "secondary" : "primary"}
          size="medium"
          isDisabled={sending}
          onPress={() => attempt("save")}
          data-testid="proposal-save-changes"
        >
          Save changes
        </Button>
        <Button variant="tertiary" size="medium" onPress={onCancel} data-testid="proposal-cancel-edit">
          Cancel
        </Button>
      </>
    );

  const part = (number: number, title: string) => `${number}. ${title}`;
  let parts = 0;
  const next = (title: string) => part(++parts, title);

  return (
    <ProposalFormPage
      head={head}
      messages={messages}
      intro={intro}
      summary={summary}
      actions={actions}
      onSubmit={() => {
        if (!submitting) attempt("save");
        else if (!submitUnavailable) attempt("submit");
      }}
      dialogs={
        <TermsDialog
          isOpen={asking}
          isSending={sending}
          onCancel={() => setAsking(false)}
          onConfirm={() => void send("submit")}
          programName={TEAM_PROGRAM_NAMES[program]}
          programTerms={`/content/${program}-terms-and-conditions`}
        />
      }
    >
      <FormPart id="form-organization" title={next("Organization")}>
        <Select
          id="proposal-organization"
          label="Organization"
          isRequired
          description={
            organizationLocked
              ? "It cannot be changed while the proposal is submitted. Withdraw the proposal first to change it."
              : sprint
                ? "Organizations you own or administer. It must be a qualified supplier for Sprint With Us before you submit."
                : "Organizations you own or administer. It must be a qualified supplier for Team With Us, and provide every service area this opportunity needs, before you submit."
          }
          items={organizationChoices}
          value={values.organization === "" ? null : values.organization}
          onChange={(key) => chooseOrganization(key === null ? "" : String(key))}
          isInvalid={organizationProblem !== undefined}
          errorMessage={organizationProblem}
          data-testid="proposal-organization-field"
        />
        {organizations.length === 0 ? (
          <Text elementType="p" size="small">
            You do not own or administer an organization. <Link href="/organizations/create">Register one</Link> to propose.
          </Text>
        ) : null}
        {existingNamed ? (
          <Text elementType="p" size="small">
            {`${organizationName} already has a proposal for this opportunity. `}
            <Link href={`/opportunities/${program}/${opportunity.id}/proposals/${existingNamed}/edit`}>Open the existing proposal</Link>
          </Text>
        ) : null}
        {missingAreas.length > 0 ? (
          <GroupError id="proposal-service-area-message" testId="proposal-service-area-error">
            {`${organizationName} does not provide ${missingAreas.map(areaName).join(", ")}, which this opportunity needs.`}
          </GroupError>
        ) : null}
      </FormPart>

      {sprint ? (
        <FormPart id="form-team" title={next("Team")}>
          <p className="op-text">
            Name a team for each phase this opportunity has, and choose one scrum master in each. Everyone you name must be an active
            member of the organization.
          </p>
          {values.organization === "" ? <p className="op-text">Choose an organization to name its people.</p> : null}
          {shortfalls.map((shortfall) => {
            const { phase } = shortfall;
            const team = values.phases[phase.phase] ?? { members: [], proposedCost: Number.NaN };
            const lower = phaseLower(phase.phase);
            const legend = `${SWU_PHASE_NAMES[phase.phase]} phase`;
            const choices = teamMemberChoices(program, people, team.members.map((member) => member.member));
            const phaseProblems = problemsUnder(PHASE_KEYS[phase.phase]).filter((problem) => !problem.field.endsWith(".proposedCost"));
            const rowProblem = phaseProblems.some((problem) => problem.message === NOT_ACTIVE);
            const groupProblems = phaseProblems.filter((problem) => problem.message !== NOT_ACTIVE);
            const costMessage = costFor(`${PHASE_KEYS[phase.phase]}.proposedCost`) ?? problemFor(`${PHASE_KEYS[phase.phase]}.proposedCost`);
            const scrumMaster = team.members.find((member) => member.scrumMaster)?.member ?? null;
            const errorId = `proposal-${lower}-team-error`;
            return (
              <Fieldset key={phase.phase} legend={legend} testId="proposal-phase-team">
                <p className="op-note">
                  {`${dayLabel(phase.startDate)} to ${dayLabel(phase.completionDate)}.${phase.maxBudget > 0 ? ` Maximum budget ${dollars(phase.maxBudget)}.` : ""}`}
                </p>
                {team.members.length > 0 ? (
                  <ul className="pp-rows" id={`proposal-${lower}-team`} aria-label={`${legend} team`}>
                    {team.members.map((member) => {
                      const standing = standings.get(member.member);
                      const notActive = standing !== undefined && standing.membershipStatus !== "ACTIVE";
                      return (
                        <li key={member.member} className="pp-row">
                          <span className="pp-row-name">
                            {nameOf(member.member)}
                            {notActive ? (
                              <ProposalStatus testId="proposal-pending-team-member">
                                {standing.membershipStatus === "PENDING" ? "Membership pending" : "Not a member"}
                              </ProposalStatus>
                            ) : null}
                          </span>
                          <Button
                            variant="tertiary"
                            size="small"
                            aria-label={`Remove ${nameOf(member.member)} from the ${lower} phase`}
                            onPress={() =>
                              setPhase(phase.phase, (current) => ({ ...current, members: current.members.filter((each) => each.member !== member.member) }))
                            }
                          >
                            Remove
                          </Button>
                          {notActive && rowProblem ? (
                            <div className="pp-row-error">
                              <Text elementType="p" size="small" color="danger">
                                {NOT_ACTIVE}
                              </Text>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="op-text" id={`proposal-${lower}-team`}>
                    Nobody is named in this phase yet.
                  </p>
                )}
                {team.members.length > 0 ? (
                  <RadioGroup
                    label={`Scrum master for the ${lower} phase`}
                    isRequired
                    orientation="vertical"
                    value={scrumMaster}
                    isInvalid={groupProblems.length > 0}
                    aria-describedby={groupProblems.length > 0 ? errorId : undefined}
                    onChange={(value) =>
                      setPhase(phase.phase, (current) => ({
                        ...current,
                        members: current.members.map((member) => ({ ...member, scrumMaster: member.member === value })),
                      }))
                    }
                  >
                    {team.members.map((member) => (
                      <Radio key={member.member} value={member.member} data-testid="proposal-scrum-master">
                        {nameOf(member.member)}
                      </Radio>
                    ))}
                  </RadioGroup>
                ) : null}
                {groupProblems.length > 0 ? (
                  <GroupError id={errorId}>{groupProblems.map((problem) => problem.message).join(" ")}</GroupError>
                ) : null}
                <div className="pp-cluster">
                  <Select
                    label={`Team member to add to the ${lower} phase`}
                    items={choices.map((choice) => ({ id: choice.id, label: choice.label }))}
                    value={adding[phase.phase] ?? null}
                    onChange={(key) => setAdding((current) => ({ ...current, [phase.phase]: key === null ? "" : String(key) }))}
                    data-testid="proposal-team-member-choice"
                  />
                  <Button
                    variant="secondary"
                    aria-label={`Add team member to the ${lower} phase`}
                    isDisabled={!adding[phase.phase] || !choices.some((choice) => choice.id === adding[phase.phase])}
                    onPress={() => {
                      const member = adding[phase.phase];
                      if (!member) return;
                      setPhase(phase.phase, (current) => ({ ...current, members: [...current.members, { member, scrumMaster: false }] }));
                      setAdding((current) => ({ ...current, [phase.phase]: "" }));
                    }}
                    data-testid="proposal-add-team-member"
                  >
                    Add team member
                  </Button>
                </div>
                <div data-testid="proposal-phase-requirements">
                  <Text elementType="p" size="small">
                    {phaseRequirementsSentence({ ...shortfall, required: phase.requiredCapabilities })}
                  </Text>
                </div>
                <div data-testid="proposal-cost">
                  <NumberField
                    id={`proposal-${lower}-cost`}
                    label={`Proposed cost for the ${lower} phase`}
                    isRequired
                    description={phase.maxBudget > 0 ? `Up to the phase's maximum budget of ${dollars(phase.maxBudget)}.` : "Within the opportunity's maximum budget."}
                    formatOptions={COST_FORMAT}
                    value={team.proposedCost}
                    onChange={(value) => setPhase(phase.phase, (current) => ({ ...current, proposedCost: value }))}
                    isInvalid={costMessage !== undefined}
                    errorMessage={costMessage}
                    data-testid="proposal-phase-cost-field"
                  />
                </div>
              </Fieldset>
            );
          })}
        </FormPart>
      ) : (
        <FormPart id="form-team" title={next("Team")}>
          <p className="op-text">
            Name at least one team member against this opportunity's resources, with an hourly rate for each. Everyone you name must
            be an active member of the organization, and no one may be named twice.
          </p>
          {values.organization === "" ? <p className="op-text">Choose an organization to name its people.</p> : null}
          {problemFor("team") ? <GroupError id="proposal-team-error">{problemFor("team")}</GroupError> : null}
          {opportunity.resources.map((resource, resourceIndex) => {
            const number = resourceIndex + 1;
            const named = values.team.map((member, index) => ({ member, index })).filter(({ member }) => member.resource === resource.id);
            const choices = teamMemberChoices(program, people, values.team.map((member) => member.member));
            const key = `resource-${resource.id}`;
            return (
              <Fieldset key={resource.id || resourceIndex} legend={`Resource ${number}: ${areaName(resource.serviceArea)}, ${resource.targetAllocation}% of full time`}>
                {named.length > 0 ? (
                  <ul className="pp-rows" aria-label={`Resource ${number} team`}>
                    {named.map(({ member, index }) => {
                      const rateProblem = problemFor(`team.${index + 1}.hourlyRate`);
                      const otherProblems = problemsUnder(`team.${index + 1}`).filter((problem) => !problem.field.endsWith(".hourlyRate"));
                      const standing = standings.get(member.member);
                      const notActive = standing !== undefined && standing.membershipStatus !== "ACTIVE";
                      return (
                        <li key={member.member} className="pp-row" id={`proposal-team-member-${index + 1}`}>
                          <span className="pp-row-name">
                            {nameOf(member.member)}
                            {notActive ? (
                              <ProposalStatus testId="proposal-pending-team-member">
                                {standing.membershipStatus === "PENDING" ? "Membership pending" : "Not a member"}
                              </ProposalStatus>
                            ) : null}
                          </span>
                          <NumberField
                            id={`proposal-resource-${number}-rate-${index + 1}`}
                            label={`Hourly rate for ${nameOf(member.member)}`}
                            isRequired
                            description="At least $1."
                            formatOptions={RATE_FORMAT}
                            value={member.hourlyRate}
                            onChange={(value) =>
                              setValues((current) => ({
                                ...current,
                                team: current.team.map((each, at) => (at === index ? { ...each, hourlyRate: value } : each)),
                              }))
                            }
                            isInvalid={rateProblem !== undefined}
                            errorMessage={rateProblem}
                            aria-describedby={overContract ? "proposal-cost-error" : undefined}
                            data-testid="proposal-hourly-rate-field"
                          />
                          <Button
                            variant="tertiary"
                            size="small"
                            aria-label={`Remove ${nameOf(member.member)} from resource ${number}`}
                            onPress={() => setValues((current) => ({ ...current, team: current.team.filter((_each, at) => at !== index) }))}
                          >
                            Remove
                          </Button>
                          {otherProblems.length > 0 ? (
                            <div className="pp-row-error">
                              {otherProblems.map((problem) => (
                                <Text key={problem.message} elementType="p" size="small" color="danger">
                                  {problem.message}
                                </Text>
                              ))}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                <div className="pp-cluster">
                  <Select
                    label={`Team member to add to resource ${number}`}
                    items={choices.map((choice) => ({ id: choice.id, label: choice.label }))}
                    value={adding[key] ?? null}
                    onChange={(value) => setAdding((current) => ({ ...current, [key]: value === null ? "" : String(value) }))}
                    data-testid="proposal-team-member-choice"
                  />
                  <Button
                    variant="secondary"
                    aria-label={`Add team member to resource ${number}`}
                    isDisabled={!adding[key] || !choices.some((choice) => choice.id === adding[key])}
                    onPress={() => {
                      const member = adding[key];
                      if (!member) return;
                      setValues((current) => ({ ...current, team: [...current.team, { member, resource: resource.id, hourlyRate: Number.NaN }] }));
                      setAdding((current) => ({ ...current, [key]: "" }));
                    }}
                    data-testid="proposal-add-team-member"
                  >
                    Add team member
                  </Button>
                </div>
              </Fieldset>
            );
          })}
        </FormPart>
      )}

      {sprint ? (
        <FormPart id="form-capabilities" title={next("Capabilities")}>
          <p className="op-text">Between them, your phase teams must cover every capability this opportunity requires.</p>
          {requiredCapabilities.length > 0 ? (
            <ul className="op-list">
              {requiredCapabilities.map((capability) => (
                <li key={capability}>{`${capability}: ${heldCapabilities.has(capability) ? "covered" : "not covered"}`}</li>
              ))}
            </ul>
          ) : (
            <p className="op-text">This opportunity names no capabilities its phases require.</p>
          )}
          {uncovered.length > 0 && (anyoneNamed || attempted) ? (
            <GroupError id="proposal-capabilities-error" testId="proposal-capability-gap-error">
              {problemFor("team") ?? capabilityGapMessage(uncovered)}
            </GroupError>
          ) : null}
        </FormPart>
      ) : null}

      <FormPart id="form-cost" title={next("Cost")}>
        {sprint ? (
          <div role="status" data-testid="proposal-cost">
            <p className="op-text">{`Total proposed cost: ${dollars(swuTotalCost(swuInputOf(values, [])))} of the ${dollars(opportunity.value.amount)} maximum budget.`}</p>
            {costFor("totalProposedCost") ?? problemFor("totalProposedCost") ? (
              <GroupError id="proposal-cost-error" testId="proposal-budget-exceeded-error">
                {costFor("totalProposedCost") ?? problemFor("totalProposedCost")}
              </GroupError>
            ) : null}
          </div>
        ) : (
          <>
            <p className="op-text">
              {opportunity.completionDate
                ? `Each hourly rate is applied at its resource's target allocation across the contract, from ${dayLabel(opportunity.startDate)} to ${dayLabel(opportunity.completionDate)}. The total must not be more than the opportunity's maximum budget.`
                : "Each hourly rate is applied at its resource's target allocation across the contract. The total must not be more than the opportunity's maximum budget."}
            </p>
            <div role="status">
              <p className="op-text">
                {contractCost === null
                  ? "The contract has no completion date, so its cost cannot be estimated."
                  : `Estimated cost over the contract: ${dollars(contractCost)} of the ${dollars(opportunity.value.amount)} maximum budget.`}
              </p>
            </div>
            {overContract || problemFor("totalProposedCost") ? (
              <GroupError id="proposal-cost-error" testId="proposal-budget-exceeded-error">
                {overContract
                  ? `At these rates the contract would cost ${dollars(contractCost ?? 0)}, which is more than the opportunity's maximum budget of ${dollars(twu.maxBudget)}. Lower one or more hourly rates.`
                  : problemFor("totalProposedCost")}
              </GroupError>
            ) : null}
          </>
        )}
      </FormPart>

      <FormPart id="form-questions" title={next(sprint ? "Team questions" : "Resource questions")}>
        {opportunity.questions.length === 0 ? <p className="op-text">This opportunity asks no questions.</p> : null}
        {opportunity.questions.map((question, order) => {
          const number = order + 1;
          const response = values.responses[order] ?? "";
          const key = sprint ? "teamQuestionResponses" : "resourceQuestionResponses";
          const message = problemFor(`${key}.${order}.response`) ?? problemFor(`${key}.${order}.order`);
          return (
            <Fieldset key={order} legend={`Question ${number}`}>
              <p className="op-text">{question.question}</p>
              {question.guideline ? <p className="op-note">{question.guideline}</p> : null}
              <TextArea
                id={`proposal-question-${number}`}
                label={`Response to question ${number}`}
                isRequired
                description={`Up to ${question.wordLimit} words.`}
                value={response}
                onChange={(value) => setValues((current) => ({ ...current, responses: { ...current.responses, [order]: value } }))}
                isInvalid={message !== undefined}
                errorMessage={message}
                data-testid="proposal-question-response-field"
              />
              <div role="status">
                <p className="op-note">{`${wordCount(response)} of ${question.wordLimit} words`}</p>
              </div>
            </Fieldset>
          );
        })}
      </FormPart>

      {sprint ? (
        <FormPart id="form-references" title={next("References")}>
          {values.references.length === 0 ? <p className="op-text">No references have been added.</p> : null}
          {values.references.map((reference, index) => {
            const number = index + 1;
            const set = (patch: Partial<ReferenceInput>) =>
              setValues((current) => ({ ...current, references: current.references.map((each, at) => (at === index ? { ...each, ...patch } : each)) }));
            const message = (field: string) => problemFor(`references.${number}.${field}`);
            return (
              <Fieldset key={index} id={`proposal-reference-${number}`} legend={`Reference ${number}`}>
                <TextField label="Name" value={reference.name} onChange={(name) => set({ name })} isInvalid={message("name") !== undefined} errorMessage={message("name")} />
                <TextField
                  label="Company"
                  value={reference.company}
                  onChange={(company) => set({ company })}
                  isInvalid={message("company") !== undefined}
                  errorMessage={message("company")}
                />
                <TextField
                  label="Email address"
                  type="email"
                  value={reference.email}
                  onChange={(email) => set({ email })}
                  isInvalid={message("email") !== undefined}
                  errorMessage={message("email")}
                />
                <TextField
                  label="Phone number (optional)"
                  type="tel"
                  value={reference.phone}
                  onChange={(phone) => set({ phone })}
                  isInvalid={message("phone") !== undefined}
                  errorMessage={message("phone")}
                />
                <div>
                  <Button
                    variant="tertiary"
                    size="small"
                    onPress={() => setValues((current) => ({ ...current, references: current.references.filter((_each, at) => at !== index) }))}
                  >
                    {`Remove reference ${number}`}
                  </Button>
                </div>
              </Fieldset>
            );
          })}
          <div className="pf-attach">
            <Button
              variant="secondary"
              onPress={() => setValues((current) => ({ ...current, references: [...current.references, { name: "", company: "", phone: "", email: "" }] }))}
              data-testid="proposal-add-reference"
            >
              Add a reference
            </Button>
          </div>
        </FormPart>
      ) : null}

      <AttachmentControl state={attachments} headingLevel={2} host="proposal" saved={purpose === "edit"} part={next("Attachments")} />

      {purpose === "create" ? (
        <p className="op-text">You will be asked to accept the terms and conditions when you submit. You can withdraw a submitted proposal at any time.</p>
      ) : offerSubmit ? (
        <p className="op-text">Save changes keeps this proposal as it is. Save changes and submit asks you to accept the terms and conditions.</p>
      ) : null}
      {submitUnavailable && submitting ? (
        <p className="op-note" id="proposal-submit-unavailable">
          Submitting is available once every phase's team meets its requirements and every cost is within its budget.
        </p>
      ) : null}
    </ProposalFormPage>
  );
}
