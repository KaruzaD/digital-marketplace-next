import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Link } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, FieldPair, ManageHead, PageForm, PublishProblems, PublishRow, TitleField } from "./content-kit";
import { ADMIN, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · invalid — while editing, the title was cleared and the body grew past 50,000 characters. Each field is
// marked with its reason, the problems are listed before the unavailable Publish changes button, and nothing is saved
// (R-7.20). The body shown is a short stand-in for the overlong text.
const meta: Meta = { title: "content/content-edit/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <Region id="content-edit-heading" title="Edit the page">
          <p className="op-text">Every field is required. Your changes are public as soon as you publish them.</p>
          <Form validationBehavior="aria">
            <PageForm>
              <FieldPair>
                <TitleField value="" error="Enter a title" />
                <AddressField
                  value="hackathon-rules"
                  description="Changing the address moves the page at once. Links to the old address will stop working."
                  resulting="https://digital-marketplace.example/content/hackathon-rules"
                />
              </FieldPair>
              <BodyEditor
                value="Placeholder: stands in for a body of 50,012 characters."
                error="The body is 50,012 characters long. Shorten it to 50,000 characters or fewer."
              />
              <PublishProblems title="Fix 2 fields to publish your changes">
                <li data-testid="field-error"><Link href="#content-title">Title: enter a title</Link></li>
                <li data-testid="field-error"><Link href="#content-body">Body: shorten it to 50,000 characters or fewer</Link></li>
              </PublishProblems>
              <PublishRow mode="edit" disabled />
            </PageForm>
          </Form>
        </Region>
      </ContentPage>
    </SitePage>
  ),
};
