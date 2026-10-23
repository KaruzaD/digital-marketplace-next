import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Link } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, DuplicateAddress, FieldPair, PageForm, PublishRow, TitleField } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · duplicate-slug — the administrator confirmed publishing a page at "about", where a page already
// exists. The service refused it: nothing was created, the existing page is untouched, and the address is reported as
// already in use, both at the top of the form and at the field (R-7.22). Everything typed is kept.
const meta: Meta = { title: "content/content-create/duplicate-slug", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DuplicateSlug: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <PageTitle>Create a New Page</PageTitle>
        <DuplicateAddress>
          Another page is already published at /content/about, so this page was not created.{" "}
          <Link href="#content-slug">Choose a different address</Link>.
        </DuplicateAddress>
        <Form validationBehavior="aria">
          <PageForm>
            <FieldPair>
              <TitleField value="About the Digital Marketplace" />
              <AddressField
                value="about"
                error="Another page already uses this address. Choose a different one."
                resulting="https://digital-marketplace.example/content/about"
              />
            </FieldPair>
            <BodyEditor value="Placeholder: a second description of the service, written by an administrator." />
            <PublishRow mode="create" hinted={false} />
          </PageForm>
        </Form>
      </ContentPage>
    </SitePage>
  ),
};
