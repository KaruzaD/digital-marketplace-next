import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-edit · withdraw-confirm — the vendor asked to withdraw their submitted proposal. The dialog says until
// when it can go back in and who will be told. Withdrawing also frees the organization to be changed (R-2.22, R-2.23,
// R-2.36)
const meta: Meta = { title: "proposals/proposal-twu-edit/withdraw-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const WithdrawConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead eyebrow="Manage a Team With Us proposal" program="team-with-us" status="Submitted" title="Data platform team" />
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="secondary" danger data-testid="proposal-withdraw-button">Withdraw</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the default story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="warning"
            title="Withdraw this proposal?"
            data-testid="proposal-withdraw-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Keep proposal</Button>
                <Button variant="primary" data-testid="proposal-withdraw-confirm">Withdraw proposal</Button>
              </>
            }
          >
            <p className="op-text">
              It will no longer be considered. You can submit it again only while the opportunity is accepting proposals, until
              October 2, 2026 at 4:00 p.m. Pacific time. You and the administrators will be sent a withdrawal notice.
            </p>
          </AlertDialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
