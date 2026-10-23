import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, FieldPair, PageForm, PublishHint, PublishRow, TitleField } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · default — an administrator starts a new page. Title, address and body are all required (R-7.7,
// R-7.20); the address rule is stated beside the field and the full public address is shown as it is typed (R-7.21).
// Publish page is unavailable until every field is valid, and the reason is said in text before it.
const meta: Meta = { title: "content/content-create/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = {
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
              <TitleField />
              <AddressField resulting="https://digital-marketplace.example/content/" />
            </FieldPair>
            <BodyEditor />
            <PublishHint>Fill in the title, address and body to publish the page.</PublishHint>
            <PublishRow mode="create" disabled />
          </PageForm>
        </Form>
      </ContentPage>
    </SitePage>
  ),
};
