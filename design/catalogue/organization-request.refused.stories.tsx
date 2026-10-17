import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, ORGANIZATION_REQUESTS, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_TWO } from "./user-kit";

// organization-request · refused — an organization administrator who is not the owner sends a change to the
// organization's profile. The service checks who is asking before it looks at the fields, so it refuses as not
// permitted, and the organization, read afresh, is unchanged. An archive request from the same person is refused the
// same way and leaves the organization active; sent by the owner or a service administrator, either is accepted (R-3.18).
// No criterion gives the permission message's words, so it is a placeholder.
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "organizations/organization-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_TWO}>
      <ResponseReference
        title="Requests about an organization"
        idPrefix="organization-request"
        requestTitle="Requests"
        request={[
          ...ORGANIZATION_REQUESTS,
          {
            term: "Sent",
            value: "A profile change for Northwind Digital Co-operative, with every field as stored except the legal name: Northwind Digital Collective",
          },
          { term: "Asked by", value: "Test Vendor Two, an administrator of the organization who is not its owner" },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: not permitted", testId: "organization-request-refusal-status" },
          { term: "Filed under", value: "permissions", testId: "organization-request-refusal-reason" },
          {
            term: "Messages, in the order given",
            value: (
              <AnswerList
                ordered
                testId="organization-request-refusal-messages"
                items={["Placeholder: the service’s permission message, whose words the criteria do not give"]}
              />
            ),
          },
          { term: "Active, read afresh", value: "Yes", testId: "organization-request-stored-active" },
          { term: "Legal name, read afresh", value: "Northwind Digital Co-operative", testId: "organization-request-stored-legal-name" },
        ]}
      />
    </SitePage>
  ),
};
