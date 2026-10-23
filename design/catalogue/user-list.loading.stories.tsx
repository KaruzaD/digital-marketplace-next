import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, UserPage } from "./user-kit";

// user-list · loading — the list of accounts has not arrived yet (R-4.14)
const meta: Meta = { title: "users/user-list/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>Digital Marketplace Users</PageTitle>
        <Waiting label="Loading users" />
      </UserPage>
    </SitePage>
  ),
};
