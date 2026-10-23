import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { InstructionsTab } from "./evaluation-pages";

// evaluation-instructions-twu · default — an evaluator reads the Team With Us evaluation instructions, which are site
// content an administrator edits. Only an evaluator is offered this tab and the Evaluation tab (R-5.34)
const meta: Meta = { title: "evaluation/evaluation-instructions-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <InstructionsTab p={TWU} /> };
