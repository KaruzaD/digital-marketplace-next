import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@bcgov/design-system-react-components";
import { ContentPage } from "./content-kit";
import { PageTitle, Panel, Region } from "./opportunity-kit";
import { SitePage, VISITOR, WIDTHS } from "./site";

// content-service-level-agreement-link · default — the Code With Us learn-more screen, as a visitor who is not signed in
// sees it, where the service level agreement link sits beside the program's cost. The link leads to the page the
// service creates for itself at "service-level-agreement", so it resolves on a fresh installation (R-7.18). The rest of
// the learn-more screen is not designed by this domain and is shown only as a placeholder panel.
const meta: Meta = {
  title: "content/content-service-level-agreement-link/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SitePage viewer={VISITOR}>
      <ContentPage>
        <PageTitle>Code With Us</PageTitle>
        <Panel id="learn-more-placeholder-heading" title="How Code With Us works">
          <p className="op-text">Placeholder: the learn-more screen's own content is not designed by the content domain.</p>
        </Panel>
        <Region id="cost-heading" title="What it costs">
          <p className="op-text">Placeholder: the program's cost, as the learn-more screen states it.</p>
          <p className="op-text">
            What the service commits to, and what it asks of you, is set out in the{" "}
            <Link href="/content/service-level-agreement" data-testid="service-level-agreement-link">
              service level agreement
            </Link>
            .
          </p>
        </Region>
      </ContentPage>
    </SitePage>
  ),
};
