import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusCreate } from "./evaluation-pages";

// evaluation-consensus-create-twu · invalid — an agreed score above the maximum, one with three decimal places and an
// empty comment, checked by the same rules as an individual evaluation (R-5.22, R-5.29 note)
const meta: Meta = { title: "evaluation/evaluation-consensus-create-twu/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = { render: () => <ConsensusCreate p={TWU} state="invalid" /> };
