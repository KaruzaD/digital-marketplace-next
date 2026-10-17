import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-account-self-request · default — a signed-in person asks for their own account record and is answered with it,
// including the moment new-opportunity notices were turned on, or nothing when they are off (R-4.24, R-4.29). Not a
// screen: the address answers with data. This response reference names each part of the answer.
const meta: Meta = { title: "users/user-account-self-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>One's own account record</PageTitle>
        </div>
        <Region id="user-account-self-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/sessions/current" },
              { term: "Asked by", value: "A signed-in vendor who is being told about new opportunities" },
            ]}
          />
        </Region>
        <Region id="user-account-self-request-answer" title="Answer">
          <Details
            items={[
              { term: "Account identifier", value: "7c1d9e42-3a5b-4f80-9e21-000000000401", testId: "user-account-self-id" },
              {
                term: "New-opportunity notices since",
                value:
                  "2026-09-14T17:05:22.000Z. Empty when notices are off: turning them off clears the moment rather than recording when.",
                testId: "user-account-self-notices-since",
              },
            ]}
          />
        </Region>
      </UserPage>
    </SitePage>
  ),
};
