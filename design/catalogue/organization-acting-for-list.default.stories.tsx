import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-acting-for-list · default — a signed-in vendor who owns one organization, administers a second, is an
// ordinary member of a third and owns a fourth that has been archived asks for the organizations they may act for. The
// first two are answered; the third and fourth are not (R-3.15).
// Not a screen: the address answers with data. This response reference names the parts of the answer.
const meta: Meta = { title: "organizations/organization-acting-for-list/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <ResponseReference
        title="Organizations one may act for"
        idPrefix="organization-acting-for"
        request={[
          { term: "Ask for the organizations one may act for", value: "GET /api/ownedOrganizations" },
          { term: "Asked by", value: "A signed-in vendor" },
        ]}
        answer={[
          { term: "Outcome", value: "Answered" },
          {
            term: "Organizations offered",
            value: (
              <AnswerList
                testId="organization-acting-for-list-organizations"
                items={["Northwind Digital Co-operative (owned)", "Pacific Service Design Ltd. (administered)"]}
              />
            ),
          },
          { term: "Not offered", value: "An organization the vendor is only an ordinary member of, and any archived organization, even one they own" },
        ]}
      />
    </SitePage>
  ),
};
