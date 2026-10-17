import type { Meta, StoryObj } from "@storybook/react-vite";
import { ORGANIZATION_REQUESTS, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-request · default — a signed-in vendor who has accepted the terms registers an organization by request,
// with every required field valid and the optional ones left out. It is accepted: the organization is created with the
// vendor as its owner, and the answer carries its identifier (R-3.2, R-3.22, R-3.23). The organization is then read
// afresh as the vendor. The values are test data.
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "organizations/organization-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
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
              "A registration. Legal name: Harbourline Software Ltd. Street address: 200 Example Avenue. City: Nanaimo. Region: British Columbia. Mail code: V0V 0V1. Country: Canada. Contact name: Test Vendor One. Contact email: vendor1@example.com",
          },
          { term: "Asked by", value: "A signed-in vendor who has accepted the terms and conditions" },
        ]}
        answer={[
          { term: "Outcome", value: "Accepted: 201 Created", testId: "organization-request-accepted" },
          { term: "Organization identifier", value: "4a9e1c20-6d3b-4f1a-8e2c-000000000206", testId: "organization-request-organization-id" },
          { term: "Active, read afresh", value: "Yes", testId: "organization-request-stored-active" },
          { term: "Legal name, read afresh", value: "Harbourline Software Ltd.", testId: "organization-request-stored-legal-name" },
        ]}
      />
    </SitePage>
  ),
};
