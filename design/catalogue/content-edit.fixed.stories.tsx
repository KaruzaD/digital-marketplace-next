import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, CurrentWording, FixedPageWarning, ManageHead, PageActions, PageFacts } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · fixed — an administrator on the managing screen of "about", a page the service needs and created for
// itself, never edited. A warning says the service needs it at this address; no Delete page is offered (R-7.25). It still
// carries its stub wording and its address as its title (R-7.12), and names "System" as publisher and last editor (R-7.27).
const meta: Meta = { title: "content/content-edit/fixed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Fixed: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="about" />
        <PageFacts
          slug="about"
          published={{ iso: "2020-12-02", text: "December 2, 2020" }}
          publishedBy={{ name: "System" }}
          updated={{ iso: "2020-12-02", text: "December 2, 2020" }}
          updatedBy={{ name: "System" }}
        />
        <FixedPageWarning slug="about" />
        <PageActions deletable={false} />
        <CurrentWording title="about" slug="about" body="Initial version" />
      </ContentPage>
    </SitePage>
  ),
};
