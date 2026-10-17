import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Link } from "@bcgov/design-system-react-components";
import { AddressField, BodyEditor, ContentPage, FieldPair, PageForm, PublishProblems, PublishRow, TitleField } from "./content-kit";
import { ADMIN, PageTitle } from "./opportunity-kit";
import { SitePage, WIDTHS } from "./site";

// content-create · invalid — the title was left empty and the address typed with capitals and an underscore. Each field
// is marked with its reason when the person leaves it (R-7.20, R-7.21), the problems are listed before the unavailable
// Publish page button, and nothing is saved.
const meta: Meta = { title: "content/content-create/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = {
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
              <TitleField value="" error="Enter a title" />
              <AddressField
                value="Hackathon_Rules"
                error="Use only lowercase letters and numbers joined by single hyphens, like hackathon-rules"
                resulting="shown once the address is valid."
              />
            </FieldPair>
            <BodyEditor value="Placeholder: the rules of the hackathon, written by an administrator." />
            <PublishProblems title="Fix 2 fields to publish the page">
              <li data-testid="field-error"><Link href="#content-title">Title: enter a title</Link></li>
              <li data-testid="field-error"><Link href="#content-slug">Address: use only lowercase letters and numbers joined by single hyphens</Link></li>
            </PublishProblems>
            <PublishRow mode="create" disabled />
          </PageForm>
        </Form>
      </ContentPage>
    </SitePage>
  ),
};
