import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, FieldPair, ManageHead, PageForm, PublishHint, PublishRow, TitleField } from "./content-kit";
import { ADMIN, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · editing — the administrator pressed Edit page on an ordinary page. Title, address and body can all be
// changed (R-7.8); the address field says that a new address moves the page at once and leaves nothing at the old one
// (R-7.24). Only the current wording is offered for editing, with no earlier version to go back to (R-7.23).
const meta: Meta = { title: "content/content-edit/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Editing: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="Hackathon rules" />
        <Region id="content-edit-heading" title="Edit the page">
          <p className="op-text">Every field is required. Your changes are public as soon as you publish them.</p>
          <Form validationBehavior="aria">
            <PageForm>
              <FieldPair>
                <TitleField value="Hackathon rules" />
                <AddressField
                  value="hackathon-rules"
                  description="Changing the address moves the page at once. Links to the old address will stop working."
                  resulting="https://digital-marketplace.example/content/hackathon-rules"
                />
              </FieldPair>
              <BodyEditor value="Placeholder: the rules of the hackathon, written by an administrator." />
              <PublishHint>You will be asked to confirm before your changes are published.</PublishHint>
              <PublishRow mode="edit" />
            </PageForm>
          </Form>
        </Region>
      </ContentPage>
    </SitePage>
  ),
};
