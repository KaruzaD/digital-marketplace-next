import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-account-request · default — a person asks for their own account record by identifier, or an administrator for
// anybody's, and is answered with it, including the moment new-opportunity notices were turned on, or nothing when
// they are off (R-4.24, R-4.25, R-4.29). Not a screen: the address answers with data. This response reference names
// each part of the answer. Drawn for the account's owner, a vendor.
const meta: Meta = { title: "users/user-account-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>An account record</PageTitle>
        </div>
        <Region id="user-account-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/users/7c1d9e42-3a5b-4f80-9e21-000000000401" },
              { term: "Asked by", value: "The account's owner, or an administrator" },
            ]}
          />
        </Region>
        <Region id="user-account-request-answer" title="Answer">
          <Details
            items={[
              { term: "Outcome", value: "Answered" },
              {
                term: "New-opportunity notices since",
                value:
                  "2026-09-14T17:05:22.000Z. Empty when notices are off: turning them off clears the moment rather than recording when.",
                testId: "user-account-notices-since",
              },
            ]}
          />
        </Region>
      </UserPage>
    </SitePage>
  ),
};
