import { useEffect, useRef, type ReactNode } from "react";
import { FileTrigger, Toolbar } from "react-aria-components";
import { Button, ButtonGroup, Heading, InlineAlert, Link, Text, TextArea, TextField } from "@bcgov/design-system-react-components";
import { Label, look } from "./marketplace";
import { Details, OpportunityPage, PageTitle, Region, type Detail } from "./opportunity-kit";
import { AlertTitle } from "./proposal-kit";
import { useNarrow } from "./site";

// The pieces the content domain's screens are put together from in the chosen direction (design/DESIGN.md, "Content
// screens in the chosen direction"): the page frame, the managing screen's head, facts, actions and current wording, the
// page form's fields and body editor, the list of pages with its phone cards, the public page's article, and the
// response reference. Built on opportunity-kit.tsx, marketplace.tsx and proposal-kit.tsx; this project's own
// compositions of design-system components and tokens, none of them a design-system component.

const css = `
.ct-titlebar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--layout-margin-medium);
}
.ct-form, .ct-group, .ct-body, .ct-article, .ct-card { display: flex; flex-direction: column; }
.ct-titlebar > *, .ct-form > *, .ct-group > *, .ct-group > div > p, .ct-body > *, .ct-article > *, .ct-card > *,
.ct-pair > * {
  margin: var(--layout-margin-none);
}
.ct-form, .ct-body { gap: var(--layout-margin-medium); }
.ct-group, .ct-card { gap: var(--layout-margin-small); }
.ct-article { gap: var(--layout-margin-large); }
.ct-pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--layout-margin-medium) var(--layout-margin-large);
  align-items: start;
}
.ct-form .bcds-react-aria-TextField, .ct-form .bcds-react-aria-TextArea { width: 100%; }
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

// A whole page of this domain: the opportunity page frame (the page container, the direction's style sheets, the
// regions `large` apart, `medium` on a phone) with this kit's style sheet.
export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <OpportunityPage>
      <style>{css}</style>
      {children}
    </OpportunityPage>
  );
}

// The content area's H1 with the one thing the area offers beside it, on one line where they fit.
export function TitleBar({ children }: { children: ReactNode }) {
  return <div className="ct-titlebar">{children}</div>;
}

// The managing screen's head: what the page is, in small text, over the page's own title as the H1.
export function ManageHead({ title }: { title: string }) {
  return (
    <div className="op-head">
      <p className="op-eyebrow">Manage a page</p>
      <PageTitle>{title}</PageTitle>
    </div>
  );
}

export type When = { iso: string; text: string };
export type Person = { name: string; href?: string };

function Who({ person, testId }: { person: Person; testId: string }) {
  return person.href ? (
    <Link href={person.href} data-testid={testId}>
      {person.name}
    </Link>
  ) : (
    <span data-testid={testId}>{person.name}</span>
  );
}

export function Time({ when, testId }: { when: When; testId?: string }) {
  return (
    <time dateTime={when.iso} data-testid={testId}>
      {when.text}
    </time>
  );
}

// The managing screen's facts (R-7.27): the public address, when and by whom the page was published, and when and by
// whom it was last changed. A person is a link to their profile; "System" is not a person and is not linked.
export function PageFacts({
  slug,
  published,
  publishedBy,
  updated,
  updatedBy,
}: {
  slug: string;
  published: When;
  publishedBy: Person;
  updated: When;
  updatedBy: Person;
}) {
  const items: Detail[] = [
    {
      term: "Public address",
      value: (
        <Link href={`/content/${slug}`} data-testid="content-page-address">
          /content/{slug}
        </Link>
      ),
    },
    { term: "Published", value: <Time when={published} testId="content-published-date" /> },
    { term: "Published by", value: <Who person={publishedBy} testId="content-published-by" /> },
    { term: "Last updated", value: <Time when={updated} testId="content-updated-date" /> },
    { term: "Last updated by", value: <Who person={updatedBy} testId="content-updated-by" /> },
  ];
  return <Details items={items} />;
}

// An alert with content of its own writes its title in the alert's own title markup: the design system's InlineAlert
// drops `title` when it is given children (design/DESIGN.md, "Gaps in the design system", 4).
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

// The warning a page the service needs carries, in view and while editing (R-7.25).
export function FixedPageWarning({ slug }: { slug: string }) {
  return (
    <Notice variant="warning" title="The service needs this page" testId="content-fixed-page-warning">
      <Text elementType="p">
        Parts of the service link to this page or show its text, so it must stay at /content/{slug}. You can change its title
        and body, but you cannot change its address or delete it.
      </Text>
    </Notice>
  );
}

// The managing screen's one row of actions. Edit page is the screen's primary action; Delete page is offered only for
// an ordinary page, and is not rendered at all for a page the service needs (R-7.25).
export function PageActions({ deletable }: { deletable: boolean }) {
  return (
    <ButtonGroup ariaLabel="Page actions">
      <Button variant="primary" data-testid="content-edit-button">Edit page</Button>
      {deletable ? (
        <Button variant="secondary" danger data-testid="content-delete-button">Delete page</Button>
      ) : null}
    </ButtonGroup>
  );
}

// The page's current title, address and body, read-only, with nothing of its past (R-7.23).
export function CurrentWording({ title, slug, body }: { title: string; slug: string; body: string }) {
  return (
    <Region id="content-current-heading" title="Current wording">
      <div className="ct-pair">
        <TextField label="Title" isReadOnly defaultValue={title} data-testid="content-title-field" />
        <TextField label="Address" isReadOnly defaultValue={slug} data-testid="content-slug-field" />
      </div>
      <TextArea label="Body" isReadOnly defaultValue={body} data-testid="content-body-field" />
    </Region>
  );
}

// The form's fields, `medium` apart. Title and address share a line where each has 280 pixels; the body takes the
// whole column.
export function PageForm({ children }: { children: ReactNode }) {
  return <div className="ct-form">{children}</div>;
}

export function FieldPair({ children }: { children: ReactNode }) {
  return <div className="ct-pair">{children}</div>;
}

export function TitleField({ value, error }: { value?: string; error?: string }) {
  return (
    <TextField
      id="content-title"
      label="Title"
      isRequired
      description="Between 1 and 100 characters."
      defaultValue={value}
      isInvalid={error ? true : undefined}
      errorMessage={error}
      data-testid="content-title-field"
    />
  );
}

// The address, with its rule stated before input (R-7.21) and the full public address it gives (R-7.21 note), a
// label and what it labels `small` apart. `description` is the rename warning on an ordinary page being edited.
export function AddressField({
  value,
  error,
  description,
  resulting,
}: {
  value?: string;
  error?: string;
  description?: string;
  resulting: string;
}) {
  return (
    <div className="ct-group">
      <TextField
        id="content-slug"
        label="Address"
        isRequired
        description={description}
        defaultValue={value}
        isInvalid={error ? true : undefined}
        errorMessage={error}
        aria-describedby="content-slug-rule content-resulting-address"
        data-testid="content-slug-field"
      />
      <div id="content-slug-rule" data-testid="content-slug-rule">
        <Text elementType="p" size="small" color="secondary">
          Use lowercase letters and numbers, in groups joined by single hyphens, like about-us. No capital letters, spaces or
          underscores, and no hyphen at the start or end.
        </Text>
      </div>
      <div id="content-resulting-address" data-testid="content-resulting-address">
        <Text elementType="p" size="small" color="secondary">
          Public address: {resulting}
        </Text>
      </div>
    </div>
  );
}

// The address of a page the service needs, shown but not editable (R-7.25).
export function LockedAddressField({ value }: { value: string }) {
  return (
    <TextField
      id="content-slug"
      label="Address"
      isReadOnly
      description="The service needs this page at this address, so the address cannot be changed."
      defaultValue={value}
      data-testid="content-slug-field"
    />
  );
}

// The body editor: a labelled toolbar of formatting buttons and the image chooser, the body, and the formatting guide,
// `small` apart (design/DESIGN.md, "Domain: content", "Body editor").
export function BodyEditor({ value, error }: { value?: string; error?: string }) {
  return (
    <div className="ct-group">
      <Toolbar aria-label="Formatting for Body" className="ct-toolbar">
        <Button variant="tertiary" size="small">Bold</Button>
        <Button variant="tertiary" size="small">Italic</Button>
        <Button variant="tertiary" size="small">Heading</Button>
        <Button variant="tertiary" size="small">Bulleted list</Button>
        <Button variant="tertiary" size="small">Numbered list</Button>
        <Button variant="tertiary" size="small">Link</Button>
        <FileTrigger acceptedFileTypes={["image/jpeg", "image/png"]}>
          <Button variant="tertiary" size="small" data-testid="content-body-image-button">Insert image</Button>
        </FileTrigger>
      </Toolbar>
      <TextArea
        id="content-body"
        label="Body"
        isRequired
        description="Formatted text, between 1 and 50,000 characters. An inserted image is placed at the cursor."
        defaultValue={value}
        isInvalid={error ? true : undefined}
        errorMessage={error}
        data-testid="content-body-field"
      />
      <p className="ct-guide">
        <Link href="/content/markdown-guide" target="_blank">How to format text (opens in a new tab)</Link>
      </p>
    </div>
  );
}

// Why publishing is or is not available yet, in text before the button that refers to it.
export function PublishHint({ children }: { children: ReactNode }) {
  return (
    <Text elementType="p" id="content-publish-hint">
      {children}
    </Text>
  );
}

// The problems that keep publishing unavailable, each a link to its field. It updates as the person works, so it takes
// neither `role="alert"` nor focus.
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

// The form's submit row: Cancel, then the screen's one primary action. `hinted` ties the button to the text before it.
export function PublishRow({ mode, disabled = false, hinted = true }: { mode: "create" | "edit"; disabled?: boolean; hinted?: boolean }) {
  const create = mode === "create";
  return (
    <ButtonGroup ariaLabel={create ? "Page actions" : "Edit actions"}>
      <Button variant="secondary" data-testid="content-cancel-button">Cancel</Button>
      <Button
        type="submit"
        variant="primary"
        isDisabled={disabled || undefined}
        aria-describedby={hinted ? "content-publish-hint" : undefined}
        data-testid={create ? "content-publish-button" : "content-publish-changes-button"}
      >
        {create ? "Publish page" : "Publish changes"}
      </Button>
    </ButtonGroup>
  );
}

// The service's refusal of an address already in use (R-7.22), focused when it appears so it is read out first.
export function DuplicateAddress({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, []);
  return (
    <div ref={box} tabIndex={-1} className="ct-focus" data-testid="content-duplicate-slug-error">
      <InlineAlert variant="danger" role="alert">
        <AlertTitle>This address is already in use</AlertTitle>
        <Text elementType="p">{children}</Text>
      </InlineAlert>
    </div>
  );
}

export type ListedPage = { slug: string; title: string; fixed: boolean; created: When; updated: When };

const CAPTION = "Every page, in order of title";

// How many pages the list holds, beside its caption (R-7.12, `page_count`). The number alone carries the test ID.
function Count({ pages }: { pages: ListedPage[] }) {
  return (
    <>
      {" "}
      (<span data-testid="content-list-count">{pages.length}</span> pages)
    </>
  );
}

// "Needed by the service" in words: a grey label for Yes, plain text for No. Grey is not a status colour (rule 3).
function Needed({ fixed }: { fixed: boolean }) {
  return <span data-testid="content-list-fixed">{fixed ? <Label>Yes</Label> : "No"}</span>;
}

// The list of pages (R-7.5). Wide screens: a table with a column for each fact, in its own focusable region that
// scrolls sideways if it must. Phones: each page is a stacked card, its title first, then its public address, then the
// remaining facts on one line (rule 7). The switch is read in script, as the header's is, so each row and its test IDs
// appear once.
export function PageRows({ pages }: { pages: ListedPage[] }) {
  if (useNarrow()) {
    return (
      <>
        <p id="content-list-caption" className="op-note">
          {CAPTION}
          <Count pages={pages} />
        </p>
        <ul className="ct-cards" aria-labelledby="content-list-caption" data-testid="content-list-table">
          {pages.map((p) => (
            <li key={p.slug} data-testid="content-list-row">
              <article className="ct-card" aria-labelledby={`content-${p.slug}`}>
                <Heading level={2} id={`content-${p.slug}`} style={look.title}>
                  <Link href={`/content/${p.slug}/edit`} data-testid="content-list-title-link">{p.title}</Link>
                </Heading>
                <p className="ct-card-address">
                  <Link href={`/content/${p.slug}`} data-testid="content-list-address-link">/content/{p.slug}</Link>
                </p>
                <div className="ct-card-facts">
                  <span>
                    Needed by the service: <Needed fixed={p.fixed} />
                  </span>
                  <span>
                    Created <Time when={p.created} testId="content-list-created" />
                  </span>
                  <span>
                    Last updated <Time when={p.updated} testId="content-list-updated" />
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
          {pages.map((p) => (
            <tr key={p.slug} data-testid="content-list-row">
              <td><Link href={`/content/${p.slug}/edit`} data-testid="content-list-title-link">{p.title}</Link></td>
              <td><Link href={`/content/${p.slug}`} data-testid="content-list-address-link">/content/{p.slug}</Link></td>
              <td><Needed fixed={p.fixed} /></td>
              <td><Time when={p.created} testId="content-list-created" /></td>
              <td><Time when={p.updated} testId="content-list-updated" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The list's own sentence about "Needed by the service".
export function NeededExplained() {
  return (
    <p className="op-text">
      Pages marked "Needed by the service" are linked to or embedded by the service. Their title and body can be changed,
      but they cannot be moved to another address or removed.
    </p>
  );
}

// The public page: one article labelled by its H1, its regions `large` apart (`medium` on a phone).
export function PageArticle({ children }: { children: ReactNode }) {
  return (
    <article className="ct-article" aria-labelledby="content-page-heading" data-testid="content-page">
      {children}
    </article>
  );
}

// Where the formatted-text renderer writes a page's body. Its headings start at H2, in the design system's H4 size.
export function RenderedBody({ children }: { children: ReactNode }) {
  return (
    <div className="ct-body" data-testid="content-page-body">
      {children}
    </div>
  );
}

// A response reference: the small line saying the address answers with data, the H1, then the requests and the
// answer, each as terms and values.
export function RequestReference({
  requestTitle = "Requests",
  requests,
  answer,
}: {
  requestTitle?: string;
  requests: Detail[];
  answer: Detail[];
}) {
  return (
    <>
      <div className="op-head">
        <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
        <PageTitle>Requests about a page</PageTitle>
      </div>
      <Region id="content-request-requests" title={requestTitle}>
        <Details items={requests} />
      </Region>
      <Region id="content-request-answer" title="Answer">
        <Details items={answer} />
      </Region>
    </>
  );
}
