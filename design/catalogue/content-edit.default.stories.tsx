import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, CurrentWording, ManageHead, PageActions, PageFacts } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · default — an administrator on the managing screen of an ordinary page that one administrator created
// and another later changed. It names both, each linked to their profile (R-7.27), shows only the current title and
// body with no history (R-7.23), and offers Edit page and Delete page (R-7.9).
const meta: Meta = { title: "content/content-edit/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <PageFacts
          slug="hackathon-rules"
          published={{ iso: "2026-08-03", text: "August 3, 2026" }}
          publishedBy={{ name: "Test Administrator", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000001" }}
          updated={{ iso: "2026-09-01", text: "September 1, 2026" }}
          updatedBy={{ name: "Test Administrator Two", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000006" }}
        />
        <PageActions deletable />
        <CurrentWording
          title="Hackathon rules"
          slug="hackathon-rules"
          body="Placeholder: the rules of the hackathon, written by an administrator."
        />
      </ContentPage>
    </SitePage>
  ),
};
