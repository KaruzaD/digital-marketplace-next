import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ButtonGroup, Checkbox, CheckboxGroup } from "@bcgov/design-system-react-components";
import { Region } from "./opportunity-kit";
import { ManagementTop, OrganizationPage, SaveStatus } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { ADMINISTRATOR } from "./user-kit";

// organization-edit · service-areas-editing — a service administrator has kept one of the two approved areas, cleared
// the other and ticked a third; saving replaces the approvals with exactly what is ticked (R-3.28)
// Service area names are illustrative: the spec does not carry the service's list.
const meta: Meta = { title: "organizations/organization-edit/service-areas-editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const serviceAreas = [
  { id: "full-stack-developer", label: "Full stack developer" },
  { id: "data-professional", label: "Data professional" },
  { id: "agile-coach", label: "Agile coach" },
  { id: "devops-specialist", label: "DevOps specialist" },
  { id: "service-designer", label: "Service designer" },
];

export const ServiceAreasEditing: StoryObj = {
  render: () => (
    <SitePage viewer={ADMINISTRATOR} current="organizations">
      <OrganizationPage>
        <ManagementTop current="twu-qualification" />
        <Region id="tab-heading" title="Team With Us qualification">
          <Region id="areas-heading" title="Approved service areas" level={3}>
            <p className="op-text">Saving replaces this organization’s approvals with exactly the areas ticked.</p>
            <CheckboxGroup label="Service areas this organization is approved for" defaultValue={["full-stack-developer", "agile-coach"]}>
              {serviceAreas.map((a) => (
                <Checkbox key={a.id} value={a.id} data-testid="organization-service-area-checkbox">
                  {a.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
            <ButtonGroup ariaLabel="Service area actions">
              <Button variant="primary" data-testid="organization-save-service-areas-button">
                Save service areas
              </Button>
              <Button variant="secondary" data-testid="organization-cancel-service-areas-button">
                Cancel
              </Button>
            </ButtonGroup>
            <SaveStatus />
          </Region>
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
