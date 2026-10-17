import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { ContentPage, NeededExplained, PageRows, TitleBar, type ListedPage } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-list · default — an administrator in the content area. Every page is listed once, ordered by title, with its
// public address, whether the service needs it, and its created and updated dates (R-7.5), and the list says how many
// pages it holds. The title opens the page's managing screen; the address opens the page as the public reads it.
const meta: Meta = { title: "content/content-list/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

// Illustrative rows. The service-created pages carry the title their address gave them until somebody rewrites it
// (R-7.12); "Privacy" has been rewritten. "hackathon-rules" is an ordinary page an administrator made.
const pages: ListedPage[] = [
  { slug: "about", title: "about", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2020-12-02", text: "December 2, 2020" } },
  { slug: "accessibility", title: "accessibility", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2020-12-02", text: "December 2, 2020" } },
  { slug: "hackathon-rules", title: "Hackathon rules", fixed: false, created: { iso: "2026-08-03", text: "August 3, 2026" }, updated: { iso: "2026-09-01", text: "September 1, 2026" } },
  { slug: "privacy", title: "Privacy", fixed: true, created: { iso: "2020-12-02", text: "December 2, 2020" }, updated: { iso: "2026-09-14", text: "September 14, 2026" } },
  { slug: "service-level-agreement", title: "service-level-agreement", fixed: true, created: { iso: "2026-09-18", text: "September 18, 2026" }, updated: { iso: "2026-09-18", text: "September 18, 2026" } },
];

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <TitleBar>
          <PageTitle>Content Management</PageTitle>
          <Link href="/content/create" isButton buttonVariant="primary" data-testid="content-create-link">Create page</Link>
        </TitleBar>
        <NeededExplained />
        <PageRows pages={pages} />
      </ContentPage>
    </SitePage>
  ),
};
