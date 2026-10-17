import type { Meta, StoryObj } from "@storybook/react-vite";
import { Region } from "./opportunity-kit";
import { ChangelogRows, ManagementTop, OrganizationPage, type ChangelogEntry } from "./organization-kit";
import { SitePage, WIDTHS } from "./site";
import { VENDOR_ONE } from "./user-kit";

// organization-edit · changelog — every grant and withdrawal of administrator rights and every transfer of
// ownership, most recent first, with whom it concerned, when, and who made it (R-3.33). The story named no viewer; it
// is drawn for the owner, who made the two most recent changes.
const meta: Meta = { title: "organizations/organization-edit/changelog", parameters: { viewport: { options: WIDTHS } } };
export default meta;

const entries: ChangelogEntry[] = [
  { when: "September 14, 2026, 3:05 p.m.", event: "Admin Rights Removed", member: "Test Vendor Four", by: "Test Vendor One" },
  { when: "September 10, 2026, 9:40 a.m.", event: "Admin Rights Given", member: "Test Vendor Four", by: "Test Vendor One" },
  { when: "August 28, 2026, 11:15 a.m.", event: "Ownership Transferred", member: "Test Vendor One", by: "Test Administrator" },
];

export const Changelog: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR_ONE} current="organizations">
      <OrganizationPage>
        <ManagementTop current="changelog" />
        <Region id="tab-heading" title="Changelog">
          <ChangelogRows entries={entries} />
        </Region>
      </OrganizationPage>
    </SitePage>
  ),
};
