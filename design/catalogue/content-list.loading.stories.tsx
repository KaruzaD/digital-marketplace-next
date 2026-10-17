import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage } from "./content-kit";
import { ADMIN, PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-list · loading — an administrator opened the content area and the list of pages has not arrived (R-7.5)
const meta: Meta = { title: "content/content-list/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <PageTitle>Content Management</PageTitle>
        <Waiting label="Loading pages" />
      </ContentPage>
    </SitePage>
  ),
};
