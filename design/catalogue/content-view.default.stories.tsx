import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading, Link } from "@bcgov/design-system-react-components";
import { ContentPage, PageArticle, RenderedBody, Time } from "./content-kit";
import { look } from "./marketplace";
import { Details, PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-view · default — a visitor who is not signed in reads the page at "privacy": its title, its body as formatted
// text, and its published and updated dates (R-7.1). The body is rendered as formatted text only; markup in it is shown,
// never run, and the same renderer is used wherever another screen embeds the body (R-7.17). No authorship is shown
// here: that is for an administrator on the managing screen (R-7.27).
const meta: Meta = { title: "content/content-view/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <ContentPage>
        <PageArticle>
          <div className="op-head">
            <PageTitle id="content-page-heading">
              <span data-testid="content-page-title">Privacy</span>
            </PageTitle>
          </div>
          <Details
            items={[
              { term: "Published", value: <Time when={{ iso: "2020-12-02", text: "December 2, 2020" }} testId="content-published-date" /> },
              { term: "Last updated", value: <Time when={{ iso: "2026-09-14", text: "September 14, 2026" }} testId="content-updated-date" /> },
            ]}
          />
          {/* Formatted text: the page's body, rendered by the project's own formatted-text renderer. Placeholder wording. */}
          <RenderedBody>
            <Heading level={2} style={look.section}>How we handle your information</Heading>
            <p className="op-text">
              Placeholder: the privacy notice's own wording is written by an administrator and is not part of the spec.
            </p>
            <p className="op-text">
              Questions about this notice can be raised through the{" "}
              <Link href="/content/accessibility" data-testid="content-body-link">accessibility page</Link>.
            </p>
          </RenderedBody>
          <p className="op-note">
            Address of this page: <span data-testid="content-page-address">/content/privacy</span>
          </p>
        </PageArticle>
      </ContentPage>
    </SitePage>
  ),
};
