import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, RequestReference } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-request · invalid — an administrator sends something the service will not take: a title or body of the wrong
// length (R-7.20), an address that is not lowercase letters and digits in hyphen-separated groups (R-7.21), an address
// another page holds (R-7.22), a rename or removal of a page the service needs (R-7.25), or a read at an address that is
// not well formed (R-7.3). Nothing changes. Not a screen: the address answers with data. This response reference names
// the parts of the answer.
const meta: Meta = { title: "content/content-request/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <ContentPage>
        <RequestReference
          requests={[
            { term: "Read one page", value: "GET /api/content/Not_A_Slug", testId: "content-request-read-page" },
            { term: "Create a page", value: "POST /api/content, sending an empty title", testId: "content-request-create" },
            { term: "Change a page", value: "PUT /api/content/hackathon-rules, sending a body over 50,000 characters", testId: "content-request-change" },
            { term: "Rename a page", value: "PUT /api/content/about, sending a new address for a page the service needs", testId: "content-request-rename" },
            { term: "Remove a page", value: "DELETE /api/content/about, a page the service needs", testId: "content-request-remove" },
            { term: "Asked by", value: "An administrator" },
          ]}
          answer={[
            { term: "Outcome", value: "Refused: invalid request", testId: "content-request-refusal-status" },
            {
              term: "Form of the answer",
              value: "A refusal of what was sent, naming the failing field (title, address or body) or the address asked for",
              testId: "content-request-refusal-shape",
            },
            { term: "What changed", value: "Nothing. No page is created, changed, renamed or removed." },
          ]}
        />
      </ContentPage>
    </SitePage>
  ),
};
