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

// proposal-swu-create · unqualified-organization — the chosen organization is not a qualified supplier for Sprint With
// Us. The vendor is told as soon as it is chosen, can still save a draft, and a submission is refused. A proposal naming
// no organization is refused with "An organization must be specified before submitting." at the same field (R-2.16)
const meta: Meta = {
  title: "proposals/proposal-swu-create/unqualified-organization",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const UnqualifiedOrganization: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Sprint With Us proposal" opportunity={SWU_OPPORTUNITY.title} />}
        messages={
          <Focused testId="proposal-unqualified-organization-notice">
            <InlineAlert variant="warning">
              <AlertTitle>Example Digital Ltd. is not qualified for Sprint With Us</AlertTitle>
              <Text elementType="p">
                You can save this proposal as a draft, but it cannot be submitted for this organization until it is a qualified
                supplier for Sprint With Us. Qualification is checked again when you submit.
              </Text>
              <Link href="/organizations/org-1/sprint-with-us-terms-and-conditions">Review the organization's qualification</Link>
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
            data-testid="proposal-organization-field"
          />
        </FormPart>
        <CatalogueNote>The rest of the form is as in the default story and is trimmed here.</CatalogueNote>
      </ProposalFormPage>
    </SitePage>
  ),
};
