import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpportunityPage, PageTitle } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// scheduled-transition-trigger · default — requesting /status reports that the service is up, and the same request
// closes any published opportunity whose proposal deadline has passed (R-1.1)
const meta: Meta = {
  title: "opportunities/scheduled-transition-trigger/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <OpportunityPage testId="service-status-page">
        <PageTitle>Service status</PageTitle>
        <p className="op-text" data-testid="service-status-message">
          The Digital Marketplace is up.
        </p>
      </OpportunityPage>
    </SitePage>
  ),
};
