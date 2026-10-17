import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerList, ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// affiliation-approval-request · refused — the organization's owner tries to accept a pending invitation on the invited
// person's behalf. The request is refused and the membership stays pending (R-3.9). The criteria do not give the
// permission message's words, so the message below is a placeholder (see DESIGN.md, organizations gap 17).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "organizations/affiliation-approval-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <ResponseReference
        title="Accept a membership, by request"
        idPrefix="affiliation-approval"
        request={[
          {
            term: "Accept a membership",
            value: "PUT /api/affiliations/7c41e2d0-93a5-4b8e-a1f6-000000000301, sending the approve action",
            testId: "affiliation-approval-request-accept",
          },
          { term: "Asked by", value: "Anyone but the invited person, such as the organization’s owner" },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: not permitted", testId: "affiliation-approval-request-refusal-status" },
          {
            term: "Messages, in the order given",
            value: (
              <AnswerList
                ordered
                testId="affiliation-approval-request-refusal-messages"
                items={["Placeholder: the service’s permission message, whose words the criteria do not give"]}
              />
            ),
          },
          { term: "What changed", value: "Nothing. The membership is still pending." },
        ]}
      />
    </SitePage>
  ),
};
