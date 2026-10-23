import { useEffect, useRef, type ReactNode } from "react";
import { Button, ButtonGroup, Heading, InlineAlert, Link, Text, TextArea, TextField } from "@bcgov/design-system-react-components";
import type { Author, ManagedPage, Page } from "../api/content";
import { readDate, readMoment } from "../lib/dates";
import { Label, look } from "./marketplace";
import { Details, OpportunityPage, PageTitle, Region, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";
import { useNarrow } from "./site-header";

/**
 * The pieces the content domain's screens are put together from in the chosen direction
 * (`design/catalogue/content-kit.tsx`; design/DESIGN.md, "Content screens in the chosen
 * direction"): the page frame, the list's title bar and rows, the managing screen's head, facts,
 * notices, actions and current wording, the page form's layout, and the public page's article.
 * Built on the opportunity kit; this project's own compositions, none of them a design-system
 * component. The form's fields themselves stay in `screens/content-form.tsx`, which drives them.
 */

const css = `
.ct-titlebar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--layout-margin-medium);
}
.ct-form, .ct-group, .ct-article, .ct-card { display: flex; flex-direction: column; }
.ct-titlebar > *, .ct-form > *, .ct-group > *, .ct-group > div > p, .ct-article > *, .ct-card > *, .ct-pair > * {
  margin: var(--layout-margin-none);
}
.ct-form { gap: var(--layout-margin-medium); }
.ct-group, .ct-card { gap: var(--layout-margin-small); }
.ct-article { gap: var(--layout-margin-large); }
.ct-pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  align-items: start;
}
.ct-form .bcds-react-aria-TextField, .ct-form .bcds-react-aria-TextArea,
.op-region .bcds-react-aria-TextField, .op-region .bcds-react-aria-TextArea { width: 100%; }
.ct-toolbar { display: flex; flex-wrap: wrap; gap: var(--layout-margin-small); }
.ct-guide { font: var(--typography-regular-small-body); }
.ct-errors { margin: var(--layout-margin-none); padding-inline-start: var(--layout-padding-large); }
.ct-focus:focus {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}
.ct-cards {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}
.ct-card {
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
}
.ct-card-address { font: var(--typography-regular-small-body); overflow-wrap: anywhere; }
.ct-card-facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--layout-margin-small);
  font: var(--typography-regular-small-body);
  color: var(--typography-color-secondary);
}
@media (max-width: 767.98px) {
  .ct-article { gap: var(--layout-margin-medium); }
  .ct-titlebar > a { flex: 1 1 100%; justify-content: center; }
}
`;

/**
 * A whole screen of this domain: the opportunity page frame (the direction's style sheets, the
 * regions `large` apart, `medium` on a phone) with this kit's style sheet. Like the other kits'
 * frames, it does not wrap itself in the page container: the root layout already does.
 */
export function ContentPage({ testId, children }: { testId?: string; children: ReactNode }) {
  return (
    <OpportunityPage testId={testId}>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

/** The content area's H1 with the one thing the area offers beside it, on one line where they fit. */
export function TitleBar({ children }: { children: ReactNode }) {
  return <div className="ct-titlebar">{children}</div>;
}

/** The managing screen's head: what the page is, in small text, over the page's own title as the H1. */
export function ManageHead({ title }: { title: string }) {
  return (
    <div className="op-head">
      <p className="op-eyebrow">Manage a page</p>
      <PageTitle>{title}</PageTitle>
    </div>
  );
}

/** A date as `readDate` or `readMoment` gives it, as a `<time>` element with its machine-readable form. */
export function Time({ when, testId }: { when: { dateTime: string; label: string } | null; testId?: string }) {
  return (
    <time dateTime={when?.dateTime} data-testid={testId}>
      {when?.label ?? ""}
    </time>
  );
}

/** Who published or last changed a page: the person, linked to their profile, or the service itself. */
function Who({ author, testId }: { author: Author | null; testId: string }) {
  return author ? (
    <Link href={`/users/${author.id}`} data-testid={testId}>
      {author.name}
    </Link>
  ) : (
    <span data-testid={testId}>System</span>
  );
}

/**
 * The managing screen's facts (R-7.27): the public address, when and by whom the page was
 * published, and when and by whom it was last changed, in as many columns as fit. The dates are
 * to the minute: publishing a change makes the updated date the moment of the change (R-7.8), and
 * the day alone would not show it.
 */
export function PageFacts({ page }: { page: ManagedPage }) {
  const items: Detail[] = [
    {
      term: "Public address",
      value: (
        <Link href={`/content/${page.slug}`} data-testid="content-page-address">
          {`/content/${page.slug}`}
        </Link>
      ),
    },
    { term: "Published", value: <Time when={readMoment(page.createdAt)} testId="content-published-date" /> },
    { term: "Published by", value: <Who author={page.createdBy} testId="content-published-by" /> },
    { term: "Last updated", value: <Time when={readMoment(page.updatedAt)} testId="content-updated-date" /> },
    { term: "Last updated by", value: <Who author={page.updatedBy} testId="content-updated-by" /> },
  ];
  return <Details items={items} />;
}

/**
 * A success or warning alert in a wrapper carrying its test ID, its title in the alert's own title
 * markup: the design system's InlineAlert drops `title` when it is given children.
 */
export function Notice({
  variant,
  title,
  testId,
  role,
  children,
}: {
  variant: "success" | "warning";
  title: string;
  testId: string;
  role?: "status";
  children: ReactNode;
}) {
  return (
    <div data-testid={testId}>
      <InlineAlert variant={variant} role={role}>
        <AlertTitle>{title}</AlertTitle>
        {children}
      </InlineAlert>
    </div>
  );
}

/** The warning a page the service needs carries, in view and while editing (R-7.25). */
export function FixedPageWarning({ slug }: { slug: string }) {
  return (
    <Notice variant="warning" title="The service needs this page" testId="content-fixed-page-warning">
      <Text elementType="p">
        {`Parts of the service link to this page or show its text, so it must stay at /content/${slug}. You can change its title and body, but you cannot change its address or delete it.`}
      </Text>
    </Notice>
  );
}

/**
 * The managing screen's one row of actions. Edit page is the screen's primary action; Delete page
 * is offered only for an ordinary page, and is not rendered at all for a page the service needs
 * (R-7.25).
 */
export function PageActions({ onEdit, onDelete }: { onEdit: () => void; onDelete?: () => void }) {
  return (
    <ButtonGroup ariaLabel="Page actions">
      <Button variant="primary" onPress={onEdit} data-testid="content-edit-button">
        Edit page
      </Button>
      {onDelete ? (
        <Button variant="secondary" danger onPress={onDelete} data-testid="content-delete-button">
          Delete page
        </Button>
      ) : null}
    </ButtonGroup>
  );
}

/** The page's current title, address and body, read-only, with nothing of its past (R-7.23). */
export function CurrentWording({ title, slug, body }: { title: string; slug: string; body: string }) {
  return (
    <Region id="content-current-heading" title="Current wording">
      <div className="ct-pair">
        <TextField label="Title" isReadOnly value={title} data-testid="content-title-field" />
        <TextField label="Address" isReadOnly value={slug} data-testid="content-slug-field" />
      </div>
      <TextArea label="Body" isReadOnly value={body} data-testid="content-body-field" />
    </Region>
  );
}

/** The form's fields, `medium` apart. */
export function PageForm({ children }: { children: ReactNode }) {
  return <div className="ct-form">{children}</div>;
}

/** The title and the address, on one line where each has 280 pixels; stacked on a phone. */
export function FieldPair({ children }: { children: ReactNode }) {
  return <div className="ct-pair">{children}</div>;
}

/** A field with what belongs to it (its rule, its resulting address; the editor's parts), `small` apart. */
export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="ct-group">{children}</div>;
}

/**
 * The problems that keep publishing unavailable, each a link to its field. It updates as the
 * person works, so it takes neither `role="alert"` nor focus.
 */
export function PublishProblems({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div id="content-publish-hint">
      <InlineAlert variant="danger">
        <AlertTitle>{title}</AlertTitle>
        <ul className="ct-errors">{children}</ul>
      </InlineAlert>
    </div>
  );
}

/**
 * A refusal in the danger alert, its title in the alert's own title markup. With `focus` it takes
 * keyboard focus when it appears, so it is read out first, with a visible focus ring: the address
 * already in use (R-7.22), or a publish the service would not take. A screen that must say it
 * again gives it a new `key`.
 */
export function Refusal({
  title,
  testId,
  focus = false,
  children,
}: {
  title: string;
  testId?: string;
  focus?: boolean;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focus) box.current?.focus();
  }, [focus]);
  return (
    <div ref={box} tabIndex={focus ? -1 : undefined} className={focus ? "ct-focus" : undefined} data-testid={testId}>
      <InlineAlert variant="danger" role="alert">
        <AlertTitle>{title}</AlertTitle>
        <Text elementType="p">{children}</Text>
      </InlineAlert>
    </div>
  );
}

