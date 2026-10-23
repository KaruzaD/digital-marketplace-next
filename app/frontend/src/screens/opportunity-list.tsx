import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  Heading,
  Link,
  Select,
  SvgChevronDownIcon,
  Text,
  TextField,
} from "@bcgov/design-system-react-components";
import { PROGRAMS, PROGRAM_NAMES, Program, isProgram } from "@rules/opportunities";
import {
  ListFilters,
  ListGroup,
  NO_FILTERS,
  STATUS_FILTERS,
  StatusFilter,
  groupedForList,
  isNarrowed,
  isStatusFilter,
  listStatusWords,
  matchesFilters,
  mayWatch,
} from "@rules/opportunity-list";
import { Account, changeOwnAccount } from "../api/accounts";
import { LIST_RETRY_DELAYS_MS, ListedOpportunity, listAllOpportunities } from "../api/opportunity-list";
import { setWatching } from "../api/watching";
import { Hidden, Label, OpportunityRows, RowOpportunity, look } from "../app/marketplace";
import { NoticeRow, NotificationStyles, SaveStatus } from "../app/notification-kit";
import { OpportunityStyles, Panel, Waiting, statusColour } from "../app/opportunity-kit";
import { useLoadingShown } from "../app/loading";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { holdAccount, useSession } from "../auth/session";
import { deadlineLabel, rewardLabel } from "./opportunity-parts";

/**
 * The opportunity list, at `/opportunities` (opportunity-list, notification-optin-opportunity-list),
 * as `design/catalogue/opportunity-list-page.tsx` draws it.
 *
 * Anyone reads it. What it holds is what the service lets the person read: published
 * opportunities, and to public sector staff their own unpublished ones and to administrators every
 * one (R-1.2, R-1.3). They are grouped into unpublished, open and closed, each in its own order
 * (R-1.38). Closed and Unpublished start closed, as on the original site, each opened by the
 * button in its heading. The list is narrowed by program, by state (staff only, as on the original
 * site), remote work and words in the title or location, every condition at once (R-1.39).
 *
 * A signed-in person may watch any opportunity they did not create from its row (R-1.5), and turn
 * the new-opportunity emails on or off from the control at the head of the results, which saves at
 * once with no question asked and is there at every width (R-6.21, R-6.27).
 */
type Listing =
  | { readonly kind: "loading" }
  | { readonly kind: "listed"; readonly opportunities: readonly ListedOpportunity[] }
  | { readonly kind: "failed" };

const PROGRAM_ITEMS = [
  { id: "all", label: "All Opportunity Types" },
  ...PROGRAMS.map((program) => ({ id: program, label: PROGRAM_NAMES[program] })),
];

// The original site's state filter, offered to staff only, in its words.
const STATUS_WORDS: Readonly<Record<StatusFilter, string>> = {
  draft: "Draft",
  "under-review": "Under Review",
  published: "Published",
  evaluation: "Evaluation",
  awarded: "Awarded",
};

const STATUS_ITEMS = [
  { id: "all", label: "All Opportunity Statuses" },
  ...STATUS_FILTERS.map((filter) => ({ id: filter, label: STATUS_WORDS[filter] })),
];

// The original site's one-line description of each program, in its order.
const PROGRAM_TEXT: readonly { id: Program; text: string }[] = [
  { id: "code-with-us", text: "Code With Us opportunities pay a fixed price for meeting acceptance criteria." },
  {
    id: "team-with-us",
    text: "Team With Us opportunities are for registered organizations that are pre-qualified to supply individual resources for a given service area (e.g., Full-Stack Developer).",
  },
  { id: "sprint-with-us", text: "Sprint With Us opportunities are for registered organizations that can supply teams." },
];

/** The words a group says when it has nothing to show: a search that matched nothing told apart from an empty group. */
export function emptyGroupWords(group: ListGroup, narrowed: boolean): string {
  if (narrowed) return `There are no ${group} opportunities that match your search criteria.`;
  return {
    open: "There are currently no open opportunities. Check back soon!",
    closed: "There are currently no closed opportunities.",
    unpublished: "There are currently no unpublished opportunities.",
  }[group];
}

/** An opportunity as the list's rows show it, every fact in words, its status as the person is shown it. */
export function asListRow(opportunity: ListedOpportunity, group: ListGroup, now: Date, asStaff: boolean): RowOpportunity {
  const words = listStatusWords(opportunity, now, asStaff);
  return {
    id: opportunity.id,
    program: opportunity.program,
    title: opportunity.title || "Untitled opportunity",
    summary: opportunity.teaser,
    status: { label: words, colour: statusColour(words) },
    closed: group === "closed",
    deadline: deadlineLabel(opportunity.proposalDeadline),
    value: rewardLabel(opportunity.value.amount),
    location: opportunity.location,
    remoteOk: opportunity.remoteOk,
  };
}

