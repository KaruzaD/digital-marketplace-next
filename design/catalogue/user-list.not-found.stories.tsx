import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";

// user-list · not-found — anyone but an administrator opening /users (R-4.21, R-4.15); drawn for a public sector
// employee, whose header offers no Users section
const meta: Meta = { title: "users/user-list/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <MissingPage />
    </SitePage>
  ),
};
