import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · no-screenable — finalizing was refused because no proponent met every minimum score. The
// message names the Code Challenge, the stage that follows on Sprint With Us (R-5.10)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/no-screenable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NoScreenable: StoryObj = { render: () => <ConsensusListTab p={SWU} state="no-screenable" /> };
