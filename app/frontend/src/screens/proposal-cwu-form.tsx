import { ReactNode, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  Heading,
  Link,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Text,
  TextArea,
  TextField,
} from "@bcgov/design-system-react-components";
import { FILE_SIZE_LIMIT_LABEL } from "@rules/files";
import {
  CWU_PROPOSAL_FIELD_LABELS,
  CWU_PROPOSAL_FIELD_ORDER,
  CwuProposalField,
  CwuProposalInput,
  INDIVIDUAL_FIELDS,
  IndividualProponent,
  NOT_ACCEPTING_PROPOSALS,
  ProposalProblem,
  blankIndividual,
  cwuProposalProblems,
  proposalProblemFromLine,
  proposalStatusLabel,
} from "@rules/proposals";
import type { Attachment } from "../api/opportunities";
import type { ActingFor, CwuProposal, CwuProposalSubmission, ProposalSaveAnswer } from "../api/proposals";
import { AttachmentControl, useAttachments } from "../app/attachments";
import { FormPart, Focused, ProposalFormPage, ProposalStatus, type SummaryFacts } from "../app/proposal-kit";
import { useNarrow } from "../app/site-header";
import { TitledAlert } from "../app/titled-alert";

/**
 * The pieces the Code With Us proposal's create and manage pages share (design/DESIGN.md,
 * "Code With Us proposal form" and "Proposal screens in the chosen direction"): the status label,
 * the long form beside the opportunity summary with its error summary and refusals, and the terms
 * dialog every submission passes through.
 *
 * The create page is drawn in the original site's words (`proposal-cwu-create`); the manage page's
 * form in the words its `editing` story gives it. Both have the same fields, test IDs and rules.
 */

/** The state in words (`proposal-status`), coloured by the direction's status colours, never colour alone. */
export function ProposalStatusBadge({ status }: { status: string }) {
  return <ProposalStatus>{proposalStatusLabel(status)}</ProposalStatus>;
}

/** What the form holds while it is being filled in. */
export interface ProposalFormValues {
  /** Who is putting the proposal forward; nobody until the vendor chooses (decision record 0056). */
  readonly proponentType: "individual" | "organization" | null;
  readonly individual: IndividualProponent;
  readonly organization: string;
  readonly proposalText: string;
  readonly additionalComments: string;
}

export function blankValues(): ProposalFormValues {
  return { proponentType: null, individual: blankIndividual(), organization: "", proposalText: "", additionalComments: "" };
}

/** A draft kept with no proponent reads back as an individual with nothing entered: still unchosen. */
function proponentTypeOf(proponent: CwuProposal["proponent"]): ProposalFormValues["proponentType"] {
  if (proponent.tag === "organization") return "organization";
  return Object.values(proponent.value).some((value) => value.trim() !== "") ? "individual" : null;
}

export function valuesFrom(proposal: CwuProposal): ProposalFormValues {
  const { proponent } = proposal;
  return {
    proponentType: proponentTypeOf(proponent),
    individual: proponent.tag === "individual" ? proponent.value : blankIndividual(),
    organization: proponent.tag === "organization" ? proponent.value.id : "",
    proposalText: proposal.proposalText,
    additionalComments: proposal.additionalComments,
  };
}

export function submissionOf(values: ProposalFormValues, attachments: readonly string[]): CwuProposalSubmission {
  return {
    proposalText: values.proposalText,
    additionalComments: values.additionalComments,
    proponent:
      values.proponentType === "organization"
        ? { tag: "organization", value: values.organization }
        : { tag: "individual", value: values.individual },
    attachments,
  };
}

function inputOf(values: ProposalFormValues): CwuProposalInput {
  return { ...submissionOf(values, []) };
}

export const NO_PROPONENT_CHOSEN = "Choose whether an individual or an organization is submitting this proposal";

const PROPONENT_FIELDS: readonly CwuProposalField[] = [...INDIVIDUAL_FIELDS, "organization"];

