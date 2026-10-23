import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_TWO } from "./user-kit";

// user-account-request · refused — somebody who is neither the account's owner nor an administrator asks for the
// account record and is refused rather than answered (R-4.25). In the interface the same refusal is shown as a
// missing page; here it is the answer itself. Not a screen: the address answers with data. This response reference
// names the answer. Drawn for another vendor.
const meta: Meta = { title: "users/user-account-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_TWO}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>An account record</PageTitle>
        </div>
        <Region id="user-account-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/users/7c1d9e42-3a5b-4f80-9e21-000000000401" },
              { term: "Asked by", value: "Another vendor, who is neither the account's owner nor an administrator" },
            ]}
          />
        </Region>
        <Region id="user-account-request-answer" title="Answer">
          <div data-testid="user-account-refused">
            <Details
              items={[
                { term: "Outcome", value: "Refused: not permitted", testId: "user-account-refusal-status" },
                { term: "Account record", value: "None. The answer carries nothing from the account." },
              ]}
            />
          </div>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
