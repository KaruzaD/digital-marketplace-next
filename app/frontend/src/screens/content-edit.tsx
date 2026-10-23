import { useEffect, useState } from "react";
import { AlertDialog, Button, Modal, Text } from "@bcgov/design-system-react-components";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ManagedPage, fetchManagedPage, publishChanges, removePage } from "../api/content";
import { AdministratorsOnly } from "../app/administrators-only";
import {
  ContentPage,
  CurrentWording,
  FixedPageWarning,
  ManageHead,
  PageActions,
  PageFacts,
  Refusal,
} from "../app/content-kit";
import { NotFound } from "../app/not-found";
import { PageTitle, Region, Waiting } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";
import { carriesTermsAnnouncement } from "@rules/content";
import { PageEditor } from "./content-form";
import { TermsBroadcast } from "./terms-broadcast";
import {
  ChangesPublishedNotice,
  ContentNotice,
  PublishedPageNotice,
  contentNoticeOf,
  withContentNotice,
} from "./content-notices";

/**
 * A page's managing screen, at `/content/:slug/edit` (content-edit). An administrator sees the
 * page's public address, when it was published and last updated and by whom (R-7.27), and only
 * its current wording — no history and no way back to an earlier version (R-7.23). They can edit
 * it and publish the change (R-7.8), move it to a new address (R-7.24), and remove an ordinary
 * page (R-7.9). A page the service needs says so, keeps its address and offers no removal
 * (R-7.25). The service's own terms and conditions page also offers the announcement of
 * changed terms to vendors (R-7.13). Anybody else, and an address no page holds, is shown the
 * missing page (R-7.6).
 */
export function ContentEditScreen({ slug }: { slug: string }) {
  return (
    <AdministratorsOnly title="Manage a page" loadingLabel="Loading page">
      {() => <ContentEdit slug={slug} />}
    </AdministratorsOnly>
  );
}

type Loaded = ManagedPage | "loading" | "missing";

function ContentEdit({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const arrivedWith = contentNoticeOf(useRouterState({ select: (state) => state.location.state }));
  const [page, setPage] = useState<Loaded>("loading");
  const [notice, setNotice] = useState<ContentNotice | null>(arrivedWith);
  const [editing, setEditing] = useState(false);
  useScreenTitle(typeof page === "object" ? page.title : "Manage a page");

  useEffect(() => {
    // A page just moved to this address is already in hand.
    if (typeof page === "object" && page.slug === slug) return;
    let current = true;
    setPage("loading");
    void fetchManagedPage(slug).then((answer) => {
      if (current) setPage(answer.kind === "found" ? answer.page : "missing");
    });
    return () => {
      current = false;
    };
    // Only the address decides which page this screen manages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (page === "missing") return <NotFound />;
  if (page === "loading") {
    // The surface title stands in for the H1 until the page's own title is known.
    return (
      <ContentPage>
        <PageTitle>Manage a page</PageTitle>
        <Waiting label="Loading page" />
      </ContentPage>
    );
  }

  const warning = page.fixed ? <FixedPageWarning slug={page.slug} /> : null;

  if (editing) {
    return (
      <ContentPage>
        <ManageHead title={page.title} />
        {warning}
        <Region id="content-edit-heading" title="Edit the page">
          <PageEditor
            purpose="change"
            initial={{ title: page.title, slug: page.slug, body: page.body }}
            addressLocked={page.fixed}
            intro={
              <p className="op-text">
                {page.fixed
                  ? "The title and body are required. Your changes are public as soon as you publish them."
                  : "Every field is required. Your changes are public as soon as you publish them."}
              </p>
            }
            onCancel={() => setEditing(false)}
            onPublish={(wording) => publishChanges(page.id, wording)}
            onPublished={({ page: changed }) => {
              setPage(changed);
              setEditing(false);
              setNotice({ kind: "changes-published" });
              if (changed.slug !== slug) {
                // The page has moved; the screen follows it there, and nothing is left at the old
                // address (R-7.24).
                void navigate({
                  to: "/content/$slug/edit",
                  params: { slug: changed.slug },
                  replace: true,
                  state: withContentNotice({ kind: "changes-published" }) as never,
                });
              }
            }}
          />
        </Region>
      </ContentPage>
    );
  }

  return (
    <ManagingView
      page={page}
      warning={warning}
      notice={notice}
      onEdit={() => {
        setNotice(null);
        setEditing(true);
      }}
      onRemoved={() =>
        void navigate({
          to: "/content",
          state: withContentNotice({ kind: "removed", title: page.title, slug: page.slug }) as never,
        })
      }
    />
  );
}

/**
 * The managing screen in view: the head, the notice the person arrived with, the facts, the
 * warning a needed page carries, the actions, and the current wording (content-edit default,
 * fixed, created, changes-published).
 */
function ManagingView({
  page,
  warning,
  notice,
  onEdit,
  onRemoved,
}: {
  page: ManagedPage;
  warning: JSX.Element | null;
  notice: ContentNotice | null;
  onEdit: () => void;
  onRemoved: () => void;
}) {
  const [asking, setAsking] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [refusal, setRefusal] = useState<string | null>(null);

  async function remove() {
    setRemoving(true);
    setRefusal(null);
    const answer = await removePage(page.id);
    setRemoving(false);
    setAsking(false);
    if (answer.kind === "removed") {
      onRemoved();
      return;
    }
    setRefusal(answer.kind === "refused" ? answer.reasons.join(" ") : "The service could not remove it. Try again.");
  }

  return (
    <ContentPage>
      <ManageHead title={page.title} />
      {notice?.kind === "created" ? (
        <PublishedPageNotice slug={page.slug} />
      ) : notice?.kind === "changes-published" ? (
        <ChangesPublishedNotice slug={page.slug} />
      ) : null}
      <PageFacts page={page} />
      {refusal ? <Refusal title="The page was not removed">{refusal}</Refusal> : null}
      {warning}
      <PageActions onEdit={onEdit} onDelete={page.fixed ? undefined : () => setAsking(true)} />
      <CurrentWording title={page.title} slug={page.slug} body={page.body} />
      {carriesTermsAnnouncement(page.slug) ? <TermsBroadcast /> : null}
      <Modal isOpen={asking} isDismissable onOpenChange={(open) => (removing ? undefined : setAsking(open))}>
        <AlertDialog
          variant="destructive"
          title={`Delete “${page.title}”?`}
          data-testid="content-delete-dialog"
          buttons={
            <>
              <Button
                variant="secondary"
                isDisabled={removing}
                onPress={() => setAsking(false)}
                data-testid="content-dialog-cancel"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                danger
                isDisabled={removing}
                onPress={() => void remove()}
                data-testid="content-delete-confirm"
              >
                Delete page
              </Button>
            </>
          }
        >
          <Text elementType="p">
            {`The page and every earlier version of it will be removed permanently, and /content/${page.slug} will stop answering. Links to it from anywhere will lead to the not-found page. This cannot be undone.`}
          </Text>
        </AlertDialog>
      </Modal>
    </ContentPage>
  );
}
