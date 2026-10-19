import { useEffect, useState } from "react";
import { Link, Text } from "@bcgov/design-system-react-components";
import { useRouterState } from "@tanstack/react-router";
import { comparePagesByTitle } from "@rules/content";
import { Page, fetchPageList } from "../api/content";
import { AdministratorsOnly } from "../app/administrators-only";
import { ContentPage, NeededExplained, PageRows, TitleBar } from "../app/content-kit";
import { NotFound } from "../app/not-found";
import { PageTitle, Waiting } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { TitledAlert } from "../app/titled-alert";
import { RemovedPageNotice, contentNoticeOf } from "./content-notices";

/**
 * Content Management, at `/content` (content-list). An administrator sees every page once, in
 * order of title, with its public address, whether the service needs it, and when it was
 * created and last updated (R-7.5), and how many pages there are. On a fresh installation that
 * is the pages the service created for itself, each still titled by its address (R-7.12).
 * Anybody else is shown the missing page (R-7.6).
 */
export function ContentListScreen() {
  return (
    <AdministratorsOnly title="Content Management" loadingLabel="Loading pages">
      {() => <ContentList />}
    </AdministratorsOnly>
  );
}

function ContentList() {
  useScreenTitle("Content Management");
  const [answer, setAnswer] = useState<readonly Page[] | "loading" | "refused" | "failed">("loading");
  const removed = contentNoticeOf(useRouterState({ select: (state) => state.location.state }));

  useEffect(() => {
    let current = true;
    void fetchPageList().then((found) => {
      if (!current) return;
      setAnswer(found.kind === "listed" ? [...found.pages].sort(comparePagesByTitle) : found.kind);
    });
    return () => {
      current = false;
    };
  }, []);

  if (answer === "refused") return <NotFound />;
  // The loading state is the H1 over the waiting row; Create page joins it once the list is here.
  if (answer === "loading") {
    return (
      <ContentPage>
        <PageTitle>Content Management</PageTitle>
        <Waiting label="Loading pages" />
      </ContentPage>
    );
  }
  return (
    <ContentPage>
      <TitleBar>
        <PageTitle>Content Management</PageTitle>
        <Link href="/content/create" isButton buttonVariant="primary" data-testid="content-create-link">
          Create page
        </Link>
      </TitleBar>
      {removed?.kind === "removed" ? <RemovedPageNotice title={removed.title} slug={removed.slug} /> : null}
      {answer === "failed" ? (
        <TitledAlert variant="danger" role="alert" title="The pages could not be loaded">
          <Text elementType="p">Reload the page to try again.</Text>
        </TitledAlert>
      ) : (
        <>
          <NeededExplained />
          <PageRows pages={answer} />
        </>
      )}
    </ContentPage>
  );
}
