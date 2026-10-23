import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// affiliation-removal-request · default — a service administrator ends an ordinary member's membership by request. It
// is accepted: the membership becomes inactive rather than erased, and the person stops counting towards the team
// (R-3.10). Whether the membership remains is read afterwards from organization-edit's team rows.
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-removal-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR}>
      <ResponseReference
        title="End a membership, by request"
        idPrefix="affiliation-removal"
        request={[
          {
            term: "End a membership",
            value: "DELETE /api/affiliations/7c41e2d0-93a5-4b8e-a1f6-000000000303",
            testId: "affiliation-removal-request-end",
          },
          { term: "Membership", value: "Test Vendor Four, an active member of Northwind Digital Co-operative" },
          { term: "Asked by", value: "A service administrator" },
        ]}
        answer={[
          { term: "Outcome", value: "Accepted", testId: "affiliation-removal-request-accepted" },
          {
            term: "What changed",
            value: "The membership is inactive. Test Vendor Four is no longer on the team and no longer counts towards its size or capabilities.",
          },
        ]}
      />
    </SitePage>
  ),
};