const CAPTION = "Every page, in order of title";

/** How many pages the list holds, in its caption (`page_count`). The number alone carries the test ID. */
function Count({ pages }: { pages: readonly Page[] }) {
  return (
    <>
      {" "}
      (<span data-testid="content-list-count">{pages.length}</span> {pages.length === 1 ? "page" : "pages"})
    </>
  );
}

/** "Needed by the service" in words: a grey label for Yes, plain text for No. Grey is not a status colour. */
function Needed({ fixed }: { fixed: boolean }) {
  return <span data-testid="content-list-fixed">{fixed ? <Label>Yes</Label> : "No"}</span>;
}

/**
 * The list of pages (R-7.5), in the order given. Wide screens: a table with a column for each
 * fact, in its own focusable region that scrolls sideways if it must. Phones: each page is a
 * stacked card, its title first, then its public address, then the remaining facts on one line.
 * The switch is read in script, as the header's is, so each row and its test IDs appear once.
 */
export function PageRows({ pages }: { pages: readonly Page[] }) {
  const narrow = useNarrow();
  if (narrow) {
    return (
      <>
        <p id="content-list-caption" className="op-note">
          {CAPTION}
          <Count pages={pages} />
        </p>
        <ul className="ct-cards" aria-labelledby="content-list-caption" data-testid="content-list-table">
          {pages.map((page) => (
            <li key={page.id} data-testid="content-list-row">
              <article className="ct-card" aria-labelledby={`content-${page.id}`}>
                <Heading level={2} id={`content-${page.id}`} style={look.title}>
                  <Link href={`/content/${page.slug}/edit`} data-testid="content-list-title-link">
                    {page.title}
                  </Link>
                </Heading>
                <p className="ct-card-address">
                  <Link href={`/content/${page.slug}`} data-testid="content-list-address-link">
                    {`/content/${page.slug}`}
                  </Link>
                </p>
                <div className="ct-card-facts">
                  <span>
                    Needed by the service: <Needed fixed={page.fixed} />
                  </span>
                  <span>
                    Created <Time when={readDate(page.createdAt)} testId="content-list-created" />
                  </span>
                  <span>
                    Last updated <Time when={readDate(page.updatedAt)} testId="content-list-updated" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <div className="op-table-scroll" role="region" aria-labelledby="content-list-caption" tabIndex={0}>
      <table className="op-table" data-testid="content-list-table">
        <caption id="content-list-caption">
          {CAPTION}
          <Count pages={pages} />
        </caption>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Public address</th>
            <th scope="col">Needed by the service</th>
            <th scope="col">Created</th>
            <th scope="col">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id} data-testid="content-list-row">
              <td>
                <Link href={`/content/${page.slug}/edit`} data-testid="content-list-title-link">
                  {page.title}
                </Link>
              </td>
              <td>
                <Link href={`/content/${page.slug}`} data-testid="content-list-address-link">
                  {`/content/${page.slug}`}
                </Link>
              </td>
              <td>
                <Needed fixed={page.fixed} />
              </td>
              <td>
                <Time when={readDate(page.createdAt)} testId="content-list-created" />
              </td>
              <td>
                <Time when={readDate(page.updatedAt)} testId="content-list-updated" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The list's own sentence about "Needed by the service". */
export function NeededExplained() {
  return (
    <p className="op-text">
      Pages marked "Needed by the service" are linked to or embedded by the service. Their title and body can be changed,
      but they cannot be moved to another address or removed.
    </p>
  );
}

/** The public page: one article labelled by its H1, which carries `content-page-heading`. */
export function PageArticle({ children }: { children: ReactNode }) {
  return (
    <article className="ct-article" aria-labelledby="content-page-heading" data-testid="content-page">
      {children}
    </article>
  );
}
