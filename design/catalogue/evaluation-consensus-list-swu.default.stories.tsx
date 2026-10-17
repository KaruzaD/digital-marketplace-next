import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · default — the chair, who is also an evaluator, part-way through agreeing scores. Submitting
// is not offered until every proponent has a complete consensus (R-5.13, R-5.29, R-5.34)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <ConsensusListTab p={SWU} state="default" /> };
