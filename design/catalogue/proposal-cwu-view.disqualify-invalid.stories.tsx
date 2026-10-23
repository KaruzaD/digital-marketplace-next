import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Modal, TextArea } from "@bcgov/design-system-react-components";
import { STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · disqualify-invalid — Disqualify proposal was pressed with no reason. It is refused at the field,
// focus goes there, and the proposal is not disqualified (R-2.34)
const meta: Meta = { title: "proposals/proposal-cwu-view/disqualify-invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DisqualifyInvalid: StoryObj = {
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
                defaultValue=""
                isInvalid
                errorMessage="Enter a reason for disqualifying this proposal"
                data-testid="proposal-disqualify-reason-field"
              />
            </div>
          </AlertDialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
