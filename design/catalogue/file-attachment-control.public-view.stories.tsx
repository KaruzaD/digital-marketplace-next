import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePage, PublicAttachments, Trimmed } from "./file-kit";
import { OpportunityHead, Region, VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// file-attachment-control · public-view — the same attachments as they appear on the opportunity's own page
// (opportunity-*-view) once it is published: a list of download links at the end of the Description section. Nothing
// here can be renamed or removed, so no Remove control is rendered at all (R-8.10, R-8.25). The rest of the page is the
// opportunities domain's and is trimmed here. Seen by a vendor, to whom the opportunity is Open.
const meta: Meta = { title: "files/file-attachment-control/public-view", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const PublicView: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <FilePage>
        <OpportunityHead
          eyebrow="Code With Us opportunity"
          program="code-with-us"
          status="Open"
          title="Build an accessible permit tracker"
        />
        <Trimmed>The teaser, key facts and actions are the opportunities domain's design and are not shown here.</Trimmed>
        <Region id="view-description" title="Description">
          <p className="op-text">
            The ministry runs an online permit application that tells applicants little about where their application
            stands. This opportunity adds a status page that works with a keyboard and a screen reader.
          </p>
          <PublicAttachments
            files={[
              { name: "Statement of work.pdf", id: "5b2e0c3a-8d41-4f6e-a1c2-000000000803" },
              { name: "Current permit screens.png", id: "5b2e0c3a-8d41-4f6e-a1c2-000000000804" },
            ]}
          />
        </Region>
      </FilePage>
    </SitePage>
  ),
};