/**
 * What stops these values being submitted (R-2.13, R-2.14): a proposal carries a complete
 * proponent, so one whose proponent has not been chosen at all is refused for that, alongside
 * whatever is wrong with the rest of it.
 */
export function submissionProblems(values: ProposalFormValues): ProposalProblem[] {
  const problems = cwuProposalProblems(inputOf(values));
  if (values.proponentType !== null) return problems;
  return [
    { field: "proponentType", message: NO_PROPONENT_CHOSEN },
    ...problems.filter((problem) => !PROPONENT_FIELDS.includes(problem.field)),
  ];
}

/** The element each field's error links to (design/DESIGN.md, "Forms and validation"). */
const FIELD_IDS: Readonly<Record<CwuProposalField, string>> = {
  proponentType: "proposal-proponent-type",
  legalName: "proposal-legal-name",
  email: "proposal-email",
  phone: "proposal-phone",
  street1: "proposal-street",
  street2: "proposal-street-2",
  city: "proposal-city",
  region: "proposal-region",
  mailCode: "proposal-postal",
  country: "proposal-country",
  organization: "proposal-organization",
  proposalText: "proposal-text",
  additionalComments: "proposal-comments",
  attachments: "form-attachments",
};

type Input = {
  readonly field: keyof IndividualProponent;
  readonly testId: string;
  readonly required: boolean;
  readonly type?: "email" | "tel";
};

const INPUTS: Readonly<Record<keyof IndividualProponent, Input>> = {
  legalName: { field: "legalName", testId: "proposal-legal-name-field", required: true },
  email: { field: "email", testId: "proposal-email-field", required: true, type: "email" },
  phone: { field: "phone", testId: "proposal-phone-field", required: false, type: "tel" },
  street1: { field: "street1", testId: "proposal-street-field", required: true },
  street2: { field: "street2", testId: "proposal-street-2-field", required: false },
  city: { field: "city", testId: "proposal-city-field", required: true },
  region: { field: "region", testId: "proposal-region-field", required: true },
  mailCode: { field: "mailCode", testId: "proposal-postal-field", required: true },
  country: { field: "country", testId: "proposal-country-field", required: true },
};

/** The individual's fields, one or two to a line, as both stories lay them out. */
const INDIVIDUAL_LINES: readonly (readonly (keyof IndividualProponent)[])[] = [
  ["legalName"],
  ["email", "phone"],
  ["street1"],
  ["street2"],
  ["city", "region"],
  ["mailCode", "country"],
];

/** Every word on the form that differs between the create page and the manage page's form. */
interface FormWords {
  readonly proponentQuestion: string;
  readonly individual: string;
  readonly organization: string;
  readonly labels: Readonly<Record<keyof IndividualProponent, string>>;
  readonly legalNameHelp?: string;
  readonly individualIntro?: string;
  readonly organizationHelp: string;
  readonly proposalIntro?: string;
  readonly proposalLabel: string;
  readonly proposalHelp: string;
  readonly commentsLabel: string;
  readonly commentsHelp: string;
  /** A length cap on the two text areas; none on the create page, where the service's refusal says it. */
  readonly maxLength?: number;
  readonly attachments?: { readonly limit: string; readonly add: string };
}

