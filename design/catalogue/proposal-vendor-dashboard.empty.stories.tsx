import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-vendor-dashboard · empty — a vendor who owns an organization, before anyone has started a proposal. Each
// heading keeps its place and says in words that its list is empty (R-2.24)
const meta: Meta = { title: "proposals/proposal-vendor-dashboard/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <PageTitle>Dashboard</PageTitle>
        <nav aria-label="Dashboard sections">
          <Actions>
            <Link href="#my-proposals" data-testid="dashboard-show-my-proposals">
              My proposals
            </Link>
            <Link href="#organization-proposals" data-testid="dashboard-show-org-proposals">
              My organizations' proposals
            </Link>
          </Actions>
        </nav>
        <Region id="my-proposals" title="My proposals">
          <div data-testid="dashboard-empty-my-proposals">
            <p className="op-text">
              You have not started any proposals. <Link href="/opportunities">Browse opportunities</Link> to find one to bid on.
            </p>
          </div>
        </Region>
        <Region id="organization-proposals" title="My organizations' proposals">
          <div data-testid="dashboard-empty-org-proposals">
            <p className="op-text">No one has started a proposal for an organization you own or administer.</p>
          </div>
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
