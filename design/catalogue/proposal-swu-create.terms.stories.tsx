import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Checkbox, Dialog, Heading, Link, Modal, Text } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import { CatalogueNote, CreateHead, ProposalFormPage, SWU_OPPORTUNITY } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-create · terms — Submit proposal was pressed. The dialog asks for the Sprint With Us terms and the
// service's terms, and its Submit proposal button stays disabled until both boxes are ticked. Submitting records the
// acceptance (R-2.3)
const meta: Meta = { title: "proposals/proposal-swu-create/terms", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Terms: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Sprint With Us proposal" opportunity={SWU_OPPORTUNITY.title} />}
        summary={SWU_OPPORTUNITY}
        actions={
          <>
            <Button variant="primary" size="medium" data-testid="proposal-submit">Submit proposal</Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-draft">Save draft</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel">Cancel</Button>
          </>
        }
        dialogs={
          <Modal isOpen isDismissable>
            <Dialog isCloseable data-testid="proposal-terms-dialog">
              <div className="pp-dialog">
                <Heading level={2} slot="title" className="pf-part-title">
                  Submit your proposal
                </Heading>
                <Text elementType="p">
                  To submit, accept the Sprint With Us terms and conditions and the Digital Marketplace terms and conditions. Your
                  acceptance is recorded when you submit.
                </Text>
                <Text elementType="p">
                  Read the <Link href="/content/sprint-with-us-terms-and-conditions">Sprint With Us terms and conditions</Link> and
                  the <Link href="/content/terms-and-conditions">Digital Marketplace terms and conditions</Link>.
                </Text>
                <Checkbox isRequired data-testid="proposal-accept-program-terms">
                  I accept the Sprint With Us terms and conditions
                </Checkbox>
                <Checkbox isRequired data-testid="proposal-accept-app-terms">
                  I accept the Digital Marketplace terms and conditions
                </Checkbox>
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
        }
      >
        <CatalogueNote>The completed form is as in the default story and is trimmed here.</CatalogueNote>
      </ProposalFormPage>
    </SitePage>
  ),
};
