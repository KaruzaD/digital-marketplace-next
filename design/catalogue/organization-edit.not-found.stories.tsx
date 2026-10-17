import type { Meta, StoryObj } from "@storybook/react-vite";
import { MissingPage } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";
import { PUBLIC_SERVANT } from "./user-kit";

// organization-edit · not-found — an ordinary member, public sector staff, or anyone else who neither owns nor
// administers the organization nor is a service administrator; also an archived or unknown organization (R-3.3).
// Drawn for public sector staff, one of the two R-3.3 names; the page is the same for all of them.
const meta: Meta = { title: "organizations/organization-edit/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = {
  render: () => (
    <SitePage viewer={PUBLIC_SERVANT}>
      <MissingPage />
    </SitePage>
  ),
};