const CREATE_WORDS: FormWords = {
  proponentQuestion: "Will you be submitting a proposal for this opportunity as an Individual or Organization?",
  individual: "Individual",
  organization: "Organization",
  labels: {
    legalName: "Legal Name",
    email: "Email Address",
    phone: "Phone Number",
    street1: "Street Address",
    street2: "Street Address",
    city: "City",
    region: "Province / State",
    mailCode: "Postal / ZIP Code",
    country: "Country",
  },
  legalNameHelp:
    "Provide the first and last name of the individual that will complete the work as outlined in the opportunity’s acceptance criteria.",
  individualIntro:
    "Please provide the following details for the proponent that will complete the work as outlined by the Acceptance Criteria of the opportunity.",
  organizationHelp: "Select the Organization that will complete the work as outlined in the opportunity's acceptance criteria.",
  proposalIntro:
    "Enter your proposal and any additional comments in the spaces provided below. Be sure to address the Proposal Evaluation Criteria.",
  proposalLabel: "Proposal",
  proposalHelp: "Provide your complete proposal here. Be sure to address the Proposal Evaluation Criteria as outlined on the opportunity.",
  commentsLabel: "Additional Comments",
  commentsHelp: "Provide any additional information or comments that are relevant to your proposal submission.",
  attachments: {
    limit: `Upload any supporting material for your proposal here. Attachments must be smaller than ${FILE_SIZE_LIMIT_LABEL.replace(" ", "")}.`,
    add: "Add Attachment",
  },
};

const EDIT_WORDS: FormWords = {
  proponentQuestion: "Who is submitting this proposal?",
  individual: "An individual",
  organization: "An organization",
  labels: {
    legalName: "Legal name",
    email: "Email address",
    phone: "Phone number (optional)",
    street1: "Street address",
    street2: "Street address line 2 (optional)",
    city: "City",
    region: "Province or state",
    mailCode: "Postal code",
    country: "Country",
  },
  organizationHelp: "Organizations you own or administer. An organization can be named on only one proposal for each opportunity.",
  proposalLabel: "Proposal",
  proposalHelp: "Between 1 and 10,000 characters.",
  commentsLabel: "Additional comments (optional)",
  commentsHelp: "Up to 10,000 characters.",
  maxLength: 10000,
};

/** "Legal name: enter your legal name"; a sentence the service words itself is kept as it is. */
export function summaryLine(problem: ProposalProblem): string {
  const message = problem.message.endsWith(".") ? problem.message : problem.message.charAt(0).toLowerCase() + problem.message.slice(1);
  return `${CWU_PROPOSAL_FIELD_LABELS[problem.field]}: ${message}`;
}

/**
 * The error summary, in the original site's words, focused when it appears: every problem, each a
 * link to its field (`field-error`) naming the field and its message, in a list that carries
 * `proposal-field-errors`.
 */
export function ProblemSummary({ problems, action = "submit" }: { problems: readonly ProposalProblem[]; action?: "submit" | "save" }) {
  const ordered = [...problems].sort((a, b) => CWU_PROPOSAL_FIELD_ORDER.indexOf(a.field) - CWU_PROPOSAL_FIELD_ORDER.indexOf(b.field));
  const submitting = action === "submit";
  return (
    <Focused>
      <TitledAlert variant="danger" role="alert" title={submitting ? "Unable to Submit Proposal" : "Unable to Save Proposal"}>
        <Text elementType="p">
          {submitting
            ? "Your Code With Us proposal could not be submitted. Please fix any errors in the form and try again."
            : "Your Code With Us proposal could not be saved. Please fix any errors in the form and try again."}
        </Text>
        <ul className="pp-errors" data-testid="proposal-field-errors">
          {ordered.map((problem) => (
            <li key={problem.field} data-testid="field-error">
              <Link href={`#${FIELD_IDS[problem.field]}`}>{summaryLine(problem)}</Link>
            </li>
          ))}
        </ul>
      </TitledAlert>
    </Focused>
  );
}

/**
 * The terms dialog (`proposal-terms-dialog`): both the program's terms and the service's, each
 * ticked, before Submit proposal (`proposal-submit-confirm`) does anything (R-2.3). The Code With
 * Us create page asks in the original site's words; every other proposal page in the words its own
 * stories give.
 */
