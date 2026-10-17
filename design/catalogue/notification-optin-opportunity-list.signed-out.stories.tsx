import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpportunityListPage } from "./opportunity-list-page";
import { SitePage, VISITOR, WIDTHS } from "./site";

// notification-optin-opportunity-list · signed-out — a visitor who is not signed in has no account to record the
// choice on, so the control is not rendered (R-6.21 offers it to a signed-in person). Nothing takes its place: the
// results start with the first group, and there is no Watch. This is the opportunity list as the opportunities domain
// draws it for a visitor (opportunity-list · signed-out). Whether a visitor should instead be invited to sign in to get
// these emails is not stated (DESIGN.md, notifications gap 6).
const meta: Meta = {
  title: "notifications/notification-optin-opportunity-list/signed-out",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const SignedOut: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR} current="opportunities">
      <OpportunityListPage audience="visitor" />
    </SitePage>
  ),
};
