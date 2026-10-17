import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-profile-self · loading — the signed-in person's record has not arrived yet (R-4.26)
const meta: Meta = { title: "users/user-profile-self/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>User Profile</PageTitle>
        <Waiting label="Loading your profile" />
      </UserPage>
    </SitePage>
  ),
};
