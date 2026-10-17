import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · submitted — the chair has submitted. Each consensus can still be reopened and submitted
// again until the scores are finalized, unlike an individual evaluation (R-5.30)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/submitted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Submitted: StoryObj = { render: () => <ConsensusListTab p={SWU} state="submitted" /> };