export function TermsDialog({
  isOpen,
  isSending,
  onCancel,
  onConfirm,
  programName = "Code With Us",
  programTerms = "/content/code-with-us-terms-and-conditions",
  original = false,
}: {
  readonly isOpen: boolean;
  readonly isSending: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  /** The program whose terms are asked for, and the page they are on. */
  readonly programName?: string;
  readonly programTerms?: string;
  /** In the original site's words ("Review Terms and Conditions"). */
  readonly original?: boolean;
}) {
  const [program, setProgram] = useState(false);
  const [service, setService] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setProgram(false);
      setService(false);
    }
  }, [isOpen]);
  const confirm = (label: string) => (
    <Button
      variant="primary"
      isDisabled={!program || !service || isSending}
      aria-describedby={original ? undefined : "proposal-terms-hint"}
      onPress={onConfirm}
      data-testid="proposal-submit-confirm"
    >
      {label}
    </Button>
  );
  const cancel = (
    <Button variant="secondary" isDisabled={isSending} onPress={onCancel} data-testid="proposal-dialog-cancel">
      Cancel
    </Button>
  );
  return (
    <Modal isOpen={isOpen} isDismissable onOpenChange={(open) => (!open && !isSending ? onCancel() : undefined)}>
      <Dialog isCloseable data-testid="proposal-terms-dialog">
        {original ? (
          <div className="pp-dialog">
            <Heading level={2} slot="title" className="pf-part-title">
              Review Terms and Conditions
            </Heading>
            <Text elementType="p">
              Please ensure you have reviewed the <Link href={programTerms}>{`${programName} Terms & Conditions`}</Link> and{" "}
              <Link href="/content/terms-and-conditions">Digital Marketplace Terms &amp; Conditions for E-Bidding</Link> prior to
              submitting your proposal for this {programName} opportunity.
            </Text>
            <Checkbox isRequired isSelected={program} onChange={setProgram} data-testid="proposal-accept-program-terms">
              I acknowledge that I have read, fully understand and agree to the <em>{`${programName} Terms & Conditions`}</em>.
            </Checkbox>
            <Checkbox isRequired isSelected={service} onChange={setService} data-testid="proposal-accept-app-terms">
              I acknowledge that I have read, fully understand and agree to the <em>Digital Marketplace Terms &amp; Conditions for E-Bidding</em>.
            </Checkbox>
            <ButtonGroup ariaLabel="Submit choices">
              {confirm("Submit Proposal")}
              {cancel}
            </ButtonGroup>
          </div>
        ) : (
          <div className="pp-dialog">
            <Heading level={2} slot="title" className="pf-part-title">
              Submit your proposal
            </Heading>
            <Text elementType="p">
              {`To submit, accept the ${programName} terms and conditions and the Digital Marketplace terms and conditions. Your acceptance is recorded when you submit.`}
            </Text>
            <Text elementType="p">
              Read the <Link href={programTerms}>{`${programName} terms and conditions`}</Link> and the{" "}
              <Link href="/content/terms-and-conditions">Digital Marketplace terms and conditions</Link>.
            </Text>
            <Checkbox isRequired isSelected={program} onChange={setProgram} data-testid="proposal-accept-program-terms">
              {`I accept the ${programName} terms and conditions`}
            </Checkbox>
            <Checkbox isRequired isSelected={service} onChange={setService} data-testid="proposal-accept-app-terms">
              I accept the Digital Marketplace terms and conditions
            </Checkbox>
            <p id="proposal-terms-hint" className="op-note">
              Tick both boxes to submit.
            </p>
            <ButtonGroup ariaLabel="Submit choices">
              {cancel}
              {confirm("Submit proposal")}
            </ButtonGroup>
          </div>
        )}
      </Dialog>
    </Modal>
  );
}

/** What the form asks its page to do: keep it as it is, or put it forward. */
export type ProposalFormAction = "save" | "submit";

/**
 * A refusal the screen could not prevent, said above the form: the deadline having passed, a
 * second proposal (with a way to the first), or anything else the service said.
 */
