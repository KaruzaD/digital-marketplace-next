import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Checkbox, Dialog, Heading, Link, Modal } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import { CatalogueNote, ProposalActions, ProposalHead, ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-edit · terms — Submit proposal (or Save changes and submit) was pressed on a draft. The terms dialog is
// open, and its Submit proposal button stays disabled until both terms are ticked. The organization's qualification is
// checked again when the proposal is submitted (R-2.3, R-2.16)
const meta: Meta = { title: "proposals/proposal-swu-edit/terms", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Terms: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="dashboard">
      <ProposalPage>
        <ProposalHead
          eyebrow="Manage a Sprint With Us proposal"
          program="sprint-with-us"
          status="Draft"
          title="Modernize the licence renewal service"
        />
        <ProposalActions>
          <Button variant="secondary" data-testid="proposal-edit-button">Edit</Button>
          <Button variant="primary" data-testid="proposal-submit">Submit proposal</Button>
          <Button variant="secondary" danger data-testid="proposal-delete-button">Delete</Button>
        </ProposalActions>
        <CatalogueNote>The rest of the page is as in the draft story and is trimmed here.</CatalogueNote>
        <Modal isOpen isDismissable>
          <Dialog isCloseable data-testid="proposal-terms-dialog">
            <div className="pp-dialog">
              <Heading level={2} slot="title" className="pf-part-title">
                Submit your proposal
              </Heading>
              <p className="op-text">
                To submit, accept the Sprint With Us terms and conditions and the Digital Marketplace terms and conditions. Your
                acceptance is recorded when you submit.
              </p>
              <p className="op-text">
                Read the <Link href="/content/sprint-with-us-terms-and-conditions">Sprint With Us terms and conditions</Link> and
                the <Link href="/content/terms-and-conditions">Digital Marketplace terms and conditions</Link>.
              </p>
              <Checkbox isRequired data-testid="proposal-accept-program-terms">I accept the Sprint With Us terms and conditions</Checkbox>
              <Checkbox isRequired data-testid="proposal-accept-app-terms">I accept the Digital Marketplace terms and conditions</Checkbox>
              <p id="proposal-terms-hint" className="op-note">Tick both boxes to submit.</p>
              <ButtonGroup ariaLabel="Submit choices">
                <Button variant="primary" isDisabled aria-describedby="proposal-terms-hint" data-testid="proposal-submit-confirm">
                  Submit proposal
                </Button>
                <Button variant="secondary" data-testid="proposal-dialog-cancel">Cancel</Button>
              </ButtonGroup>
            </div>
          </Dialog>
        </Modal>
      </ProposalPage>
    </SitePage>
  ),
};
