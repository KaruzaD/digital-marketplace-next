import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR, UserPage } from "./user-kit";

// user-profile · loading — the account record has not arrived yet (R-4.25); drawn for an administrator who opened the
// profile from the user list
const meta: Meta = { title: "users/user-profile/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="users">
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <Waiting label="Loading profile" />
      </UserPage>
    </SitePage>
  ),
};
