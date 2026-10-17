import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@bcgov/design-system-react-components";
import { ContentPage, CurrentWording, ManageHead, Notice, PageActions, PageFacts } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · created — the administrator confirmed publishing a new page and has been taken to its managing screen,
// told it was published and where anyone can read it (R-7.7). The address here is what a test reads to reach the page again.
const meta: Meta = { title: "content/content-edit/created", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Created: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <Notice variant="success" role="status" title="Page published" testId="content-published-success">
          <Text elementType="p">Anyone can now read it at /content/hackathon-rules.</Text>
        </Notice>
        <PageFacts
          slug="hackathon-rules"
          published={{ iso: "2026-09-19", text: "September 19, 2026" }}
          publishedBy={{ name: "Test Administrator", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000001" }}
          updated={{ iso: "2026-09-19", text: "September 19, 2026" }}
          updatedBy={{ name: "Test Administrator", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000001" }}
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
