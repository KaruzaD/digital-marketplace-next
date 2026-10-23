import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage } from "./content-kit";
import { Waiting } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-view · loading — the page has been asked for and has not arrived. Its title is the page's own, so nothing
// stands in for the H1 until it arrives; the status row says what is happening (R-7.1). Drawn for a visitor.
const meta: Meta = { title: "content/content-view/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <ContentPage>
        <Waiting label="Loading page" />
      </ContentPage>
    </SitePage>
  ),
};
