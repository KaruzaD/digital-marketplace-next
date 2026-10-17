import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, RequestReference } from "./content-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-request · not-found — anybody asks for a page at a well-formed address that no page holds, and is answered
// that it was not found (R-7.2). Not a screen: the address answers with data. This response reference names the parts of
// the answer. Drawn for a visitor who is not signed in.
const meta: Meta = { title: "content/content-request/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <ContentPage>
        <RequestReference
          requestTitle="Request"
          requests={[
            { term: "Read one page", value: "GET /api/content/nothing-here", testId: "content-request-read-page" },
            { term: "Asked by", value: "Anyone, signed in or not" },
          ]}
          answer={[
            { term: "Outcome", value: "Not found", testId: "content-request-refusal-status" },
            { term: "Page", value: "None. The answer carries no title, body or dates." },
          ]}
        />
      </ContentPage>
    </SitePage>
  ),
};
