import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextArea } from "@bcgov/design-system-react-components";
import { STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-view · disqualify-dialog — Disqualify was pressed during the code challenge. It is offered at every
// stage and needs a written reason, which is kept in the history. A missing reason is refused at the field, as in
// proposal-cwu-view · disqualify-invalid (R-2.34)
const meta: Meta = { title: "proposals/proposal-swu-view/disqualify-dialog", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DisqualifyDialog: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Sprint With Us proposal"
          program="sprint-with-us"
          status="Under review: code challenge"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <ProposalActions>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the code-challenge-tab story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <AlertDialog
            variant="destructive"
            title="Disqualify this proposal?"
            data-testid="proposal-disqualify-dialog"
            buttons={
              <>
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Cancel</Button>
                <Button variant="primary" danger data-testid="proposal-disqualify-confirm">Disqualify proposal</Button>
              </>
            }
          >
            <div className="op-dialog">
              <p className="op-text">The proposal will no longer be evaluated. The reason is kept in its history.</p>
              <TextArea
                label="Reason"
                isRequired
                maxLength={5000}
                description="Between 1 and 5,000 characters."
                data-testid="proposal-disqualify-reason-field"
              />
            </div>
          </AlertDialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
