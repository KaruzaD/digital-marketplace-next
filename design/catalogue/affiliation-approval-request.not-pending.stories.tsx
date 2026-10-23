import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, INVITED_VENDOR, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";

// affiliation-approval-request · not-pending — the invited person, having already accepted, asks to accept the same
// membership again. It is refused as not pending, and the membership stays active (R-3.9).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-approval-request/not-pending", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotPending: StoryObj = {
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
          { term: "Asked by", value: "The invited person, after the membership is already active" },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: invalid request", testId: "affiliation-approval-request-refusal-status" },
          {
            term: "Messages, in the order given",
            value: <AnswerList ordered testId="affiliation-approval-request-refusal-messages" items={["Membership is not pending."]} />,
          },
          { term: "What changed", value: "Nothing. The membership is still active." },
        ]}
      />
    </SitePage>
  ),
};
