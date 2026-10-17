import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-twu · no-screenable — finalizing was refused because no proponent met every minimum score. The
// message names the Challenge, the stage that actually follows on Team With Us (R-5.10)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-twu/no-screenable", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NoScreenable: StoryObj = { render: () => <ConsensusListTab p={TWU} state="no-screenable" /> };
