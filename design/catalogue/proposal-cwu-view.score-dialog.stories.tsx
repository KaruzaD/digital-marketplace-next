import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Dialog, Form, Heading, Modal, NumberField } from "@bcgov/design-system-react-components";
import { STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-cwu-view · score-dialog — Enter score was pressed. The one score is out of 100 with up to two decimal places,
// and entering it moves the proposal from under review to evaluated (R-2.26, R-2.27)
const meta: Meta = { title: "proposals/proposal-cwu-view/score-dialog", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ScoreDialog: StoryObj = {
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
          <Dialog isCloseable data-testid="proposal-score-dialog">
            <Form validationBehavior="aria" className="pp-dialog">
              <Heading level={2} slot="title" className="pf-part-title">
                Enter score
              </Heading>
              <p className="op-text">
                Entering a score moves this proposal from under review to evaluated. The score is recorded in its history.
              </p>
              <NumberField
                label="Score (%)"
                isRequired
                description="Between 0 and 100, with up to two decimal places."
                data-testid="proposal-score-field"
              />
              <ButtonGroup ariaLabel="Score choices">
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Cancel</Button>
                <Button type="submit" variant="primary" data-testid="proposal-score-confirm">Enter score</Button>
              </ButtonGroup>
            </Form>
          </Dialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
