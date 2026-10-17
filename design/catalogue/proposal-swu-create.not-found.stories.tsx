import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// proposal-swu-create · not-found — anyone who may not start a proposal: public sector staff, an administrator, a
// visitor who is not signed in, or a vendor who has never accepted the service's terms (R-2.1)
const meta: Meta = { title: "proposals/proposal-swu-create/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <MissingPage />
    </SitePage>
  ),
};
