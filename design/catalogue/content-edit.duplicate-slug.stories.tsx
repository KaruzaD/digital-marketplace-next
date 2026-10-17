import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Link } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, DuplicateAddress, FieldPair, ManageHead, PageForm, PublishRow, TitleField } from "./content-kit";
import { ADMIN, Region } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-edit · duplicate-slug — the administrator tried to move "about-us" to "about", where another page is published.
// The service refused: nothing changed on either page, and the address is reported as already in use at the top of the
// section and at the field (R-7.22). Everything typed is kept.
const meta: Meta = { title: "content/content-edit/duplicate-slug", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const DuplicateSlug: StoryObj = {
  render: () => (
    <SitePage viewer={ADMIN} current="content">
      <ContentPage>
        <ManageHead title="About us" />
        <Region id="content-edit-heading" title="Edit the page">
          <DuplicateAddress>
            Another page is already published at /content/about, so your changes were not published.{" "}
            <Link href="#content-slug">Choose a different address</Link>.
          </DuplicateAddress>
          <Form validationBehavior="aria">
            <PageForm>
              <FieldPair>
                <TitleField value="About us" />
                <AddressField
                  value="about"
                  error="Another page already uses this address. Choose a different one."
                  description="Changing the address moves the page at once. Links to the old address will stop working."
                  resulting="https://digital-marketplace.example/content/about"
                />
              </FieldPair>
              <BodyEditor value="Placeholder: a description of the service, written by an administrator." />
              <PublishRow mode="edit" hinted={false} />
            </PageForm>
          </Form>
        </Region>
      </ContentPage>
    </SitePage>
  ),
};
