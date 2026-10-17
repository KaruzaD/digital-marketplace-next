import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusEdit } from "./evaluation-pages";

// evaluation-consensus-edit-swu · invalid — changes saved with an agreed score above the maximum, one with three decimal
// places and an empty comment (R-5.22, R-5.29 note)
const meta: Meta = { title: "evaluation/evaluation-consensus-edit-swu/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = { render: () => <ConsensusEdit p={SWU} state="invalid" /> };
