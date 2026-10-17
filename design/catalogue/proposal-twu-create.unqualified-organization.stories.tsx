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
  TWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-create · unqualified-organization — the chosen organization is not a qualified supplier for Team With
// Us. The vendor is told as soon as it is chosen, can still save a draft, and a submission is refused (R-2.17)
const meta: Meta = {
  title: "proposals/proposal-twu-create/unqualified-organization",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const UnqualifiedOrganization: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Team With Us proposal" opportunity={TWU_OPPORTUNITY.title} />}
        messages={
          <Focused testId="proposal-unqualified-organization-notice">
            <InlineAlert variant="warning">
              <AlertTitle>Example Digital Ltd. is not qualified for Team With Us</AlertTitle>
              <Text elementType="p">
                You can save this proposal as a draft, but it cannot be submitted for this organization until it is a qualified
                supplier for Team With Us. Qualification is checked again when you submit.
              </Text>
              <Link href="/organizations/org-1/team-with-us-terms-and-conditions">Review the organization's qualification</Link>
            </InlineAlert>
          </Focused>
        }
        intro={<p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>}
        summary={TWU_OPPORTUNITY}
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
            description="Organizations you own or administer. It must be a qualified supplier for Team With Us, and provide every service area this opportunity needs, before you submit."
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
