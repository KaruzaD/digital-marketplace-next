import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage } from "./content-kit";
import { PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-footer · default — the footer every screen carries, here under a placeholder page as a visitor who is not
// signed in sees it. Its links are the original site's eight; the five pages the service keeps for its own prose
// (About, Disclaimer, Privacy, Accessibility, Copyright) open the page held at that address (R-7.19). Signed-in viewers
// see the same footer.
const meta: Meta = { title: "content/content-footer/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="home">
      <ContentPage>
        <PageTitle>Digital Marketplace</PageTitle>
        <p className="op-text">Placeholder: the page above the footer is designed by its own domain.</p>
      </ContentPage>
    </SitePage>
  ),
};
