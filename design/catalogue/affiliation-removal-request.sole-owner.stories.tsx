import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// affiliation-removal-request · sole-owner — a service administrator tries to end the membership of an organization's
// only owner, in an organization with two further active members. The team tab offers Remove on no owner's row, so this
// can only be asked by request. It is refused with the service's message, and the membership remains (R-3.11). The
// message's words are the surface's.
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-removal-request/sole-owner", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SoleOwner: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR}>
      <ResponseReference
        title="End a membership, by request"
        idPrefix="affiliation-removal"
        request={[
          {
            term: "End a membership",
            value: "DELETE /api/affiliations/7c41e2d0-93a5-4b8e-a1f6-000000000304",
            testId: "affiliation-removal-request-end",
          },
          { term: "Membership", value: "Test Vendor One, the only owner of Northwind Digital Co-operative, which has two further active members" },
          { term: "Asked by", value: "A service administrator" },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: invalid request", testId: "affiliation-removal-request-refusal-status" },
          {
            term: "Messages, in the order given",
            value: (
              <AnswerList
                ordered
                testId="affiliation-removal-request-refusal-messages"
                items={["Unable to remove membership. This is the sole owner for this organization."]}
              />
            ),
          },
          { term: "What changed", value: "Nothing. Test Vendor One is still the owner, and the team keeps its three active members." },
        ]}
      />
    </SitePage>
  ),
};
