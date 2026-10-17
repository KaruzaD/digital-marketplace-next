import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// affiliation-invitation-request · invalid — an organization's owner invites somebody and names a membership type other
// than member or owner. The invitation is refused as an invalid membership type and nothing is created (R-3.17).
// Administrator rights are never granted by an invitation; they are given afterwards (R-3.12).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-invitation-request/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
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
          { term: "Sent", value: "Organization: Northwind Digital Co-operative. Email address: vendor.four@example.com. Membership type: ADMIN" },
          { term: "Asked by", value: "The organization’s owner" },
        ]}
        answer={[
          {
            term: "Outcome",
            value: "Refused: invalid membership type. Only a member or an owner may be named.",
            testId: "affiliation-invitation-request-invalid-membership-type",
          },
          { term: "What changed", value: "Nothing. No invitation is created and no email is sent." },
        ]}
      />
    </SitePage>
  ),
};
