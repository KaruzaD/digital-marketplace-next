import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link, Select, Text } from "@bcgov/design-system-react-components";
import { VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  CatalogueNote,
  CreateHead,
  Focused,
  FormPart,
  ORGANIZATIONS,
  ProposalFormPage,
  SWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-swu-create · refused — the service refused the proposal because another proposal for this opportunity
// already names the organization. The refusal is the organization field's own error, with a link to the existing
// proposal. "You already have a proposal for this opportunity." (R-2.2) is shown as the Code With Us refused story
// shows it (R-2.2, R-2.11)
const meta: Meta = { title: "proposals/proposal-swu-create/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Sprint With Us proposal" opportunity={SWU_OPPORTUNITY.title} />}
        messages={
          <Focused>
            <InlineAlert variant="danger" role="alert">
              <AlertTitle>This proposal has 1 problem</AlertTitle>
              <ul className="pp-errors">
                <li data-testid="field-error">
                  <Link href="#proposal-organization">Organization: Please select a different organization.</Link>
                </li>
              </ul>
            </InlineAlert>
          </Focused>
        }
        intro={<p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>}
        summary={SWU_OPPORTUNITY}
        actions={
          <>
            <Button variant="primary" size="medium" data-testid="proposal-submit">Submit proposal</Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-draft">Save draft</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-organization" title="1. Organization">
          <Select
            id="proposal-organization"
            label="Organization"
            isRequired
            description="Organizations you own or administer. It must be a qualified supplier for Sprint With Us before you submit."
            items={ORGANIZATIONS}
            defaultValue="org-1"
            isInvalid
            errorMessage="Please select a different organization."
            data-testid="proposal-organization-field"
          />
          <Text elementType="p" size="small">
            Example Digital Ltd. already has a proposal for this opportunity.{" "}
            <Link href="/opportunities/sprint-with-us/7c1e2d40-5b1a-4c2e-9d3f-000000000201/proposals/3f8a2c10-6d4b-4e19-a7c5-000000000299/edit">
              Open the existing proposal
            </Link>
          </Text>
        </FormPart>
        <CatalogueNote>
          The opportunity summary and the rest of the form keep what the vendor entered. They are as in the default story and
          are trimmed here.
        </CatalogueNote>
      </ProposalFormPage>
    </SitePage>
  ),
};
