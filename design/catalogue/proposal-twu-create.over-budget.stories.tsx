import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, InlineAlert, Link, NumberField } from "@bcgov/design-system-react-components";
import { Fieldset, VENDOR } from "./opportunity-kit";
import {
  AlertTitle,
  CatalogueNote,
  CreateHead,
  Focused,
  FormPart,
  GroupError,
  ProposalFormPage,
  TWU_OPPORTUNITY,
} from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-twu-create · over-budget — submitted with hourly rates that, applied at each resource's target allocation
// across the contract, come to more than the opportunity's maximum budget. The refusal names the total and the budget
// and asks for lower rates. The same check runs when a proposal is edited (R-2.10)
const meta: Meta = { title: "proposals/proposal-twu-create/over-budget", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const rate = { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

export const OverBudget: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR} current="opportunities">
      <ProposalFormPage
        head={<CreateHead title="Create a Team With Us proposal" opportunity={TWU_OPPORTUNITY.title} />}
        messages={
          <Focused>
            <InlineAlert variant="danger" role="alert">
              <AlertTitle>This proposal has 1 problem</AlertTitle>
              <ul className="pp-errors">
                <li data-testid="field-error">
                  <Link href="#proposal-cost-error">Cost: at these rates the contract would cost more than the maximum budget of $900,000</Link>
                </li>
              </ul>
            </InlineAlert>
          </Focused>
        }
        intro={
          <>
            <p className="op-text">A draft can be saved with any field blank. Every required field is needed to submit.</p>
            <CatalogueNote>
              The opportunity summary, the organization, the rest of each team member's row, the resource questions and the
              attachments are as in the default story and are trimmed here.
            </CatalogueNote>
          </>
        }
        summary={TWU_OPPORTUNITY}
        actions={
          <>
            <Button variant="primary" size="medium" data-testid="proposal-submit">Submit proposal</Button>
            <Button variant="secondary" size="medium" data-testid="proposal-save-draft">Save draft</Button>
            <Button variant="tertiary" size="medium" data-testid="proposal-cancel">Cancel</Button>
          </>
        }
      >
        <FormPart id="form-team" title="2. Team">
          <Fieldset legend="Resource 1: Full stack developer, 100% of full time">
            <NumberField
              id="proposal-resource-1-rate-one"
              label="Hourly rate for Test Developer One"
              isRequired
              description="At least $1."
              formatOptions={rate}
              defaultValue={340}
              aria-describedby="proposal-cost-error"
              data-testid="proposal-hourly-rate-field"
            />
          </Fieldset>
          <Fieldset legend="Resource 2: Data professional, 50% of full time">
            <NumberField
              id="proposal-resource-2-rate-two"
              label="Hourly rate for Test Developer Two"
              isRequired
              description="At least $1."
              formatOptions={rate}
              defaultValue={300}
              aria-describedby="proposal-cost-error"
              data-testid="proposal-hourly-rate-field"
            />
          </Fieldset>
        </FormPart>

        <FormPart id="form-cost" title="3. Cost">
          <p className="op-text">
            Each hourly rate is applied at its resource's target allocation across the contract, from November 2, 2026 to October
            29, 2027. The total must not be more than the opportunity's maximum budget.
          </p>
          <div role="status">
            <p className="op-text">Estimated cost over the contract: $918,750 of the $900,000 maximum budget.</p>
          </div>
          <GroupError id="proposal-cost-error">
            At these rates the contract would cost $918,750, which is more than the opportunity's maximum budget of $900,000.
            Lower one or more hourly rates.
          </GroupError>
        </FormPart>
      </ProposalFormPage>
    </SitePage>
  ),
};
