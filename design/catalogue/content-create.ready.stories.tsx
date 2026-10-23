import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, FieldPair, PageForm, PublishHint, PublishRow, TitleField } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · ready — every field is filled in and valid, the full public address is shown, and Publish page is
// available (R-7.7, R-7.21)
const meta: Meta = { title: "content/content-create/ready", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Ready: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <PageTitle>Create a New Page</PageTitle>
        <p className="op-text">
          Every field is required. A page can be read by anyone, including people who are not signed in, as soon as it is
          published.
        </p>
        <Form validationBehavior="aria">
          <PageForm>
            <FieldPair>
              <TitleField value="Hackathon rules" />
              <AddressField value="hackathon-rules" resulting="https://digital-marketplace.example/content/hackathon-rules" />
            </FieldPair>
            <BodyEditor value="Placeholder: the rules of the hackathon, written by an administrator." />
            <PublishHint>You will be asked to confirm before the page is published.</PublishHint>
            <PublishRow mode="create" />
          </PageForm>
        </Form>
      </ContentPage>
    </SitePage>
  ),
};
