import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";

// organization-create · not-found — anyone but a signed-in vendor who has accepted the terms (public sector staff,
// for one) is refused registration and shown the shared missing page (R-3.2; the presentation is gap 3)
const meta: Meta = { title: "organizations/organization-create/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <MissingPage />
    </SitePage>
  ),
};
