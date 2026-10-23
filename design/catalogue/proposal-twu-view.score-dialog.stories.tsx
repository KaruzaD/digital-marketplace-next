import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Dialog, Form, Heading, Modal, NumberField } from "@bcgov/design-system-react-components";
import { STAFF } from "./opportunity-kit";
import { CatalogueNote, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-view · score-dialog — Enter challenge score was pressed. Enter resource question scores opens the same
// dialog with one field per question. An out-of-range score is refused at the field, as in proposal-cwu-view ·
// score-invalid (R-2.28, R-2.30)
const meta: Meta = { title: "proposals/proposal-twu-view/score-dialog", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ScoreDialog: StoryObj = {
  render: () => (
    <SitePage viewer={STAFF} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Team With Us proposal"
          program="team-with-us"
          status="Under review: challenge"
          title={<span data-testid="proposal-proponent-name">Example Digital Ltd.</span>}
        />
        <div data-testid="proposal-score-actions">
          <Button variant="primary" data-testid="proposal-score-challenge">Enter challenge score</Button>
        </div>
        <CatalogueNote>The rest of the page is as in the challenge-tab story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <Dialog isCloseable data-testid="proposal-score-dialog">
            <Form validationBehavior="aria" className="pp-dialog">
              <Heading level={2} slot="title">Enter challenge score</Heading>
              <p className="op-text">The score is recorded in the proposal's history.</p>
              <NumberField
                label="Challenge score (%)"
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