// The heading and the rhythm. Wide: the H1 in the design system's H2 size, a 240-pixel sidebar 48
// pixels from the results. Narrow: the H1 in its H3 size, one column. The switch follows the width
// of the page's own container.
const css = `
.list-page { container-type: inline-size; }
.list-frame { display: flex; flex-direction: column; gap: var(--layout-margin-medium); }
.list-frame > * { margin: var(--layout-margin-none); }
.list-heading { font: var(--typography-bold-h3); color: var(--typography-color-primary); }
.list-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "search" "filters" "results" "programs";
  gap: var(--layout-margin-medium);
}
.list-search { grid-area: search; }
.list-search > div, .list-search > div > * { width: 100%; }
.list-filters {
  grid-area: filters;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-medium) var(--layout-margin-large);
}
.list-filters > .list-select { flex: 1 1 100%; }
.list-filters > .list-select > * { width: 100%; }
.list-results, .list-group, .list-group-body, .list-empty {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-medium);
}
.list-results { grid-area: results; }
.list-results > *, .list-group > *, .list-group-body > *, .list-empty > * { margin: var(--layout-margin-none); }
.list-group-body[hidden] { display: none; }
.list-count { display: flex; align-items: center; gap: var(--layout-margin-small); }
.list-closed { padding-top: var(--layout-padding-medium); }
.list-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--layout-margin-medium);
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: start;
}
.list-toggle:focus-visible {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
  border-radius: var(--layout-border-radius-small);
}
.list-toggle[aria-expanded="true"] > svg { transform: rotate(180deg); }
.list-message { font: var(--typography-regular-body); color: var(--typography-color-primary); }
.list-programs {
  grid-area: programs;
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-medium);
  padding-top: var(--layout-padding-large);
  border-top: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.list-program { display: flex; flex-direction: column; align-items: flex-start; gap: var(--layout-margin-small); }
.list-program > * { margin: var(--layout-margin-none); }
.list-program-name { font: var(--typography-bold-small-body); color: var(--typography-color-primary); }
.list-program-text { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
@media (max-width: 767.98px) {
  .list-clear > button { width: 100%; }
}
@media (min-width: 768px) {
  .list-frame { gap: var(--layout-margin-huge); }
  .list-heading { font: var(--typography-bold-h2); }
}
@container (min-width: 720px) {
  .list-layout {
    grid-template-columns: 240px minmax(0, 1fr);
    grid-template-areas: "filters search" "filters results" "programs results";
    grid-template-rows: auto auto 1fr;
    column-gap: var(--layout-margin-xxxlarge);
    align-items: start;
  }
  .list-filters { flex-direction: column; align-items: flex-start; flex-wrap: nowrap; gap: var(--layout-margin-large); }
  .list-filters > .list-select { flex: none; align-self: stretch; }
  .list-programs { margin-top: var(--layout-margin-small); }
}
`;

