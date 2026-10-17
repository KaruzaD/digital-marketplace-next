import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-view · not-found — no page holds the address ("nothing-here"), or the address is not well formed
// ("Not_A_Slug"). A person browsing sees the shared missing page either way, and no page content (R-7.2, R-7.3). Drawn
// for a visitor who is not signed in.
const meta: Meta = { title: "content/content-view/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <MissingPage />
    </SitePage>
  ),
};
