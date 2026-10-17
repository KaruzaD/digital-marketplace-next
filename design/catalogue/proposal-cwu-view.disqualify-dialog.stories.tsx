import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextArea } from "@bcgov/design-system-react-components";
import { STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · disqualify-dialog — Disqualify was pressed. A written reason of up to 5,000 characters is
// required and is kept in the proposal's history (R-2.34)
const meta: Meta = { title: "proposals/proposal-cwu-view/disqualify-dialog", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DisqualifyDialog: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Code With Us proposal"
          program="code-with-us"
          status="Under review"
          title={<span data-testid="proposal-proponent-name">Test Vendor</span>}
        />
        <ProposalActions>
          <Button variant="primary" data-testid="proposal-enter-score">Enter score</Button>
          <Button variant="secondary" danger data-testid="proposal-disqualify-button">Disqualify</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the default story and is trimmed here.</CatalogueNote>
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
            <div className="op-region">
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