export interface Refusal {
  readonly title: string;
  readonly reasons: readonly string[];
  readonly existingProposalId?: string;
}

export function CwuProposalForm({
  purpose,
  opportunityId,
  head,
  intro,
  summary,
  initial,
  initialAttachments = [],
  organizations,
  onSend,
  onSaved,
  onCancel,
  refusalTitle,
  accepting = true,
}: {
  readonly purpose: "create" | "edit";
  readonly opportunityId: string;
  /** The H1 and what sits with it. */
  readonly head: ReactNode;
  /** The sentences that introduce the form. */
  readonly intro: ReactNode;
  /** The opportunity beside the form, which holds the actions on a wide screen. */
  readonly summary: SummaryFacts;
  readonly initial: ProposalFormValues;
  readonly initialAttachments?: readonly Attachment[];
  /** The organizations the vendor owns or administers, and the one already named if it is not among them. */
  readonly organizations: readonly ActingFor[];
  /** Sends the form; for a submission, once the terms have been accepted in the dialog. */
  readonly onSend: (action: ProposalFormAction, submission: CwuProposalSubmission) => Promise<ProposalSaveAnswer>;
  readonly onSaved: (proposal: CwuProposal, action: ProposalFormAction) => void;
  readonly onCancel: () => void;
  readonly refusalTitle: string;
  /** Whether the opportunity still takes proposals; when it does not, a submission goes unchecked to the service. */
  readonly accepting?: boolean;
}) {
  const narrow = useNarrow();
  const words = purpose === "create" ? CREATE_WORDS : EDIT_WORDS;
  const [values, setValues] = useState<ProposalFormValues>(initial);
  const [problems, setProblems] = useState<readonly ProposalProblem[]>([]);
  const [problemsFrom, setProblemsFrom] = useState<ProposalFormAction>("submit");
  // Each new set of problems or refusal is a new message, focused as it appears.
  const [messageVersion, setMessageVersion] = useState(0);
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [existingNamed, setExistingNamed] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const attachments = useAttachments(initialAttachments);

  const problemFor = (field: CwuProposalField) => problems.find((problem) => problem.field === field)?.message;
  const invalid = (field: CwuProposalField) => ({ isInvalid: problemFor(field) !== undefined, errorMessage: problemFor(field) });
  const change = (next: Partial<ProposalFormValues>) => setValues((current) => ({ ...current, ...next }));
  const changeIndividual = (field: keyof IndividualProponent, value: string) =>
    setValues((current) => ({ ...current, individual: { ...current.individual, [field]: value } }));

  async function send(action: ProposalFormAction) {
    if (sending) return;
    setRefusal(null);
    setExistingNamed(null);
    setSending(true);
    const stored = await attachments.store();
    if (!stored.ok) {
      setSending(false);
      setAsking(false);
      return;
    }
    const answer = await onSend(action, submissionOf(values, stored.ids));
    setSending(false);
    setAsking(false);
    if (answer.kind === "saved") {
      setProblems([]);
      onSaved(answer.proposal, action);
      return;
    }
    setMessageVersion((version) => version + 1);
    if (answer.kind === "failed") {
      setRefusal({ title: refusalTitle, reasons: ["The service could not save it. Nothing you entered has been lost. Try again."] });
      return;
    }
    const named = answer.reasons.map(proposalProblemFromLine).filter((problem): problem is ProposalProblem => problem !== null);
    setProblems(named);
    setProblemsFrom(action);
    if (answer.existingOrganizationProposalId) setExistingNamed(answer.existingOrganizationProposalId);
    const rest = answer.reasons.filter((reason) => proposalProblemFromLine(reason) === null);
    if (rest.length > 0 || named.length === 0) {
      setRefusal({
        title: refusalTitle,
        reasons: rest,
        ...(answer.existingProposalId ? { existingProposalId: answer.existingProposalId } : {}),
      });
    }
  }

  function attempt(action: ProposalFormAction) {
    if (action === "save") {
      setProblems([]);
      void send("save");
      return;
    }
    // Everything a submission needs is checked here first; the terms are asked for only then. Once
    // the opportunity has closed nothing is worth completing: the service's refusal says why (R-2.15).
    const found = accepting ? submissionProblems(values) : [];
    setProblems(found);
    setProblemsFrom("submit");
    setMessageVersion((version) => version + 1);
    setRefusal(null);
    if (found.length === 0) setAsking(true);
  }

  const messages = (
    <>
      {problems.length > 0 ? <ProblemSummary key={`problems-${messageVersion}`} problems={problems} action={problemsFrom} /> : null}
      {refusal ? (
        <Focused key={`refusal-${messageVersion}`} testId="proposal-refused-message">
          <TitledAlert variant="danger" role="alert" title={refusal.title}>
            {(refusal.reasons.length > 0 ? refusal.reasons : ["The service refused it."]).map((reason) => (
              <Text elementType="p" key={reason}>
                {reason}
              </Text>
            ))}
            {refusal.existingProposalId ? (
              <Link href={`/opportunities/code-with-us/${opportunityId}/proposals/${refusal.existingProposalId}/edit`}>
                Open your proposal
              </Link>
            ) : null}
          </TitledAlert>
        </Focused>
      ) : null}
    </>
  );

  const actions =
    purpose === "create" ? (
      <>
        <Button variant="primary" size="medium" isDisabled={sending} onPress={() => attempt("submit")} data-testid="proposal-submit">
          Submit
        </Button>
        <Button variant="secondary" size="medium" isDisabled={sending} onPress={() => attempt("save")} data-testid="proposal-save-draft">
          Save Draft
        </Button>
        <Button variant="tertiary" size="medium" onPress={onCancel} data-testid="proposal-cancel">
          Cancel
        </Button>
      </>
    ) : (
      <>
        <Button variant="primary" size="medium" isDisabled={sending} onPress={() => attempt("submit")} data-testid="proposal-save-and-submit">
          Save changes and submit
        </Button>
        <Button variant="secondary" size="medium" isDisabled={sending} onPress={() => attempt("save")} data-testid="proposal-save-changes">
          Save changes
        </Button>
        <Button variant="tertiary" size="medium" onPress={onCancel} data-testid="proposal-cancel-edit">
          Cancel
        </Button>
      </>
    );

  const textField = (name: keyof IndividualProponent) => {
    const input = INPUTS[name];
    return (
      <TextField
        key={name}
        id={FIELD_IDS[name]}
        label={words.labels[name]}
        description={name === "legalName" ? words.legalNameHelp : undefined}
        isRequired={input.required}
        type={input.type}
        value={values.individual[name]}
        onChange={(value) => changeIndividual(name, value)}
        {...invalid(name)}
        data-testid={input.testId}
      />
    );
  };

  return (
    <ProposalFormPage
      head={head}
      messages={messages}
      intro={intro}
      summary={summary}
      actions={actions}
      onSubmit={() => attempt("submit")}
      dialogs={
        <TermsDialog
          isOpen={asking}
          isSending={sending}
          original={purpose === "create"}
          onCancel={() => setAsking(false)}
          onConfirm={() => void send("submit")}
        />
      }
    >
      <FormPart id="form-proponent" title="1. Proponent">
        <RadioGroup
          id={FIELD_IDS.proponentType}
          label={words.proponentQuestion}
          orientation={purpose === "create" && !narrow ? "horizontal" : "vertical"}
          isRequired
          value={values.proponentType}
          onChange={(value) => change({ proponentType: value === "organization" ? "organization" : "individual" })}
          {...invalid("proponentType")}
        >
          <Radio value="individual" data-testid="proposal-proponent-individual">
            {words.individual}
          </Radio>
          <Radio value="organization" data-testid="proposal-proponent-organization">
            {words.organization}
          </Radio>
        </RadioGroup>
        {values.proponentType === "individual" ? (
          <>
            {words.individualIntro ? <p className="pf-text">{words.individualIntro}</p> : null}
            {INDIVIDUAL_LINES.map((line) =>
              line.length === 1 ? (
                textField(line[0]!)
              ) : (
                <div key={line.join("-")} className="pf-pair">
                  {line.map(textField)}
                </div>
              ),
            )}
          </>
        ) : values.proponentType === "organization" ? (
          <>
            <Select
              id={FIELD_IDS.organization}
              label="Organization"
              placeholder={purpose === "create" ? "Organization" : undefined}
              isRequired
              description={words.organizationHelp}
              items={organizations.map((organization) => ({ id: organization.id, label: organization.legalName }))}
              value={values.organization === "" ? null : values.organization}
              onChange={(key) => change({ organization: key === null ? "" : String(key) })}
              {...invalid("organization")}
              data-testid="proposal-organization-field"
            />
            {purpose === "create" ? (
              <Text elementType="p" size="small" color="secondary">
                If the organization you are looking for is not listed in this dropdown, please ensure that you have created the
                organization in <Link href="/users/me?tab=organizations">your user profile</Link>. Also, please make sure that you
                have saved this proposal beforehand to avoid losing any unsaved changes you might have made.
              </Text>
            ) : organizations.length === 0 ? (
              <Text elementType="p" size="small">
                You do not own or administer an organization. <Link href="/organizations/create">Register one</Link>, or propose
                as an individual.
              </Text>
            ) : null}
            {existingNamed ? (
              <Text elementType="p" size="small">
                {`${organizationName(organizations, values.organization)} already has a proposal for this opportunity. `}
                <Link href={`/opportunities/code-with-us/${opportunityId}/proposals/${existingNamed}/edit`}>Open the existing proposal</Link>
              </Text>
            ) : null}
          </>
        ) : (
          <p className="pf-text">
            Choose Individual to enter a legal name, email address and postal address, or Organization to choose one you own or
            administer.
          </p>
        )}
      </FormPart>

      <FormPart id="form-proposal" title="2. Proposal">
        {words.proposalIntro ? <p className="pf-text">{words.proposalIntro}</p> : null}
        <div className="pf-proposal">
          <TextArea
            id={FIELD_IDS.proposalText}
            label={words.proposalLabel}
            isRequired
            maxLength={words.maxLength}
            description={words.proposalHelp}
            value={values.proposalText}
            onChange={(value) => change({ proposalText: value })}
            {...invalid("proposalText")}
            data-testid="proposal-text-field"
          />
        </div>
        <div className="pf-comments">
          <TextArea
            id={FIELD_IDS.additionalComments}
            label={words.commentsLabel}
            maxLength={words.maxLength}
            description={words.commentsHelp}
            value={values.additionalComments}
            onChange={(value) => change({ additionalComments: value })}
            {...invalid("additionalComments")}
            data-testid="proposal-comments-field"
          />
        </div>
      </FormPart>

      <AttachmentControl
        state={attachments}
        headingLevel={2}
        host="proposal"
        saved={purpose === "edit"}
        part="3. Attachments"
        words={words.attachments}
      />

      {purpose === "edit" ? (
        <p className="pf-text">Save changes keeps this proposal as it is. Save changes and submit asks you to accept the terms and conditions.</p>
      ) : null}
    </ProposalFormPage>
  );
}

function organizationName(organizations: readonly ActingFor[], id: string): string {
  return organizations.find((organization) => organization.id === id)?.legalName ?? "That organization";
}

/** Whether a refusal is the deadline having passed, which the manage page says in its own alert (R-2.15). */
export function isDeadlineRefusal(reasons: readonly string[]): boolean {
  return reasons.includes(NOT_ACCEPTING_PROPOSALS);
}
