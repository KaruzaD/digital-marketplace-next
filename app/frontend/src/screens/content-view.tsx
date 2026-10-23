import { useEffect, useState } from "react";
import { Page, PageAnswer, fetchPage } from "../api/content";
import { FormattedText } from "../lib/formatted-text/formatted-text";
import { readDate } from "../lib/dates";
import { NotFound } from "../app/not-found";
import { useScreenTitle } from "../app/screen-title";
import { ContentPage, PageArticle, Time } from "../app/content-kit";
import { Details, PageTitle, Waiting } from "../app/opportunity-kit";

/**
 * A page of the service's own prose, at its own address.
 *
 * Anyone can read it, including a visitor who has not signed in, and it shows the page's
 * title, its body as formatted text, and the dates it was first published and last updated
 * (R-7.1). No authorship is shown: that is for an administrator on the managing screen.
 */
export function ContentViewScreen({ address }: { readonly address: string }) {
  const [answer, setAnswer] = useState<PageAnswer | null>(null);

  useEffect(() => {
    let reading = true;
    setAnswer(null);
    void fetchPage(address).then((result) => {
      if (reading) setAnswer(result);
    });
    return () => {
      reading = false;
    };
  }, [address]);

  // The page's own title is its H1, so nothing stands in for it while it is on its way.
  if (answer === null) {
    return (
      <ContentPage>
        <Waiting label="Loading page" />
      </ContentPage>
    );
  }
  // An address no page holds, an address that is not well formed, and a page that cannot be
  // read all come to the same screen (R-7.2, R-7.3).
  if (answer.kind === "missing") return <NotFound />;
  return <PublishedPage page={answer.page} />;
}

export function PublishedPage({ page }: { readonly page: Page }) {
  // The browser calls this screen by the page's own title.
  useScreenTitle(page.title);
  return (
    <ContentPage>
      <PageArticle>
        <div className="op-head">
          <PageTitle id="content-page-heading">
            <span data-testid="content-page-title">{page.title}</span>
          </PageTitle>
        </div>
        <Details
          items={[
            { term: "Published", value: <Time when={readDate(page.createdAt)} testId="content-published-date" /> },
            { term: "Last updated", value: <Time when={readDate(page.updatedAt)} testId="content-updated-date" /> },
          ]}
        />
        <FormattedText markup={page.body} testId="content-page-body" />
        <p className="op-note">
          Address of this page: <span data-testid="content-page-address">{`/content/${page.slug}`}</span>
        </p>
      </PageArticle>
    </ContentPage>
  );
}
