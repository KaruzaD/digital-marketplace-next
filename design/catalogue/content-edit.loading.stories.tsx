import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage } from "./content-kit";
import { ADMIN, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · loading — the managing screen has been opened and the page has not arrived. The surface title stands in
// for the H1 until the page's own title is known.
const meta: Meta = { title: "content/content-edit/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <PageTitle>Manage a page</PageTitle>
        <Waiting label="Loading page" />
      </ContentPage>
    </SitePage>
  ),
};
