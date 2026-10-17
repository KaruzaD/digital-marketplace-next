import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · not-all-submitted — finalizing was refused because a proponent still under review has no
// submitted consensus. The alert is the same element as the opportunities domain's advance-refused-message (R-5.13)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/not-all-submitted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotAllSubmitted: StoryObj = { render: () => <ConsensusListTab p={SWU} state="not-all-submitted" /> };
