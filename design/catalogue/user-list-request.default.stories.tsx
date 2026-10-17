import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, UserPage } from "./user-kit";

// user-list-request · default — an administrator asks for the list of everyone registered with the service and is
// answered with every account, each with its email address and account status (R-4.14, R-4.21). Not a screen: the
// address answers with data. This response reference names each part of the answer.
const meta: Meta = { title: "users/user-list-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR}>
      <UserPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>Everyone registered with the service</PageTitle>
        </div>
        <Region id="user-list-request-request" title="Request">
          <Details
            items={[
              { term: "Address", value: "/api/users" },
              { term: "Asked by", value: "An administrator" },
            ]}
          />
        </Region>
        <Region id="user-list-request-answer" title="Answer">
          <div data-testid="user-list-request-accounts">
            <Details
              items={[
                { term: "Outcome", value: "Answered" },
                {
                  term: "Accounts",
                  value:
                    "Every registered account, active and deactivated, each with its identifier, name, email address, account kind, account status and whether it is an administrator",
                },
              ]}
            />
          </div>
        </Region>
      </UserPage>
    </SitePage>
  ),
};
