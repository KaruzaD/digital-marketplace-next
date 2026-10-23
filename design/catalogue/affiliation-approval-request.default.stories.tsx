import type { Meta, StoryObj } from "@storybook/react-vite";
import { INVITED_VENDOR, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";

// affiliation-approval-request · default — the invited person accepts their own pending invitation by request. The
// membership becomes active (R-3.9).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-approval-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={INVITED_VENDOR}>
      <ResponseReference
        title="Accept a membership, by request"
        idPrefix="affiliation-approval"
        request={[
          {
            term: "Accept a membership",
            value: "PUT /api/affiliations/7c41e2d0-93a5-4b8e-a1f6-000000000301, sending the approve action",
            testId: "affiliation-approval-request-accept",
          },
          { term: "Asked by", value: "The invited person, while the invitation is pending" },
        ]}
        answer={[
          { term: "Outcome", value: "Accepted", testId: "affiliation-approval-request-accepted" },
          { term: "Membership status", value: "ACTIVE", testId: "affiliation-approval-request-membership-status" },
          { term: "What changed", value: "The person is an active member and now counts towards the team’s size and capabilities." },
        ]}
      />
    </SitePage>
  ),
};
