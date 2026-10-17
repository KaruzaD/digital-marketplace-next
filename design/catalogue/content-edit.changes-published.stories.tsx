import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@bcgov/design-system-react-components";
import { ContentPage, CurrentWording, ManageHead, Notice, PageActions, PageFacts } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · changes-published — the administrator confirmed publishing a change to the body. The screen returns to
// its read-only form with the new wording, the updated date is the moment of the change and the last editor is the
// person who made it (R-7.8, R-7.27). The replaced wording is kept as an earlier version but nothing here shows it (R-7.23).
const meta: Meta = { title: "content/content-edit/changes-published", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ChangesPublished: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <Notice variant="success" role="status" title="Changes published" testId="content-changes-published-success">
          <Text elementType="p">Readers of /content/hackathon-rules now see the new wording.</Text>
        </Notice>
        <PageFacts
          slug="hackathon-rules"
          published={{ iso: "2026-08-03", text: "August 3, 2026" }}
          publishedBy={{ name: "Test Administrator", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000001" }}
          updated={{ iso: "2026-09-19", text: "September 19, 2026" }}
          updatedBy={{ name: "Test Administrator Two", href: "/users/0b6f2c1e-5a7d-4c3e-9f10-000000000006" }}
        />
        <PageActions deletable />
        <CurrentWording
          title="Hackathon rules"
          slug="hackathon-rules"
          body="Placeholder: the revised rules of the hackathon, written by an administrator."
        />
      </ContentPage>
    </SitePage>
  ),
};
