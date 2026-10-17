import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT, UserPage } from "./user-kit";

// user-list-request · refused — a public sector employee who is not an administrator, a vendor, or a visitor who is
// not signed in asks for the list of everyone registered and is refused rather than answered, so no email address or
// account status is disclosed (R-4.21). Not a screen: the address answers with data. This response reference names
// the answer. Drawn for the first requester the criterion names, a public sector employee.
const meta: Meta = { title: "users/user-list-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>Everyone registered with the service</PageTitle>
        </div>
        <Region id="user-list-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/users" },
              { term: "Asked by", value: "Anyone but an administrator, signed in or not" },
            ]}
          />
        </Region>
        <Region id="user-list-request-answer" title="Answer">
          <div data-testid="user-list-request-refused">
            <Details
              items={[
                { term: "Outcome", value: "Refused: not permitted", testId: "user-list-request-refusal-status" },
                { term: "Accounts", value: "None. The answer carries no account, email address or account status." },
              ]}
            />
          </div>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
