import { useNavigate } from "@tanstack/react-router";
import { createPage } from "../api/content";
import { AdministratorsOnly } from "../app/administrators-only";
import { ContentPage } from "../app/content-kit";
import { PageTitle } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { PageEditor } from "./content-form";
import { withContentNotice } from "./content-notices";

/**
 * Create a New Page, at `/content/create` (content-create). An administrator gives a page its
 * title, address and body and confirms publishing it; it is public at its address at once and
 * they are taken to its managing screen (R-7.7). Anybody else is shown the missing page (R-7.6).
 */
export function ContentCreateScreen() {
  return (
    <AdministratorsOnly title="Create a New Page" loadingLabel="Loading">
      {() => <ContentCreate />}
    </AdministratorsOnly>
  );
}

function ContentCreate() {
  useScreenTitle("Create a New Page");
  const navigate = useNavigate();
  return (
    <ContentPage>
      <PageTitle>Create a New Page</PageTitle>
      <PageEditor
        purpose="create"
        initial={{ title: "", slug: "", body: "" }}
        intro={
          <p className="op-text">
            Every field is required. A page can be read by anyone, including people who are not signed in, as soon as it
            is published.
          </p>
        }
        onCancel={() => void navigate({ to: "/content" })}
        onPublish={createPage}
        onPublished={({ page: created }) =>
          void navigate({
            to: "/content/$slug/edit",
            params: { slug: created.slug },
            state: withContentNotice({ kind: "created" }) as never,
          })
        }
      />
    </ContentPage>
  );
}
