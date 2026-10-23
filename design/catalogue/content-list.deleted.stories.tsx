import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, Text } from "@bcgov/design-system-react-components";
import { ContentPage, NeededExplained, Notice, PageRows, TitleBar, type ListedPage } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-list · deleted — an administrator confirmed removing the ordinary page "hackathon-rules" and has been returned
// to the list, told it was removed. It is no longer listed, and its address now answers as not found (R-7.9).
const meta: Meta = { title: "content/content-list/deleted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const pages: ListedPage[] = [
  { slug: "about", title: "about", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2020-12-02", text: "December 2, 2020" } },
  { slug: "accessibility", title: "accessibility", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2020-12-02", text: "December 2, 2020" } },
  { slug: "privacy", title: "Privacy", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2026-09-14", text: "September 14, 2026" } },
  { slug: "service-level-agreement", title: "service-level-agreement", fixed: true, created: { iso: "2026-09-18", text: "September 18, 2026" }, updated: { iso: "2026-09-18", text: "September 18, 2026" } },
];

export const Deleted: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <TitleBar>
          <PageTitle>Content Management</PageTitle>
          <Link href="/content/create" isButton buttonVariant="primary" data-testid="content-create-link">Create page</Link>
        </TitleBar>
        <Notice variant="success" role="status" title="Page removed" testId="content-deleted-success">
          <Text elementType="p">
            "Hackathon rules" and every earlier version of it have been removed. Its address, /content/hackathon-rules, no
            longer answers.
          </Text>
        </Notice>
        <NeededExplained />
        <PageRows pages={pages} />
      </ContentPage>
    </SitePage>
  ),
};