export function OpportunityListScreen() {
  useScreenTitle("Opportunities");
  const session = useSession();
  const ready = session.status !== "starting";
  const account = session.status === "signed-in" ? session.account : null;
  const viewerId = account?.id ?? null;
  const [listing, setListing] = useState<Listing>({ kind: "loading" });
  // The home page's search arrives as `?q=`, and starts the list narrowed to it.
  const searchStr = useRouterState({ select: (state) => state.location.searchStr });
  const [filters, setFilters] = useState<ListFilters>(() => ({
    ...NO_FILTERS,
    search: new URLSearchParams(searchStr).get("q") ?? "",
  }));
  // A watch the person has just changed, shown before the list is read again.
  const [watched, setWatched] = useState<Readonly<Record<string, boolean>>>({});
  const [watchFailed, setWatchFailed] = useState<string | null>(null);
  const searchField = useRef<HTMLDivElement>(null);

  // What the service lists depends on who asks. The list is asked for at once, beside the question
  // of who is asking — the browser asks both with the same sign-in — and its answer is kept when
  // the session is known. It is asked again only if who is asking changes after that (decision
  // record 0039).
  const asking = useRef<{ whom: string | null | undefined; serial: number } | null>(null);
  const serial = useRef(0);
  useEffect(() => {
    const whom = ready ? viewerId : undefined;
    const current = asking.current;
    if (current && (current.whom === whom || current.whom === undefined)) {
      current.whom = whom;
      return;
    }
    const mine = ++serial.current;
    asking.current = { whom, serial: mine };
    setListing({ kind: "loading" });
    setWatched({});
    void listAllOpportunities(LIST_RETRY_DELAYS_MS).then((answer) => {
      if (asking.current?.serial === mine) setListing(answer.kind === "listed" ? answer : { kind: "failed" });
    });
  }, [ready, viewerId]);

  const shown = useMemo(
    () => (listing.kind === "listed" ? listing.opportunities.filter((opportunity) => matchesFilters(opportunity, filters)) : []),
    [listing, filters],
  );

  // Who is asking decides the groups, so the list is drawn once both are known.
  const loading = listing.kind === "loading" || !ready;
  const loadingShown = useLoadingShown(loading);
  // Drawn whole once it has arrived; the loading state only if that takes a while (decision record 0039).
  if (loading && !loadingShown) return null;

  const asStaff = account?.type === "GOV" || account?.type === "ADMIN";
  const narrowed = isNarrowed(filters);
  const now = new Date();
  const groups = groupedForList(shown, now);
  const byKey = new Map(shown.map((opportunity) => [`${opportunity.program}-${opportunity.id}`, opportunity]));

  async function toggleWatch(opportunity: ListedOpportunity, value: boolean) {
    setWatchFailed(null);
    setWatched((before) => ({ ...before, [opportunity.id]: value }));
    if (!(await setWatching(opportunity.program, opportunity.id, value))) {
      setWatched((before) => ({ ...before, [opportunity.id]: !value }));
      setWatchFailed(opportunity.title || "this opportunity");
    }
  }

  const watchOf = (row: RowOpportunity): ReactNode => {
    const opportunity = byKey.get(`${row.program}-${row.id}`);
    if (!opportunity || !mayWatch(account, { createdBy: opportunity.createdBy?.id ?? null })) return null;
    return (
      <Checkbox
        isSelected={watched[opportunity.id] ?? opportunity.subscribed}
        onChange={(value) => void toggleWatch(opportunity, value)}
        aria-label={`Watch ${row.title}`}
        data-testid="opportunity-watch-toggle"
      >
        Watch
      </Checkbox>
    );
  };

  const rows = (group: ListGroup) => (
    <OpportunityRows
      opportunities={groups[group].map((opportunity) => asListRow(opportunity, group, now, asStaff))}
      titleLevel={3}
      withTestIds
      watch={watchOf}
    />
  );

  const reset = () => setFilters(NO_FILTERS);
  // Clear search empties the search field and returns focus to it; the filters stay as they are.
  const clearSearch = () => {
    setFilters((before) => ({ ...before, search: "" }));
    searchField.current?.querySelector("input")?.focus();
  };

  return (
    <>
      <OpportunityStyles />
      <NotificationStyles />
      <style>{css}</style>
      <div className="list-page">
        <div className="list-frame">
          <Heading level={1} className="list-heading">
            Welcome to the Digital Marketplace
          </Heading>
          <div className="list-layout">
            <form className="list-search" role="search" aria-label="Opportunities" onSubmit={(event) => event.preventDefault()}>
              <div ref={searchField}>
                <TextField
                  type="search"
                  label="Search by Title or Location"
                  value={filters.search}
                  onChange={(search) => setFilters((before) => ({ ...before, search }))}
                  data-testid="opportunity-search"
                />
              </div>
            </form>

            <div className="list-filters" role="group" aria-label="Filter opportunities">
              <div className="list-select">
                <Select
                  label="Filter Opportunities"
                  items={PROGRAM_ITEMS}
                  value={filters.program}
                  onChange={(key) => setFilters((before) => ({ ...before, program: isProgram(key) ? (key as Program) : "all" }))}
                  data-testid="opportunity-filter-program"
                />
              </div>
              {asStaff ? (
                <div className="list-select">
                  <Select
                    label="Opportunity Status"
                    items={STATUS_ITEMS}
                    value={filters.status}
                    onChange={(key) => setFilters((before) => ({ ...before, status: isStatusFilter(key) ? key : "all" }))}
                    data-testid="opportunity-filter-status"
                  />
                </div>
              ) : null}
              <Checkbox
                isSelected={filters.remoteOnly}
                onChange={(remoteOnly) => setFilters((before) => ({ ...before, remoteOnly }))}
                data-testid="opportunity-filter-remote"
              >
                Remote OK
              </Checkbox>
              <Button variant="tertiary" size="medium" onPress={reset}>
                Reset
              </Button>
            </div>

            <div className="list-results">
              {account ? <NewOpportunityNotices account={account} /> : null}
              {watchFailed ? (
                <TitledAlert variant="danger" role="alert" title="Your choice could not be saved">
                  <Text elementType="p">{`Whether you watch ${watchFailed} has not changed. Please try again.`}</Text>
                </TitledAlert>
              ) : null}
              {loading ? (
                <Waiting label="Loading opportunities" />
              ) : listing.kind === "failed" ? (
                <TitledAlert variant="danger" role="alert" title="The opportunities could not be loaded">
                  <Text elementType="p">Reload the page to try again.</Text>
                </TitledAlert>
              ) : (
                <>
                  {asStaff || groups.unpublished.length > 0 ? (
                    <Disclosure title="Unpublished Opportunities" testId="opportunity-group-unpublished">
                      {groups.unpublished.length ? rows("unpublished") : <Empty words={emptyGroupWords("unpublished", narrowed)} />}
                    </Disclosure>
                  ) : null}

                  <section className="list-group" aria-labelledby="list-open-heading" data-testid="opportunity-group-open">
                    <Heading level={2} id="list-open-heading" className="list-count" style={look.section}>
                      Open Opportunities
                      {groups.open.length ? <Label>{groups.open.length}</Label> : null}
                    </Heading>
                    {/* A polite status that is always present, so its message is announced when the results change. */}
                    <div role="status" className="list-empty">
                      {groups.open.length ? null : <Empty words={emptyGroupWords("open", narrowed)} />}
                    </div>
                    {groups.open.length ? rows("open") : null}
                    {!groups.open.length && filters.search.trim() ? (
                      <div className="list-clear">
                        <Button variant="secondary" size="medium" onPress={clearSearch}>
                          Clear search
                        </Button>
                      </div>
                    ) : null}
                  </section>

                  {/* Starts closed, as the original site's does; the heading's button shows its rows. */}
                  <Disclosure title="Closed Opportunities" testId="opportunity-group-closed">
                    {groups.closed.length ? rows("closed") : <Empty words={emptyGroupWords("closed", narrowed)} />}
                  </Disclosure>
                </>
              )}
            </div>

            <section className="list-programs" aria-label="The three programs">
              {PROGRAM_TEXT.map(({ id, text }) => (
                <div key={id} className="list-program">
                  <Heading level={2} className="list-program-name">
                    {PROGRAM_NAMES[id]}
                  </Heading>
                  <p className="list-program-text">{text}</p>
                  <Link href={`/learn-more/${id}`} size="small">
                    Learn More<Hidden> about {PROGRAM_NAMES[id]}</Hidden>
                  </Link>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * A group whose heading holds a button that shows or hides the group's rows (the disclosure
 * pattern), the chevron turning to say which. The rows stay in the document while hidden, and the
 * group keeps its test ID either way. It starts closed unless `defaultOpen` says otherwise.
 */
function Disclosure({
  title,
  testId,
  defaultOpen = false,
  children,
}: {
  title: string;
  testId: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <section className="list-group list-closed" aria-label={title} data-testid={testId}>
      <Heading level={2} style={look.section}>
        <button
          type="button"
          className="list-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {title}
          <SvgChevronDownIcon />
        </button>
      </Heading>
      <div id={bodyId} className="list-group-body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

function Empty({ words }: { words: string }) {
  return <p className="list-message">{words}</p>;
}

/**
 * The new-opportunity emails, turned on or off from the list itself (R-6.21), as
 * `design/catalogue/notification-kit.tsx` draws the control. Pressing the button saves at once,
 * either way, with no question asked; the button then offers the opposite choice, focus stays on
 * it, and the change is announced. It is shown at every width (R-6.27). A new account starts with
 * the emails off until its holder asks (R-6.20).
 */
function NewOpportunityNotices({ account }: { account: Account }) {
  const on = account.notificationsOn !== null;
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function change(value: boolean) {
    setSaving(true);
    setStatus(null);
    const answer = await changeOwnAccount(account.id, "updateNotifications", value);
    setSaving(false);
    if (answer.kind !== "saved") {
      setStatus("Your choice could not be saved. Nothing has changed. Please try again.");
      return;
    }
    holdAccount(answer.account);
    setStatus(
      value
        ? "Saved. You will be emailed when the next opportunity is posted."
        : "Saved. You will no longer be emailed when new opportunities are posted.",
    );
  }

  const state = on
    ? account.email
      ? `You are emailed at ${account.email} when new opportunities are posted.`
      : "You have asked to be emailed when new opportunities are posted, but no email address is held for you."
    : "You are not emailed when new opportunities are posted.";

  return (
    <Panel id="notification-optin-heading" title="New opportunity emails" testId="notification-optin-control">
      <NoticeRow>
        <p className="op-text" data-testid="notification-optin-state">
          {state}
        </p>
        {/* Not disabled while saving, which would take focus off it; a second press waits instead. */}
        <Button
          variant="secondary"
          size="medium"
          onPress={() => (saving ? undefined : void change(!on))}
          data-testid="notification-optin-toggle"
        >
          {on ? "Stop emailing me about new opportunities" : "Email me about new opportunities"}
        </Button>
      </NoticeRow>
      <SaveStatus>{status}</SaveStatus>
    </Panel>
  );
}
