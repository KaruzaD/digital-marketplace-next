import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentPage, RequestReference } from "./content-kit";
import { VENDOR } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-request · refused — a signed-in vendor, a signed-in public sector employee or a visitor who is not signed in
// asks to read the list of pages, or to create, change, rename or remove a page. Nothing changes (R-7.10), and every one
// of those refusals is a permission refusal in one and the same form, never dressed up as a faulty submission (R-7.16).
// Not a screen: the address answers with data. This response reference names the parts of the answer. Drawn for the
// first requester the criterion names, a signed-in vendor.
const meta: Meta = { title: "content/content-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <ContentPage>
        <RequestReference
          requests={[
            { term: "Read the list of pages", value: "GET /api/content", testId: "content-request-read-list" },
            { term: "Create a page", value: "POST /api/content, sending a title, an address and a body", testId: "content-request-create" },
            {
              term: "Change a page",
              value: "PUT /api/content/hackathon-rules, sending the new title and body with the same address",
              testId: "content-request-change",
            },
            { term: "Rename a page", value: "PUT /api/content/hackathon-rules, sending a new address", testId: "content-request-rename" },
            { term: "Remove a page", value: "DELETE /api/content/hackathon-rules", testId: "content-request-remove" },
            { term: "Asked by", value: "Anyone but an administrator, signed in or not" },
          ]}
          answer={[
            { term: "Outcome", value: "Refused: not permitted", testId: "content-request-refusal-status" },
            {
              term: "Form of the answer",
              value:
                "A permission refusal, the same for all five requests: the reason is named as a lack of permission, never as something wrong with what was sent",
              testId: "content-request-refusal-shape",
            },
            { term: "What changed", value: "Nothing. No page is created, changed, renamed or removed, and no page is listed." },
          ]}
        />
      </ContentPage>
    </SitePage>
  ),
};
