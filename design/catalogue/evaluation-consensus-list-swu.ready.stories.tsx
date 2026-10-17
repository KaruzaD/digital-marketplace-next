import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · ready — every proponent has a complete consensus, so the chair may submit them
// (R-5.13, R-5.31)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/ready", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Ready: StoryObj = { render: () => <ConsensusListTab p={SWU} state="ready" /> };
