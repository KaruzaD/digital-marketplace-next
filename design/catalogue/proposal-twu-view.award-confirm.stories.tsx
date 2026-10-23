import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal } from "@bcgov/design-system-react-components";
import { ADMIN } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · award-confirm — Award was pressed on a fully evaluated proposal. Only a fully evaluated proposal,
// or one previously passed over, is offered Award (R-2.33, R-2.36)
const meta: Meta = { title: "proposals/proposal-twu-view/award-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const AwardConfirm: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Evaluated"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <ProposalActions>
          <Button variant="primary" data-testid="proposal-award-button">Award</Button>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the evaluated story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="confirmation"
            title="Award this proposal?"
            data-testid="proposal-award-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Cancel</Button>
                <Button variant="primary" data-testid="proposal-award-confirm">Award proposal</Button>
              </>
            }
          >
            <p className="op-text">
              The opportunity will be awarded to this proponent. Every other proposal still in contention will be marked not
              awarded. The winner will be sent an award notice and every other proponent a decision notice. Disqualified and
              withdrawn proposals keep their state.
            </p>
          </AlertDialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
