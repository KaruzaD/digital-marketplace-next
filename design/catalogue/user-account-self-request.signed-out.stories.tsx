import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";
import { UserPage } from "./user-kit";

// user-account-self-request · signed-out — a visitor who is not signed in asks for their own account record and is
// answered with no account at all, so the identifier and the notices moment are both empty. Not a screen: the address
// answers with data. This response reference names each part of the answer.
const meta: Meta = { title: "users/user-account-self-request/signed-out", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SignedOut: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>One's own account record</PageTitle>
        </div>
        <Region id="user-account-self-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/sessions/current" },
              { term: "Asked by", value: "A visitor who is not signed in" },
            ]}
          />
        </Region>
        <Region id="user-account-self-request-answer" title="Answer">
          <Details
            items={[
              { term: "Account identifier", value: "Empty: no account is answered", testId: "user-account-self-id" },
              { term: "New-opportunity notices since", value: "Empty", testId: "user-account-self-notices-since" },
            ]}
          />
        </Region>
      </UserPage>
    </SitePage>
  ),
};
