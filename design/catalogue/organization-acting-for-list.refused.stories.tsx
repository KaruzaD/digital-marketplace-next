import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseReference } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";

// organization-acting-for-list · refused — a signed-in member of public sector staff, or a visitor who is not signed in,
// asks for the organizations they may act for. The request is refused as not permitted, never answered with an empty
// list (R-3.20, which replaces R-3.16). Drawn for public sector staff.
// Not a screen: the address answers with data. This response reference names the parts of the answer.
const meta: Meta = { title: "organizations/organization-acting-for-list/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <ResponseReference
        title="Organizations one may act for"
        idPrefix="organization-acting-for"
        request={[
          { term: "Ask for the organizations one may act for", value: "GET /api/ownedOrganizations" },
          {
            term: "Asked by",
            value: "Anyone who is not a signed-in vendor: public sector staff, an administrator, or a visitor who is not signed in",
          },
        ]}
        answer={[
          { term: "Outcome", value: "Refused: not permitted", testId: "organization-acting-for-list-refused" },
          {
            term: "Organizations offered",
            value: "None. The answer is a refusal, not an empty list, so it cannot be mistaken for a vendor with no organizations.",
          },
        ]}
      />
    </SitePage>
  ),
};
