import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@bcgov/design-system-react-components";
import {
  BodyEditor,
  ContentPage,
  FieldPair,
  FixedPageWarning,
  LockedAddressField,
  ManageHead,
  PageForm,
  PublishHint,
  PublishRow,
  TitleField,
} from "./content-kit";
import { ADMIN, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · editing-fixed — the administrator is editing "about", a page the service needs. The title and body can
// be changed; the address is shown but cannot be typed over, and the warning stays in view (R-7.25).
const meta: Meta = { title: "content/content-edit/editing-fixed", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const EditingFixed: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="about" />
        <FixedPageWarning slug="about" />
        <Region id="content-edit-heading" title="Edit the page">
          <p className="op-text">The title and body are required. Your changes are public as soon as you publish them.</p>
          <Form validationBehavior="aria">
            <PageForm>
              <FieldPair>
                <TitleField value="About the Digital Marketplace" />
                <LockedAddressField value="about" />
              </FieldPair>
              <BodyEditor value="Initial version" />
              <PublishHint>You will be asked to confirm before your changes are published.</PublishHint>
              <PublishRow mode="edit" />
            </PageForm>
          </Form>
        </Region>
      </ContentPage>
    </SitePage>
  ),
};
