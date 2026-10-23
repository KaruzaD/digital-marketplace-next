import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, RequestReference } from "./content-kit";
import { ADMIN } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-request · default — an administrator asks the service to read the list of pages, read one page, create a page,
// change one, rename one and remove one, and each request is answered (R-7.5, R-7.1, R-7.7, R-7.8, R-7.24, R-7.9). Not a
// screen: the address answers with data. This response reference names the requests and the part of the answer the
// surface observes. Methods and addresses are the service's published interface description's.
const meta: Meta = { title: "content/content-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN}>
      <ContentPage>
        <RequestReference
          requests={[
            { term: "Read the list of pages", value: "GET /api/content", testId: "content-request-read-list" },
            { term: "Read one page", value: "GET /api/content/hackathon-rules", testId: "content-request-read-page" },
            { term: "Create a page", value: "POST /api/content, sending a title, an address and a body", testId: "content-request-create" },
            {
              term: "Change a page",
              value: "PUT /api/content/hackathon-rules, sending the new title and body with the same address",
              testId: "content-request-change",
            },
            { term: "Rename a page", value: "PUT /api/content/hackathon-rules, sending a new address", testId: "content-request-rename" },
            { term: "Remove a page", value: "DELETE /api/content/hackathon-rules", testId: "content-request-remove" },
            { term: "Asked by", value: "An administrator" },
          ]}
          answer={[
            { term: "Outcome", value: "Answered", testId: "content-request-accepted" },
            {
              term: "What comes back",
              value:
                "The list of every page; the page asked for, with its body and its published and updated dates; or the page as created, changed, renamed or removed",
            },
          ]}
        />
      </ContentPage>
    </SitePage>
  ),
};
