import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// user-notice · not-found — any :noticeId other than the two the service defines
const meta: Meta = { title: "users/user-notice/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <MissingPage />
    </SitePage>
  ),
};
