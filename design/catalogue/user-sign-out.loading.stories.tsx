import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle, Waiting } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { UserPage, VENDOR_ONE } from "./user-kit";

// user-sign-out · loading — the sign-out request is still in progress (R-4.17); the person is still signed in
const meta: Meta = { title: "users/user-sign-out/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE}>
      <UserPage>
        <PageTitle>Signing Out</PageTitle>
        <Waiting label="Signing you out" />
      </UserPage>
    </SitePage>
  ),
};
