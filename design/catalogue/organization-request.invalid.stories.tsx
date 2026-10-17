import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, ORGANIZATION_REQUESTS, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-request · invalid — a signed-in vendor registers an organization by request with a contact email of
// "not-an-email", R-3.22's own example. It is refused under the field's name and nothing is created. No criterion gives
// the message's words, so it is a placeholder (see DESIGN.md, "Organization screens in the chosen direction", gaps).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "organizations/organization-request/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <ResponseReference
        title="Requests about an organization"
        idPrefix="organization-request"
        requestTitle="Requests"
        request={[
          ...ORGANIZATION_REQUESTS,
          {
            term: "Sent",
            value:
              "A registration. Legal name: Harbourline Software Ltd. Street address: 200 Example Avenue. City: Nanaimo. Region: British Columbia. Mail code: V0V 0V1. Country: Canada. Contact name: Test Vendor One. Contact email: not-an-email",
          },
          { term: "Asked by", value: "A signed-in vendor who has accepted the terms and conditions" },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: invalid request", testId: "organization-request-refusal-status" },
          { term: "Filed under", value: "contactEmail", testId: "organization-request-refusal-reason" },
          {
            term: "Messages, in the order given",
            value: (
              <AnswerList
                ordered
                testId="organization-request-refusal-messages"
                items={["Placeholder: the service’s message for an invalid contact email, whose words the criteria do not give"]}
              />
            ),
          },
          { term: "What changed", value: "Nothing. No organization is created, so the answer carries no identifier." },
        ]}
      />
    </SitePage>
  ),
};
