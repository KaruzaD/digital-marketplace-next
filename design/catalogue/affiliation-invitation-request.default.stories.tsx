import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// affiliation-invitation-request · default — an organization's owner invites a registered vendor by email address,
// naming them as an ordinary member. The invitation is created as a pending membership, and the answer carries the new
// membership's identifier, which affiliation-approval-request takes (R-3.7, R-3.17).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-invitation-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <ResponseReference
        title="Invite somebody to an organization"
        idPrefix="affiliation-invitation"
        request={[
          {
            term: "Invite, naming a membership type",
            value: "POST /api/affiliations, sending the organization, the invited person’s email address and a membership type",
            testId: "affiliation-invitation-request-invite",
          },
          { term: "Sent", value: "Organization: Northwind Digital Co-operative. Email address: vendor.four@example.com. Membership type: MEMBER" },
          { term: "Asked by", value: "The organization’s owner" },
        ]}
        answer={[
          { term: "Outcome", value: "Created: the invitation is a pending membership", testId: "affiliation-invitation-request-created" },
          { term: "Membership identifier", value: "7c41e2d0-93a5-4b8e-a1f6-000000000301", testId: "affiliation-invitation-request-membership-id" },
          {
            term: "What changed",
            value: "The invited person has a pending invitation. They do not count towards the team’s size or capabilities until they accept it themselves.",
          },
        ]}
      />
    </SitePage>
  ),
};
