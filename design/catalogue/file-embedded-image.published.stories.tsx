import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "@bcgov/design-system-react-components";
import { PageArticle, RenderedBody } from "./content-kit";
import { FilePage, Trimmed } from "./file-kit";
import { look } from "./marketplace";
import { PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// file-embedded-image · published — the page from file-embedded-image · inserted after publishing, as a reader sees it
// at /content/hackathon-rules. The renderer turned the marker into the image's download address, so the reader sees
// the image, with the description the administrator gave it (R-8.29). The page around the body is the content domain's
// (content-view · default) and is trimmed here. Seen by a visitor.
const meta: Meta = { title: "files/file-embedded-image/published", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Published: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <FilePage>
        <PageArticle>
          <div className="op-head">
            <PageTitle id="content-page-heading">Hackathon rules</PageTitle>
          </div>
          <Trimmed>The published and last-updated dates are the content domain's design and are not shown here.</Trimmed>
          <RenderedBody>
            <p className="op-text">Placeholder: the rules of the hackathon, written by an administrator.</p>
            <Heading level={2} style={look.section}>Where it happens</Heading>
            <img
              src="/api/files/5b2e0c3a-8d41-4f6e-a1c2-000000000806?type=blob"
              alt="Map of the harbour venue, with the main hall beside the ferry terminal"
              className="fl-image"
              data-testid="content-body-image"
            />
          </RenderedBody>
        </PageArticle>
      </FilePage>
    </SitePage>
  ),
};
