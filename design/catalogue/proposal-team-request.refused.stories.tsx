import type { Meta, StoryObj } from "@storybook/react-vite";
import { Details, PageTitle, Region, VENDOR } from "./opportunity-kit";
import { ProposalPage } from "./proposal-kit";
import { SitePage, WIDTHS } from "./site";

// proposal-team-request · refused — a Team With Us proposal names a person who is not an active member of the
// organization, and names another person twice; the service refuses it and nothing is created (R-2.18). A Sprint With
// Us phase naming one person twice passes validation and fails to store instead, answered with status 503.
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "proposals/proposal-team-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = {
  render: () => (
    <SitePage viewer={VENDOR}>
      <ProposalPage>
        <div className="op-head">
          <p className="op-eyebrow">Response reference: this address answers with data, not a page</p>
          <PageTitle>A team proposal, by request</PageTitle>
        </div>
        <Region id="proposal-team-request-requests" title="Request">
          <Details
            items={[
              {
                term: "Submit a team proposal",
                value:
                  "Sent to /api/proposals/team-with-us, with a team naming a person whose membership of the organization is pending in position 1, and one person in both positions 2 and 3. Sent as a submission rather than a draft.",
                testId: "proposal-team-request-submit",
              },
              { term: "Asked by", value: "The signed-in vendor, for an organization they may submit for" },
            ]}
          />
        </Region>
        <Region id="proposal-team-request-answer" title="Answer">
          <Details
            items={[
              { term: "Proposal accepted", value: "No", testId: "proposal-team-request-accepted" },
              {
                term: "Refusal status",
                value: "400: refused at validation (503 when it fails to store)",
                testId: "proposal-team-request-refusal-status",
              },
              {
                term: "Messages, by where they are reported",
                value: (
                  <ul className="op-list" data-testid="proposal-team-request-refusal-by-field">
                    <li>Team, position 1: “User is not an active member of the organization.”</li>
                    <li>Team: “Please select unique team members.”</li>
                  </ul>
                ),
              },
              {
                term: "Messages, in the service's order",
                value: (
                  <ol className="op-list" data-testid="proposal-team-request-refusal-messages">
                    <li>User is not an active member of the organization.</li>
                    <li>Please select unique team members.</li>
                  </ol>
                ),
              },
              { term: "What changed", value: "Nothing. No proposal is created." },
            ]}
          />
        </Region>
      </ProposalPage>
    </SitePage>
  ),
};
