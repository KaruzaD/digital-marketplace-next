import type { ReactNode } from "react";
import { OpportunityPage } from "./opportunity-kit";

/**
 * The pieces the content domain's screens are put together from in the chosen direction
 * (`design/catalogue/content-kit.tsx`; design/DESIGN.md, "Content screens in the chosen
 * direction"). Built on the opportunity kit; this project's own compositions, none of them a
 * design-system component. Only what the public page and the learn-more screens use is here so
 * far; the managing screens add their parts when they are restyled.
 */

const css = `
.ct-article { display: flex; flex-direction: column; gap: var(--layout-margin-large); }
.ct-article > * { margin: var(--layout-margin-none); }
@media (max-width: 767.98px) {
  .ct-article { gap: var(--layout-margin-medium); }
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

/** The public page: one article labelled by its H1, which carries `content-page-heading`. */
export function PageArticle({ children }: { children: ReactNode }) {
  return (
    <article className="ct-article" aria-labelledby="content-page-heading" data-testid="content-page">
      {children}
    </article>
  );
}

/** A date as `readDate` gives it, as a `<time>` element with its machine-readable form. */
export function Time({ when, testId }: { when: { dateTime: string; label: string } | null; testId?: string }) {
  return (
    <time dateTime={when?.dateTime} data-testid={testId}>
      {when?.label ?? ""}
    </time>
  );
}
