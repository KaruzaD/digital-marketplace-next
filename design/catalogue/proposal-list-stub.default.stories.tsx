import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { Actions, PageTitle, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-list-stub · default — the /proposals address. The old service left it as a stub reading only "Proposal
// List"; the criterion recording that (D-proposals-37) is obsolete and says the entry should go, but the ruled surface
// still carries it. This design lists nothing here and points to the dashboard, where R-2.24 puts a vendor's proposals.
// See the proposals domain's gaps in design/DESIGN.md
const meta: Meta = { title: "proposals/proposal-list-stub/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <ProposalPage>
        <PageTitle>Proposals</PageTitle>
        <div data-testid="proposal-list-placeholder">
          <p className="op-text">Your proposals, and your organizations' proposals, are listed on your dashboard.</p>
        </div>
        <Actions>
          <Link href="/dashboard" isButton buttonVariant="primary">
            Go to your dashboard
          </Link>
        </Actions>
      </ProposalPage>
    </SitePage>
  ),
};
